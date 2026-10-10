import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const EmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const OtpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
});

export const NewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const RegisterUserSchema = z
  .object({
    fullName: z.string().min(3, { message: 'Full name too short' }),
    username: z.string().min(3, { message: 'Username too short' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const BackgroundNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  desc: z.string().min(1, 'Description is required'),
});
