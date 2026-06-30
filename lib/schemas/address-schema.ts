import z from 'zod';

export const AddressSchema = z.object({
  city: z.string().min(2, 'City must be at least 2 characters long').max(50, 'City is too long'),
  landmark: z.string().min(3, 'Landmark must be at least 3 characters long').max(100, 'Landmark is too long'),
  state: z.string().min(2, 'State must be at least 2 characters long').max(50, 'State is too long'),
  pinCode: z.string().regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  isDefault: z.boolean(),
});

export type AddressFormType = z.infer<typeof AddressSchema>;
