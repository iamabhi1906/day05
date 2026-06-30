'use client';

import { updateUserByEmail, UserData } from '@/lib/crud/user';
import { UserInfoSchema, UserInfoType } from '@/lib/schemas/user-info';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './profile-info.module.css';

interface Props {
  data: UserData;
}

export default function UserInfo({ data }: Props) {
  const [user, setUser] = useState<UserData>(data);
  const [disabled, setDisabled] = useState(true);

  const { control, handleSubmit } = useForm<UserInfoType>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      name: user.name ?? '',
      phone: user.phone ?? '',
      role: user.role ?? '',
    },
  });

  const onSubmit = async (formData: UserInfoType) => {
    const tempUser = await updateUserByEmail(user.email, formData);
    if (!tempUser) return;
    setUser(tempUser);
    setDisabled(true);
  };

  const toggleDisable = () => {
    setDisabled((prev) => {
      console.log('disabled:', !prev);
      return !prev;
    });
  };

  return (
    <Box>
      {disabled && (
        <Stack direction={'row'} className={styles.profileInfo}>
          <h2>User Information</h2>
          <Button variant="contained" onClick={toggleDisable} type="button">
            Edit
          </Button>
        </Stack>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {!disabled && (
          <Stack direction={'row'} className={styles.profileInfo}>
            <h2>User Information</h2>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Stack>
        )}
        <Stack spacing={3}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Name"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <TextField fullWidth label="Email" disabled value={user.email} />

          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>Role</InputLabel>
                <Select {...field} label="Role" disabled={disabled}>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="vendor">Vendor</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Stack>
      </Box>
    </Box>
  );
}
