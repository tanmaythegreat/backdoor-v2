'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedAxios } from '../axios';
import { AxiosError } from 'axios';

export async function submitFlag(_: unknown, formData: FormData) {
  try {
    const challengeId = formData.get('challengeId') as string;
    const flag = formData.get('flag') as string;

    //TODO: Implement submission logic
    console.log('Submitting flag:', { challengeId, flag });
    const axios = await getAuthenticatedAxios();
    axios.defaults.headers['Content-Type'] = 'multipart/form-data';

    const res = await axios.post('/submit/challenge', {
      chall_id: challengeId,
      flag,
    });
    const {
      message,
      success,
    }: {
      message: string;
      success: boolean;
    } = res.data;
    console.log('submit response: ', res);
    revalidatePath('/dashboard/challenge');
    return { message, success };
  } catch (error) {
    console.error('Error submitting flag:', error);
    return { error: 'Something went wrong. Please try again.', success: false };
  }
}

export async function getHintDetails(hintId: number) {
  try {
    const axios = await getAuthenticatedAxios();

    const res = await axios.get(`/info/hint/${hintId}`);
    const data = res.data;

    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error redeeming hint:', error);

    let errorMessage = 'Failed to redeem hint. Please try again.';
    if (error instanceof AxiosError && error.response?.data) {
      errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function redeemHint(hintId: number) {
  try {
    const axios = await getAuthenticatedAxios();

    const res = await axios.post(`/info/hint/${hintId}`);
    const data = res.data;

    revalidatePath('/dashboard/challenge');
    return { success: true, data };
  } catch (error: unknown) {
    console.error('Error redeeming hint:', error);

    let errorMessage = 'Failed to redeem hint. Please try again.';
    if (error instanceof AxiosError && error.response?.data) {
      errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
