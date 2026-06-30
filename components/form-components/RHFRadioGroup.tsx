'use client';

import { FormControlLabel, FormHelperText, Radio, RadioGroup, RadioGroupProps } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { Stack } from '@mui/material';

export interface RadioOption {
  value: string;
  label: string;
}

export type RHFRadioGroupProps<T extends FieldValues> = Omit<RadioGroupProps, 'name'> &
  UseControllerProps<T> & {
    label?: string;
    options: RadioOption[];
    disabled?: boolean;
    row?: boolean;
  };

export function RHFRadioGroup<T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  label,
  options,
  disabled = false,
  row = false,
  ...rest
}: RHFRadioGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing={1}>
          <RadioGroup {...field} {...rest} row={row} disabled={disabled}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
