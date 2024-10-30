import React from 'react';
import { Grid, Typography } from '@mui/material';
import FixedTextField from './CustomTextField';
import { fieldConfigurations } from './hooks/variable';

interface ReportSectionProps {
    title: string;
    fields: string[];
    state: any;
    handleChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, fields, state, handleChange }) => {
    return (
        <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                {title}
            </Typography>
            <Grid container spacing={2}>
                {fields.map((fieldKey) => {
                    const config = fieldConfigurations[fieldKey as keyof typeof fieldConfigurations];

                    if (!config) {
                        console.error(`Field configuration for "${fieldKey}" not found.`);
                        return null;
                    }

                    const fieldValue = (config.type === 'number' || config.type === 'money') 
                        ? state[fieldKey]?.toString() 
                        : state[fieldKey];

                    return (
                        <Grid
                            key={fieldKey}
                            item
                            xs={4}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <FixedTextField
                                label={config.label}
                                value={config.type === 'money' ? fieldValue.toString().replace(/\./g, ',') : fieldValue}
                                //value={fieldValue}
                                onChange={handleChange(fieldKey)}
                                type={config.type as 'number' | 'money' | 'slash'}
                                variant="outlined"
                                sx={{ width: '450px' }}
                                size="small"
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

export default ReportSection;
