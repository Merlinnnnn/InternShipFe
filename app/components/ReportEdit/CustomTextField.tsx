import React, { useEffect, useState } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

interface FixedTextFieldProps extends Omit<TextFieldProps, 'type'> {
  label: string;
  type: 'number' | 'slash' | 'money';
  value?: string;
}

const FixedTextField: React.FC<FixedTextFieldProps> = ({ label, type, onChange, value = '0/0', ...props }) => {
  const [internalValue, setInternalValue] = useState(type === 'slash' ? '0/0' : '');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    if (type === 'slash' && !value) {
      setInternalValue('0/0');
    } else {
      setInternalValue(value || '');
    }
  }, [type, value]);

  const handleInternalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (type === 'slash') {
      inputValue = inputValue.replace(/\s/g, '');
      const [beforeSlash, afterSlash] = inputValue.split('/');
      const newBeforeSlash = beforeSlash || '0';
      const newAfterSlash = afterSlash || '0';

      inputValue = `${newBeforeSlash}/${newAfterSlash}`;

      if (/\D/.test(newBeforeSlash) || /\D/.test(newAfterSlash)) {
        setError(true);
        setHelperText('Input value must be a number');
      } else {
        setError(false);
        setHelperText('');
      }
    } else if (type === 'number') {
      if (/\D/.test(inputValue)) {
        setError(true);
        setHelperText('Input value must be a number');
      } else {
        setError(false);
        setHelperText('');
      }
    } else if (type === 'money') {
      if (!/^\d*\,?\d*$/.test(inputValue)) {
        setError(true);
        setHelperText('Input value must be a decimal');
      } else {
        setError(false);
        setHelperText('');
      }
    }

    setInternalValue(inputValue);

    if (onChange) {
      onChange({ ...event, target: { ...event.target, value: inputValue } });
    }
  };

  return (
    <TextField
      label={label}
      value={internalValue}
      error={error}
      helperText={error ? helperText : ''}
      onChange={handleInternalChange}
      InputProps={{
        endAdornment: type === 'money' ? <InputAdornment position="end">Triệu đồng</InputAdornment> : undefined,
      }}
      {...props}
    />
  );
};

export default FixedTextField;
