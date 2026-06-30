import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
} from '@mui/material';

type Option = {
  label: string;
  value: string | number;
};

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  type?: 'text' | 'password' | 'email' | 'number' | 'select' | 'checkbox' | 'switch' | 'radio';
  label: string;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function InputField<T extends FieldValues>({
  control,
  name,
  type = 'text',
  label,
  placeholder,
  options = [],
  disabled,
  fullWidth = true,
  className,
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        switch (type) {
          case 'select':
            return (
              <FormControl fullWidth={fullWidth} error={!!fieldState.error} className={className}>
                <InputLabel>{label}</InputLabel>

                <Select {...field} label={label}>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );

          case 'checkbox':
            return (
              <FormControlLabel
                className={className}
                control={<Checkbox checked={field.value} onChange={field.onChange} />}
                label={label}
              />
            );

          case 'switch':
            return (
              <FormControlLabel
                className={className}
                control={<Switch checked={field.value} onChange={field.onChange} />}
                label={label}
              />
            );

          case 'radio':
            return (
              <FormControl className={className}>
                <FormLabel>{label}</FormLabel>
                <RadioGroup value={field.value} onChange={field.onChange}>
                  {options.map((option) => (
                    <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                  ))}
                </RadioGroup>
              </FormControl>
            );

          default:
            return (
              <TextField
                {...field}
                type={type}
                label={label}
                value={field.value ?? ''}
                placeholder={placeholder}
                disabled={disabled}
                fullWidth={fullWidth}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                className={className}
              />
            );
        }
      }}
    />
  );
}
