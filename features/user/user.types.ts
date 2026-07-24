import z from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.preprocess((value) => (value instanceof Date ? value.toISOString() : value), z.string().nullable().optional()),
  isBlocked: z.boolean(),
});

export interface UserState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type UserData = z.infer<typeof UserSchema>;
