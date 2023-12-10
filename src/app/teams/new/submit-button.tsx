'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={disabled || pending}
      disabled={disabled || pending}
      {...props}
    >
      {pending && <Loader2 className="animate-spin mr-2" />}
      Create Team
    </Button>
  );
}
