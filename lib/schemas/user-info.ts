import z from 'zod';

export const UserInfoSchema = z.object({
  role: z.string(),
  name: z.string('Name must be valid string').min(3, 'Name must be of at lest 3 latter long').max(30, 'Name is too long'),
  phone: z.string('Number Must be a String').min(10, 'Number must be of 10 digit').max(13, 'Number is too long'),
});

export type UserInfoType = z.infer<typeof UserInfoSchema>;
