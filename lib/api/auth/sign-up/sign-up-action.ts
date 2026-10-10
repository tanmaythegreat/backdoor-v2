'use server';

import { EmailSchema, OtpSchema, RegisterUserSchema } from '@/lib/schemas/auth';
import { z } from 'zod';
import { getUnauthenticatedAxios } from '@/lib/api/axios';
import { AxiosError } from 'axios';

interface ActionResponse {
  success: boolean;
  errors?: {
    email?: string;
    otp?: string;
    fullName?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  inputs?: {
    email?: string;
    otp?: string;
    fullName?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
  message: string;
}

const axiosInstance = getUnauthenticatedAxios();
axiosInstance.defaults.headers['Content-Type'] = 'multipart/form-data';

// Server Actions for each step //
export async function handleEmailStep(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    EmailSchema.parse(convertFormDataToRecord(formData));
    const email = formData.get('email');
    console.log('Sending OTP to:', email);
    await axiosInstance.post('/auth/send-otp', {
      email,
    });
    return createSuccessResponse('OTP sent successfully');
  } catch (err) {
    if (err instanceof z.ZodError) {
      return handleZodError(err, formData);
    } else if (err instanceof AxiosError && err.response) {
      const { data } = err.response;
      console.log(data);
      return {
        success: false,
        message: 'Failed to send OTP',
        errors: {
          general: data.message || 'An error occurred while sending OTP',
        },
      };
    }
    return createErrorResponse('An unexpected error occurred');
  }
}

export async function handleOtpVerification(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    OtpSchema.parse(convertFormDataToRecord(formData));
    const otp = formData.get('otp');
    const email = formData.get('email');
    await axiosInstance.post('/auth/verify-otp', {
      otp,
      email,
    });
    return createSuccessResponse('OTP verified successfully');
  } catch (err) {
    if (err instanceof z.ZodError) {
      return handleZodError(err, formData);
    } else if (err instanceof AxiosError && err.response) {
      const { data } = err.response;
      return {
        success: false,
        message: 'Failed to verify OTP',
        errors: {
          general:
            data.message || 'Failed to verify OTP, please try again later.',
        },
      };
    }
    return createErrorResponse('An unexpected error occurred');
  }
}

export async function handleUserRegistration(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    RegisterUserSchema.parse(convertFormDataToRecord(formData));
    await axiosInstance.post('/auth/register', {
      fullname: formData.get('fullname'),
      username: formData.get('username'),
      password: formData.get('password'),
      email: formData.get('email'),
      'ssh-key': '',
    });
    return createSuccessResponse('User registered successfully');
  } catch (err) {
    if (err instanceof z.ZodError) {
      return handleZodError(err, formData);
    } else if (err instanceof AxiosError && err.response) {
      const { data } = err.response;
      console.log(data);
      return {
        success: false,
        message: 'Failed to create user',
        errors: {
          general: data.message,
        },
      };
    }
    return createErrorResponse('An unexpected error occurred');
  }
}

// Utils //
// TODO: Make a common utils for this
function convertFormDataToRecord(formData: FormData): Record<string, string> {
  const record: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      record[key] = value;
    }
  }
  return record;
}

function handleZodError(err: z.ZodError, formData: FormData): ActionResponse {
  const errors: Record<string, string> = {};
  for (const issue of err.errors) {
    const key = issue.path[0] as string;
    errors[key] = issue.message;
  }
  console.log(errors);
  return {
    success: false,
    errors,
    inputs: convertFormDataToRecord(formData),
    message: 'Validation failed',
  };
}

function createErrorResponse(
  message: string,
  errors?: Record<string, string>
): ActionResponse {
  return {
    success: false,
    errors: errors || { general: 'Unexpected error' },
    message,
  };
}

function createSuccessResponse(message: string): ActionResponse {
  return {
    success: true,
    message,
  };
}
