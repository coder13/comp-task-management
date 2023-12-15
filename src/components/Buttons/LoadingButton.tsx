'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}: ButtonProps & { loading?: boolean }) {
  const isDisabled = disabled || loading;

  return (
    <Button
      type="submit"
      aria-disabled={isDisabled}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="animate-spin mr-2" />}
      {children}
    </Button>
  );
}
