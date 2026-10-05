'use server';

import { BackgroundNotificationSchema } from '@/lib/schemas/auth';
import { getAuthenticatedAxios } from '../axios';
import { HTTPPlainResp } from '@/lib/types';
import { AxiosError } from 'axios';

interface ActionResponse {
  success: boolean;
  errors?: {
    title?: string;
    desc?: string;
    general?: string;
  };
  message?: string;
}

export async function sendBackgroundNotificationsAction(
  _: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const values = Object.fromEntries(formData.entries());
  const parsed = BackgroundNotificationSchema.safeParse(values);

  if (!parsed.success) {
    const { title: titleError, desc: descError } =
      parsed.error.flatten().fieldErrors;
    return {
      success: false,
      // TODO: handle this a better way
      errors: {
        title: titleError ? titleError[0] : '',
        desc: descError ? descError[0] : '',
      },
    };
  }

  const { title, desc } = parsed.data;
  const axiosInstance = await getAuthenticatedAxios();
  axiosInstance.defaults.headers['Content-Type'] = 'multipart/form-data';

  try {
    const response = await axiosInstance.post<HTTPPlainResp>(
      '/notification/add',
      {
        title,
        desc,
      }
    );

    const { message } = response.data;

    return { success: true, message };
  } catch (error) {
    console.error('Error sending Background notification:', error);

    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      return {
        success: false,
        errors: {
          general: data.message || 'Error sending background notification',
        },
      };
    }

    return {
      success: false,
      errors: {
        general: 'An unexpected error occurred',
      },
    };
  }
}

export default sendBackgroundNotificationsAction;
