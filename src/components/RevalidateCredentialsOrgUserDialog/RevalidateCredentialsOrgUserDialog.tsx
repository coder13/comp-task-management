import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { RevalidateCredentialsOrgUserForm } from './RevalidateCredentialsOrgUserForm';
import { useState } from 'react';

export function RevalidateCredentialsOrgUserDialog({
  teamId,
}: {
  teamId: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <i className="bx bx-refresh mr-1 text-lg" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Login again</DialogTitle>
          <DialogDescription>
            The credentials for this user have expired. Please login again.
          </DialogDescription>
        </DialogHeader>
        <RevalidateCredentialsOrgUserForm
          teamId={teamId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
