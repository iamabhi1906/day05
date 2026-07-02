'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Chip, CircularProgress, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { AddCircleOutlineOutlined, DeleteOutlineOutlined, EditOutlined, MyLocationOutlined } from '@mui/icons-material';
import { createUserAddress, deleteUserAddress, getUserAddresses, setDefaultAddress, type UserAddress, updateUserAddress } from '@/lib/crud/address';
import { UserData } from '@/lib/crud/user';
import { AddressFormType, AddressSchema } from '@/lib/schemas/address-schema';
import styles from './profile-info.module.css';

interface Props {
  user: UserData;
  address: UserAddress[];
}

type AddressAutofill = {
  city?: string;
  state?: string;
  landmark?: string;
};

const emptyAddressValues: AddressFormType = {
  city: '',
  landmark: '',
  state: '',
  pinCode: '',
  isDefault: false,
};

const fetchAddressFromPinCode = async (pinCode: string): Promise<AddressAutofill | null> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pinCode}&country=India&format=jsonv2&addressdetails=1&limit=1`);
  if (!response.ok) {
    throw new Error('Unable to fetch address for that pin code.');
  }

  const payload = (await response.json()) as Array<Record<string, unknown>>;
  const result = payload[0];
  if (!result) {
    return null;
  }

  const address = (result.address as Record<string, string | undefined> | undefined) ?? {};
  return {
    city: (address.city || address.town || address.village || address.county || '').trim(),
    state: (address.state || address.region || '').trim(),
    landmark: (address.neighbourhood || address.suburb || '').trim(),
  };
};

const fetchAddressFromLocation = async (latitude: number, longitude: number): Promise<AddressAutofill | null> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`);
  if (!response.ok) {
    throw new Error('Unable to resolve your current location.');
  }

  const payload = (await response.json()) as { address?: Record<string, string | undefined> };
  const address = payload.address ?? {};
  return {
    city: (address.city || address.town || address.village || address.county || '').trim(),
    state: (address.state || address.region || '').trim(),
    landmark: (address.neighbourhood || address.suburb || '').trim(),
  };
};

export default function UserAddressTab({ user, address }: Props) {
  const [addresses, setAddresses] = useState<UserAddress[]>(address);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [autofillStatus, setAutofillStatus] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const lastAutoFetchPinCodeRef = useRef<string | null>(null);

  const { control, getValues, reset, setValue, trigger } = useForm<AddressFormType>({
    resolver: zodResolver(AddressSchema),
    defaultValues: emptyAddressValues,
  });

  const pinCodeValue = useWatch({ control, name: 'pinCode' });
  const cityValue = useWatch({ control, name: 'city' });
  const stateValue = useWatch({ control, name: 'state' });

  useEffect(() => {
    if (!pinCodeValue || !/^\d{6}$/.test(pinCodeValue)) {
      return;
    }

    if (lastAutoFetchPinCodeRef.current === pinCodeValue || cityValue?.trim() || stateValue?.trim()) {
      return;
    }

    lastAutoFetchPinCodeRef.current = pinCodeValue;
    void (async () => {
      try {
        const autofill = await fetchAddressFromPinCode(pinCodeValue);
        if (autofill?.city || autofill?.state) {
          setValue('city', autofill.city ?? '', { shouldDirty: true, shouldValidate: true });
          setValue('state', autofill.state ?? '', { shouldDirty: true, shouldValidate: true });
          if (autofill.landmark) {
            setValue('landmark', autofill.landmark, { shouldDirty: true, shouldValidate: true });
          }
          setAutofillStatus({ type: 'success', message: 'Address details were filled from the pin code.' });
        } else {
          setAutofillStatus({ type: 'info', message: 'No address match was found for this pin code yet.' });
        }
      } catch {
        setAutofillStatus({ type: 'error', message: 'We could not fetch the address for this pin code.' });
      }
    })();
  }, [cityValue, pinCodeValue, setValue, stateValue]);

  const resetForm = () => {
    reset(emptyAddressValues);
    setEditingAddressId(null);
    setIsFormOpen(false);
    setAutofillStatus(null);
    lastAutoFetchPinCodeRef.current = null;
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
    setAutofillStatus(null);
    lastAutoFetchPinCodeRef.current = String(selectedAddress.pinCode);
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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setAutofillStatus({ type: 'error', message: 'Geolocation is not supported in this browser.' });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const autofill = await fetchAddressFromLocation(position.coords.latitude, position.coords.longitude);
          if (autofill?.city || autofill?.state) {
            setValue('city', autofill.city ?? '', { shouldDirty: true, shouldValidate: true });
            setValue('state', autofill.state ?? '', { shouldDirty: true, shouldValidate: true });
            if (autofill.landmark) {
              setValue('landmark', autofill.landmark, { shouldDirty: true, shouldValidate: true });
            }
            setAutofillStatus({ type: 'success', message: 'Address details were filled from your current location.' });
          } else {
            setAutofillStatus({ type: 'info', message: 'Your location was detected but no address match was returned.' });
          }
        } catch {
          setAutofillStatus({ type: 'error', message: 'We could not resolve your current location into an address.' });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        setAutofillStatus({ type: 'error', message: 'Location permission was denied. Please enter the pin code manually.' });
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    await handleAddressSubmit(getValues());
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} className={styles.profileInfo} spacing={1.5}>
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
        <Box component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
          <Stack spacing={2.5}>
            <Alert severity="info" variant="outlined">
              Enter a 6-digit pin code or allow location access to auto-fill your city and state.
            </Alert>
            {autofillStatus ? (
              <Alert severity={autofillStatus.type} variant="outlined">
                {autofillStatus.message}
              </Alert>
            ) : null}

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
                <TextField
                  {...field}
                  fullWidth
                  label="Pin Code"
                  inputProps={{ maxLength: 6 }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? 'Use this to auto-fill the address details.'}
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleUseCurrentLocation}
                disabled={isFetchingLocation}
                startIcon={isFetchingLocation ? <CircularProgress size={16} color="inherit" /> : <MyLocationOutlined />}
              >
                {isFetchingLocation ? 'Detecting...' : 'Use my location'}
              </Button>
            </Stack>

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
