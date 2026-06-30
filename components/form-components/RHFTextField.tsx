'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

export type RHFTextFieldProps<T extends FieldValues> = UseControllerProps<T> & {
  label: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
};

export function RHFTextField<T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  label,
  placeholder,
  type = 'text',
  multiline = false,
  minRows,
  maxRows,
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  ...rest
}: RHFTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          type={type}
          label={label}
          placeholder={placeholder}
          multiline={multiline}
          minRows={minRows}
          maxRows={maxRows}
          disabled={disabled}
          fullWidth={fullWidth}
          variant={variant}
          error={!!error}
          helperText={error?.message}
          size="small"
        />
      )}
    />
  );
}
