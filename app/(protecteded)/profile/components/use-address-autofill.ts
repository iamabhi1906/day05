import { useEffect, useRef, useState } from 'react';

type AddressAutofill = { city?: string; state?: string; landmark?: string };
type SetValue = (name: 'city' | 'state' | 'landmark', value: string, options: { shouldDirty: boolean; shouldValidate: boolean }) => void;

const fromPinCode = async (pinCode: string): Promise<AddressAutofill | null> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pinCode}&country=India&format=jsonv2&addressdetails=1&limit=1`);
  if (!response.ok) throw new Error('Unable to fetch address');
  const result = ((await response.json()) as Array<{ address?: Record<string, string> }>)[0];
  return result ? normalize(result.address ?? {}) : null;
};

const fromLocation = async (latitude: number, longitude: number): Promise<AddressAutofill> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`);
  if (!response.ok) throw new Error('Unable to resolve location');
  return normalize(((await response.json()) as { address?: Record<string, string> }).address ?? {});
};

const normalize = (address: Record<string, string>): AddressAutofill => ({
  city: (address.city || address.town || address.village || address.county || '').trim(),
  state: (address.state || address.region || '').trim(),
  landmark: (address.neighbourhood || address.suburb || '').trim(),
});

const apply = (value: AddressAutofill, setValue: SetValue) => {
  setValue('city', value.city ?? '', { shouldDirty: true, shouldValidate: true });
  setValue('state', value.state ?? '', { shouldDirty: true, shouldValidate: true });
  if (value.landmark) setValue('landmark', value.landmark, { shouldDirty: true, shouldValidate: true });
};

export const useAddressAutofill = (pinCode: string, city: string, state: string, setValue: SetValue) => {
  const [status, setStatus] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const lastPinCode = useRef<string | null>(null);

  useEffect(() => {
    if (!/^\d{6}$/.test(pinCode) || lastPinCode.current === pinCode || city.trim() || state.trim()) return;
    lastPinCode.current = pinCode;
    void fromPinCode(pinCode).then((value) => {
      if (!value?.city && !value?.state) setStatus({ type: 'info', message: 'No address match was found for this pin code yet.' });
      else { apply(value, setValue); setStatus({ type: 'success', message: 'Address details were filled from the pin code.' }); }
    }).catch(() => setStatus({ type: 'error', message: 'We could not fetch the address for this pin code.' }));
  }, [city, pinCode, setValue, state]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { setStatus({ type: 'error', message: 'Geolocation is not supported in this browser.' }); return; }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => void fromLocation(position.coords.latitude, position.coords.longitude).then((value) => {
        apply(value, setValue); setStatus({ type: 'success', message: 'Address details were filled from your current location.' });
      }).catch(() => setStatus({ type: 'error', message: 'We could not resolve your current location into an address.' })).finally(() => setIsFetchingLocation(false)),
      () => { setStatus({ type: 'error', message: 'Location permission was denied. Please enter the pin code manually.' }); setIsFetchingLocation(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const resetAutofill = () => { lastPinCode.current = null; setStatus(null); };
  return { autofillStatus: status, isFetchingLocation, resetAutofill, useCurrentLocation };
};
