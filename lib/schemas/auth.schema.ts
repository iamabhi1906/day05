import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
    email: z.email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['user', 'vendor'], { message: 'Please select a valid role' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof SignupSchema>;
