import React, { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { handleOtpVerification } from '@/lib/api/auth/sign-up';
import { useStepper } from '@/components/ui/stepper';
import { Spinner } from '@/components/ui/spinner';
import { useEmailStore } from '@/lib/stores/email-store';
import { toast } from 'sonner';

const VerifyOtp = () => {
  const [state, formAction, isPending] = useActionState(
    handleOtpVerification,
    null
  );
  const stepper = useStepper();
  const { email } = useEmailStore();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      stepper.nextStep();
    }
  }, [state, stepper]);

  return (
    <form action={formAction} className="space-y-4 flex flex-col items-center">
      <input type="hidden" name="email" value={email} />
      <InputOTP defaultValue={state?.inputs?.otp} maxLength={6} name="otp">
        <InputOTPGroup>
          {[...Array(6)].map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {state?.errors?.otp && (
        <p className="text-sm text-destructive mt-2">{state.errors.otp}</p>
      )}
      {state?.errors?.email && (
        <p className="text-sm text-destructive mt-2">{state.errors.email}</p>
      )}
      {state?.errors?.general && (
        <p className="text-sm text-destructive">{state.errors.general}</p>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner className="size-4" /> : 'Verify OTP'}
      </Button>
    </form>
  );
};

export { VerifyOtp };
