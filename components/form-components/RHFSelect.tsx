'use client';

import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

export interface SelectOption {
  value: string | number;
  label: string;
}

export type RHFSelectProps<T extends FieldValues> = UseControllerProps<T> & {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
};

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  label,
  options,
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  ...rest
}: RHFSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} error={!!error} size="small">
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            {...rest}
            label={label}
            disabled={disabled}
            variant={variant}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
