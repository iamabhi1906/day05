'use client';

import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

type NumberSpinnerProps = Omit<BaseNumberField.Root.Props, 'value' | 'defaultValue' | 'onValueChange'> & {
  value: number;
  onChange: (value: number | null) => void;
  label?: React.ReactNode;
  size?: 'small' | 'medium';
  error?: boolean;
};

export default function NumberSpinner({ id: idProp, value, onChange, label, error = false, size = 'medium', ...other }: NumberSpinnerProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  return (
    <BaseNumberField.Root
      {...other}
      value={value}
      onValueChange={onChange}
      render={(props, state) => (
        <FormControl
          ref={props.ref}
          size={size}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant="outlined"
          sx={{
            '& .MuiButton-root': {
              minWidth: 0,
              bgcolor: 'action.hover',
              borderColor: 'divider',
              '&:not(.Mui-disabled)': {
                color: 'text.primary',
              },
            },
          }}
        >
          {props.children}
        </FormControl>
      )}
    >
      {label && (
        <BaseNumberField.ScrubArea
          render={
            <Box
              component="span"
              sx={{
                userSelect: 'none',
                width: 'max-content',
              }}
            />
          }
        >
          <FormLabel
            htmlFor={id}
            sx={{
              display: 'inline-block',
              cursor: 'ew-resize',
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.5,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {label}
          </FormLabel>

          <BaseNumberField.ScrubAreaCursor>
            <OpenInFullIcon
              fontSize="small"
              sx={{
                transform: 'translateY(12.5%) rotate(45deg)',
              }}
            />
          </BaseNumberField.ScrubAreaCursor>
        </BaseNumberField.ScrubArea>
      )}

      <Box sx={{ display: 'flex' }}>
        <BaseNumberField.Decrement
          render={
            <Button
              variant="outlined"
              size={size}
              aria-label="Decrease"
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: 0,
                '&.Mui-disabled': {
                  borderRight: 0,
                },
              }}
            />
          }
        >
          <RemoveIcon fontSize={size} />
        </BaseNumberField.Decrement>

        <BaseNumberField.Input
          id={id}
          render={(props, state) => (
            <OutlinedInput
              inputRef={props.ref}
              value={state.inputValue}
              onChange={props.onChange}
              onBlur={props.onBlur}
              // onFocus={props.onFocus}
              onKeyDown={props.onKeyDown}
              onKeyUp={props.onKeyUp}
              slotProps={{
                input: {
                  ...props,
                  size: Math.max(String(other.min ?? '').length, state.inputValue.length || 1) + 1,
                  sx: {
                    textAlign: 'center',
                  },
                },
              }}
              sx={{
                flex: 1,
                borderRadius: 0,
                pr: 0,
              }}
            />
          )}
        />

        <BaseNumberField.Increment
          render={
            <Button
              variant="outlined"
              size={size}
              aria-label="Increase"
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: 0,
                '&.Mui-disabled': {
                  borderLeft: 0,
                },
              }}
            />
          }
        >
          <AddIcon fontSize={size} />
        </BaseNumberField.Increment>
      </Box>
    </BaseNumberField.Root>
  );
}
