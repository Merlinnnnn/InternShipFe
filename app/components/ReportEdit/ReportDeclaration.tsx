import React, { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Container, Button, TextField, Grid, Typography, Toolbar, AppBar, IconButton } from '@mui/material';
import Layout from '../layout';
import { useReducer } from 'react';
import { initialState } from './hooks/initialState';
import { useReducerReport } from './hooks/useReducerReport';
import ReportSection from './ReportSection';
import { fieldConfigurations } from './hooks/variable';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import HistoryIcon from '@mui/icons-material/History';
import HistoryDiolog from './HistoryDiolog';

interface StateType {
  [key: string]: string | number;
}

interface ReportData {
  healthServiceProvider: string;
  safetyServiceProvider: string;
}

interface ApiResponseData {
  url: string;
}

type CombinedType = StateType & ReportData;

const ReportDeclaration: React.FC = () => {
  const [state, dispatch] = useReducer(useReducerReport, initialState);
  const router = useRouter();

  const [healthServiceProvider, setHealthServiceProvider] = useState('');
  const [safetyServiceProvider, setSafetyServiceProvider] = useState('');
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState(1);
  const [saveEdits, setSaveEdits] = useState(false);
  const [openDialog, setOpenDiolog] = useState(true);
  const { reportId } = useAppContext();

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const config = fieldConfigurations[field as keyof typeof fieldConfigurations];
    let value: string | number = event.target.value;

    if (config.type === 'number' || config.type === 'money') {
      value = value.replace(/,/g, '.');
      value = parseFloat(value);
      if (isNaN(value)) {
        value = 0;
      }
    }
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const fetchData = async (id: string) => {
    try {
      const res = await apiService.get(`/report/detail/${id}`);
      console.log(res);
      const data = res.data as ReportData;

      if (data.healthServiceProvider && data.safetyServiceProvider) {
        await new Promise<void>((resolve) => {
          setHealthServiceProvider(data.healthServiceProvider);
          console.log(data.healthServiceProvider);
          resolve();
        }).then(() => {
          setSafetyServiceProvider(data.safetyServiceProvider);
          console.log(data.safetyServiceProvider);
        });
      }

      if (res.status === 200 && data) {
        const stateData: CombinedType = Object.keys(initialState).reduce((acc, key) => {
          if (data.hasOwnProperty(key)) {
            acc[key] = data[key as keyof ReportData];
          }
          return acc;
        }, {} as CombinedType);

        dispatch({ type: 'SET_STATE', payload: stateData });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };
  const setStatusId = async (id: number, statusId: number) => {
    try {
      const res = await apiService.put(`/report/update-status?reportId=${id}&statusId=${statusId}`);
      console.log(res);
    } catch (error) {
      console.error("Failed to reset status:", error);
    }
  }

  useEffect(() => {
    let value = sessionStorage.getItem('key');
    console.log(value);
    if (value) {
      setStatusId(parseInt(value), 2);
      dispatch({ type: 'UPDATE_FIELD', field: 'id', value: parseInt(value) });
      fetchData(value);
    }
  }, []);

  useEffect(() => {
    dispatch({ type: 'UPDATE_FIELD', field: 'healthServiceProvider', value: healthServiceProvider });
  }, [healthServiceProvider]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_FIELD', field: 'safetyServiceProvider', value: safetyServiceProvider });
  }, [safetyServiceProvider]);

  const handleSave = async () => {
    console.log("Form values: ", state);
    //dispatch({ type: 'UPDATE_FIELD', field: 'statusId', value: 2});
    try {
      const res = await apiService.put(`/report/update-report`, state);
      if (res.status == 200) {
        return true
      }
      else
        return false;
    } catch (error) {
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/reportedit');
  };
  const handleRevoke = () => {
    setStatus(1);
    let value = sessionStorage.getItem('key');
    console.log(value);
    if (value) {
      setStatusId(parseInt(value), 1);}
    router.push('/reportedit');
  };

  const handleNext = async () => {
    const isSave = await handleSave();
    if (isSave) {
      let value = sessionStorage.getItem('key');
      const res = await apiService.get<ApiResponseData>(`/report/review/${value}`);
      const url = res.data.url;
      sessionStorage.setItem('url', url);
      setLocalUrl(url);
      setActiveStep(1);
    }
    if (isSave == false) {
      console.log('Cant not save');
    }
  };

  const handleSubmit = async () => {
    //dispatch({ type: 'UPDATE_FIELD', field: 'statusId', value: 3 });
    setStatus(3);
    let value = sessionStorage.getItem('key');
    console.log(value);
    if (value) {
      setStatusId(parseInt(value), 3);}
    router.push('/reportedit');
  };

  const handleSaveEdits = async () => {
    console.log("Form values: ", state);
    try {
      const res = await apiService.put(`/report/update-report`, state);
      setSaveEdits(true);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setSaveEdits(false);
  };

  return (
    <Layout>
      <AppBar position="static"
        sx={{
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          height: '57px',
          width: '100%'
        }}>
        <Toolbar>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'black',
              whiteSpace: 'nowrap'
            }}>
            Report Edit
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', width: '100%', gap: '10px' }}>
            {/* <Button variant="contained" color="primary" onClick={handleSave} sx={{ width: '100px', marginTop: '10px', marginBottom: '10px' }}>
              Save
            </Button> */}
            {/* <IconButton
              sx={{ width: '40px', height: '40px', marginTop: '10px', marginBottom: '10px' }}
              onClick={handleOpenHistory}
            >
              <HistoryIcon sx={{ width: '40px', height: '40px' }} />
            </IconButton> */}
            <Typography
              onClick={handleRevoke}
              sx={{
                width: '120px',
                color: 'gray',
                marginTop: '10px',
                marginBottom: '10px',
                fontWeight: 'bold',
                textTransform: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                border: 'solid black 1px',
                borderRadius: '3px'
              }}
            >
              Revoke
            </Typography>
            {activeStep === 0 ? (
              <>
                <Button
                  onClick={handleSaveEdits}
                  sx={{ width: '120px', color: 'green', marginTop: '10px', marginBottom: '10px', border: 'solid 3px green', fontWeight: 'bold', textTransform: 'none' }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ width: '120px', marginTop: '10px', marginBottom: '10px', textTransform: 'none' }}
                //disabled= {saveEdits ? false : true}
                >
                  Next
                </Button>
              </>
              //&& saveEdits == true
            ) : activeStep === 1 && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                  sx={{ width: '120px', marginTop: '10px', marginBottom: '10px', textTransform: 'none' }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  sx={{ width: '120px', color: 'green', marginTop: '10px', marginBottom: '10px', border: 'solid 3px green', fontWeight: 'bold', textTransform: 'none' }}
                >
                  Submit
                </Button>
              </>
            )}

            {/* <Button onClick={handleCancel} sx={{ width: '120px', color: 'red', marginTop: '10px', marginBottom: '10px', border: 'solid 3px red', fontWeight: 'bold', textTransform: 'none' }}>
              Cancel
            </Button> */}
            <Typography
              onClick={handleCancel}
              sx={{
                width: '120px',
                color: 'gray',
                marginTop: '10px',
                marginBottom: '10px',
                fontWeight: 'bold',
                textTransform: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
              }}
            >
              Cancel
            </Typography>

          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: '93vh', overflow: 'auto' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 5 }}>
            <Box sx={{ width: '40%' }}>
              <Stepper activeStep={activeStep}>
                <Step>
                  <StepLabel>Report Declaration</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Review Report</StepLabel>
                </Step>
              </Stepper>
            </Box>
          </Box>

          {activeStep === 0 ? (
            <Box sx={{ mt: 3 }}>
              <ReportSection
                title="1. Thông tin lao động"
                fields={['totalEmployees', 'hazardousWorkers', 'healthcareWorkers', 'femaleEmployees', 'hazardousEmployees', 'underageEmployees', 'employeesUnder15', 'disabledEmployees', 'elderlyEmployees']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="2. Thông tin tai nạn lao động"
                fields={['totalAccidents', 'fatalities', 'injuredEmployees', 'fatalAccidents', 'totalAccidentCosts', 'lostWorkDays']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="3. Bệnh nghề nghiệp"
                fields={['affectedEmployees', 'newCases', 'sickLeaveDays', 'earlyRetirements', 'totalCosts']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="4. Kết quả phân loại sức khỏe của người lao động"
                fields={['healthCategory1', 'healthCategory2', 'healthCategory3', 'healthCategory4', 'healthCategory5']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="5. Huấn luyện về vệ sinh an toàn lao động"
                fields={['group1TrainingCount', 'group2TrainingCount', 'group3TrainingCount', 'selfTraining', 'outsourcedTraining', 'group4TrainingCount', 'group5TrainingCount', 'group6TrainingCount', 'totalTrainingCosts']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="6. Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLĐ"
                fields={['totalEquipment', 'strictEquipment', 'inspectedEquipment', 'uninspectedEquipment', 'reportedEquipment', 'unreportedEquipment']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="7. Thời gian làm việc, thời gian nghỉ ngơi"
                fields={['totalOvertimeEmployees', 'totalOvertimeHours', 'maxOvertimeHoursPerMonth']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="8. Bồi dưỡng chống độc hại bằng hiện vật"
                fields={['totalBeneficiaries', 'totalAllowanceCosts']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="9. Tình hình quan trắc môi trường"
                fields={['totalMonitoringSamples', 'nonCompliantSamples', 'nonCompliantTemperatureSamples', 'nonCompliantHumiditySamples', 'nonCompliantWindSpeedSamples', 'nonCompliantLightSamples', 'nonCompliantDustSamples', 'nonCompliantNoiseSamples', 'nonCompliantVibrationSamples', 'nonCompliantRadiationSamples', 'nonCompliantToxicGasSamples', 'nonCompliantEMFSamples', 'nonCompliantOtherSamples']}
                state={state}
                handleChange={handleChange}
              />
              <ReportSection
                title="10. Chi phí thực hiện kế hoạch ATVSLĐ"
                fields={['safetyMeasuresCosts', 'hygieneMeasuresCosts', 'ppeCosts', 'trainingCosts', 'employeeHealthcareCosts', 'riskAssessmentCosts', 'otherCosts']}
                state={state}
                handleChange={handleChange}
              />
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                11. Tổ chức cung cấp dịch vụ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <TextField
                    label="Tên tổ chức dịch vụ ATVSLĐ được thuê"
                    variant="outlined"
                    value={safetyServiceProvider}
                    fullWidth
                    size="small"
                    multiline
                    minRows={1}
                    maxRows={5}
                    sx={{ width: '1450px' }}
                    onChange={(e) => setSafetyServiceProvider(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <TextField
                    label="Tên tổ chức dịch vụ y tế được thuê"
                    variant="outlined"
                    value={healthServiceProvider}
                    fullWidth
                    size="small"
                    multiline
                    minRows={1}
                    maxRows={5}
                    sx={{ width: '1450px' }}
                    onChange={(e) => setHealthServiceProvider(e.target.value)}
                  />
                </Grid>
              </Grid>

              <div style={{ marginBottom: '20px' }}>
                <ReportSection
                  title="12. Thời điểm tổ chức tiến hành đánh giá nguy cơ rủi ro về ATVSLĐ"
                  fields={['evaluationDate']}
                  state={state}
                  handleChange={handleChange}
                />
              </div>
            </Box>
          ) : (
            <Box sx={{ height: 'calc(100vh - 57px)', overflow: 'auto' }}>
              <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '850px' }}>
                  {localUrl ? (
                    <iframe
                      src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(localUrl)}`}
                      width="100%"
                      height="100%"
                      title="Word Document Viewer"
                      style={{ border: 'none' }}
                    ></iframe>
                  ) : (
                    <Typography variant="h6" gutterBottom>
                      No report available
                    </Typography>
                  )}
                </Box>
              </Container>
            </Box>
          )}
        </Container>
        {/* <HistoryDiolog open={openDialog} onClose={handleCloseDialog} /> */}
      </Box>
    </Layout>
  );
};

export default ReportDeclaration;
