'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Chip, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { AddCircleOutlineOutlined, DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { createUserAddress, deleteUserAddress, getUserAddresses, setDefaultAddress, type UserAddress, updateUserAddress } from '@/lib/crud/address';
import { UserData } from '@/lib/crud/user';
import { AddressFormType, AddressSchema } from '@/lib/schemas/address-schema';
import styles from './profile-info.module.css';

interface Props {
  user: UserData;
  address: UserAddress[];
}

const emptyAddressValues: AddressFormType = {
  city: '',
  landmark: '',
  state: '',
  pinCode: '',
  isDefault: false,
};

export default function UserAddressTab({ user, address }: Props) {
  const [addresses, setAddresses] = useState<UserAddress[]>(address);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<AddressFormType>({
    resolver: zodResolver(AddressSchema),
    defaultValues: emptyAddressValues,
  });

  const resetForm = () => {
    reset(emptyAddressValues);
    setEditingAddressId(null);
    setIsFormOpen(false);
  };

  const startEdit = (selectedAddress: UserAddress) => {
    reset({
      city: selectedAddress.city,
      landmark: selectedAddress.landmark,
      state: selectedAddress.state,
      pinCode: String(selectedAddress.pinCode),
      isDefault: selectedAddress.isDefault,
    });
    setEditingAddressId(selectedAddress.id);
    setIsFormOpen(true);
  };

  const handleAddressSubmit = async (formData: AddressFormType) => {
    try {
      setSubmitting(true);
      const payload = {
        city: formData.city.trim(),
        landmark: formData.landmark.trim(),
        state: formData.state.trim(),
        pinCode: Number(formData.pinCode),
        isDefault: Boolean(formData.isDefault),
      };
      if (editingAddressId) {
        const updatedAddress = await updateUserAddress(user.email, editingAddressId, payload);
        setAddresses((current) => current.map((add) => (add.id === editingAddressId ? updatedAddress : add)));
      } else {
        const createdAddress = await createUserAddress(user.email, payload);
        setAddresses((current) => [createdAddress, ...current]);
      }
      resetForm();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteUserAddress(user.email, addressId);
      const refreshedAddresses = await getUserAddresses(user.email);
      setAddresses(refreshedAddresses);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(user.email, addressId);
      const refreshedAddresses = await getUserAddresses(user.email);
      setAddresses(refreshedAddresses);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Stack direction={'row'} className={styles.profileInfo}>
        <h2>Address Information</h2>
        {!isFormOpen ? (
          <Button variant="contained" type="button" onClick={() => setIsFormOpen(true)} startIcon={<AddCircleOutlineOutlined />}>
            Add Address
          </Button>
        ) : (
          <Button variant="outlined" type="button" onClick={resetForm}>
            Cancel
          </Button>
        )}
      </Stack>

      {isFormOpen && (
        <Box component="form" onSubmit={handleSubmit(handleAddressSubmit)} sx={{ mb: 3 }}>
          <Stack spacing={2.5}>
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <TextField {...field} fullWidth label="City" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />

            <Controller
              name="landmark"
              control={control}
              render={({ field, fieldState }) => (
                <TextField {...field} fullWidth label="Landmark" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field, fieldState }) => (
                <TextField {...field} fullWidth label="State" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />

            <Controller
              name="pinCode"
              control={control}
              render={({ field, fieldState }) => (
                <TextField {...field} fullWidth label="Pin Code" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />

            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={Boolean(field.value)} onChange={(_, checked) => field.onChange(checked)} />}
                  label="Set as default address"
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Saving...' : editingAddressId ? 'Save Changes' : 'Save Address'}
              </Button>
              <Button type="button" variant="outlined" onClick={resetForm}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <Stack spacing={2}>
        {addresses.length === 0 ? (
          <Typography color="text.secondary">No address saved yet.</Typography>
        ) : (
          addresses.map((address) => (
            <Paper key={address.id} variant="outlined" className={styles.addressPaper}>
              <Stack spacing={1.5}>
                <Stack direction="row" className={styles.addressDefault}>
                  <Typography variant="subtitle1">{address.city}</Typography>
                  {address.isDefault ? <Chip color="success" size="small" label="Default" /> : null}
                </Stack>
                <Typography color="text.secondary">{address.landmark}</Typography>
                <Typography color="text.secondary">
                  {address.state} {address.pinCode}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button size="small" variant="outlined" type="button" onClick={() => startEdit(address)} startIcon={<EditOutlined />}>
                    Edit
                  </Button>
                  {!address.isDefault ? (
                    <Button size="small" variant="outlined" type="button" onClick={() => handleSetDefaultAddress(address.id)}>
                      Set Default
                    </Button>
                  ) : null}
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    type="button"
                    onClick={() => handleDeleteAddress(address.id)}
                    startIcon={<DeleteOutlineOutlined />}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
}
