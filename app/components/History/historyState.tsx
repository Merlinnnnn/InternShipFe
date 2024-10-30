export interface HistoryState {
    id: number;
    totalEmployees: number;
    femaleEmployees: number;
    employeesUnder15: number;
    hazardousWorkers: number;
    hazardousEmployees: number;
    disabledEmployees: number;
    healthcareWorkers: number;
    underageEmployees: number;
    elderlyEmployees: number;
    totalAccidents: number;
    fatalities: number;
    fatalAccidents: number;
    totalAccidentCosts: number;
    injuredEmployees: number;
    lostWorkDays: number;
    affectedEmployees: number;
    earlyRetirements: number;
    newCases: number;
    totalCosts: number;
    sickLeaveDays: number;
    healthCategory1: number;
    healthCategory2: number;
    healthCategory3: number;
    healthCategory4: number;
    healthCategory5: number;
    group1TrainingCount: string;
    selfTraining: string;
    group2TrainingCount: string;
    outsourcedTraining: string;
    group3TrainingCount: string;
    group4TrainingCount: string;
    group5TrainingCount: string;
    group6TrainingCount: string;
    totalTrainingCosts: number;
    totalEquipment: number;
    uninspectedEquipment: number;
    strictEquipment: number;
    inspectedEquipment: number;
    unreportedEquipment: number;
    reportedEquipment: number;
    totalOvertimeEmployees: number;
    totalOvertimeHours: number;
    maxOvertimeHoursPerMonth: number;
    totalBeneficiaries: number;
    totalAllowanceCosts: number;
    totalMonitoringSamples: number;
    nonCompliantSamples: number;
    nonCompliantTemperatureSamples: string;
    nonCompliantLightSamples: string;
    nonCompliantVibrationSamples: string;
    nonCompliantEMFSamples: string;
    nonCompliantHumiditySamples: string;
    nonCompliantNoiseSamples: string;
    nonCompliantToxicGasSamples: string;
    nonCompliantOtherSamples: string;
    nonCompliantWindSpeedSamples: string;
    nonCompliantDustSamples: string;
    nonCompliantRadiationSamples: string;
    safetyMeasuresCosts: number;
    hygieneMeasuresCosts: number;
    ppeCosts: number;
    trainingCosts: number;
    employeeHealthcareCosts: number;
    riskAssessmentCosts: number;
    otherCosts: number;
    safetyServiceProvider: string;
    healthServiceProvider: string;
    evaluationDate: string;
  }
  
  export const initialState: HistoryState = {
    id: 0,
    totalEmployees: 0,
    femaleEmployees: 0,
    employeesUnder15: 0,
    hazardousWorkers: 0,
    hazardousEmployees: 0,
    disabledEmployees: 0,
    healthcareWorkers: 0,
    underageEmployees: 0,
    elderlyEmployees: 0,
    totalAccidents: 0,
    fatalities: 0,
    fatalAccidents: 0,
    totalAccidentCosts: 0,
    injuredEmployees: 0,
    lostWorkDays: 0,
    affectedEmployees: 0,
    earlyRetirements: 0,
    newCases: 0,
    totalCosts: 0,
    sickLeaveDays: 0,
    healthCategory1: 0,
    healthCategory2: 0,
    healthCategory3: 0,
    healthCategory4: 0,
    healthCategory5: 0,
    group1TrainingCount: '0/0',
    selfTraining: '0/0',
    group2TrainingCount: '0/0',
    outsourcedTraining: '0/0',
    group3TrainingCount: '0/0',
    group4TrainingCount: '0/0',
    group5TrainingCount: '0/0',
    group6TrainingCount: '0/0',
    totalTrainingCosts: 0,
    totalEquipment: 0,
    uninspectedEquipment: 0,
    strictEquipment: 0,
    inspectedEquipment: 0,
    unreportedEquipment: 0,
    reportedEquipment: 0,
    totalOvertimeEmployees: 0,
    totalOvertimeHours: 0,
    maxOvertimeHoursPerMonth: 0,
    totalBeneficiaries: 0,
    totalAllowanceCosts: 0,
    totalMonitoringSamples: 0,
    nonCompliantSamples: 0,
    nonCompliantTemperatureSamples: '0/0',
    nonCompliantLightSamples: '0/0',
    nonCompliantVibrationSamples: '0/0',
    nonCompliantEMFSamples: '0/0',
    nonCompliantHumiditySamples: '0/0',
    nonCompliantNoiseSamples: '0/0',
    nonCompliantToxicGasSamples: '0/0',
    nonCompliantOtherSamples: '0/0',
    nonCompliantWindSpeedSamples: '0/0',
    nonCompliantDustSamples: '0/0',
    nonCompliantRadiationSamples: '0/0',
    safetyMeasuresCosts: 0,
    hygieneMeasuresCosts: 0,
    ppeCosts: 0,
    trainingCosts: 0,
    employeeHealthcareCosts: 0,
    riskAssessmentCosts: 0,
    otherCosts: 0,
    safetyServiceProvider: '',
    healthServiceProvider: '',
    evaluationDate: '',
  };
  