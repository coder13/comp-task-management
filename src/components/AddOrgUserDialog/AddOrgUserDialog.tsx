import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AddOrgUserForm } from './AddOrgUserForm';
import { useCallback, useState } from 'react';

export function AddOrgUserDialog({ teamId }: { teamId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <i className="bx bx-plus mr-1 text-lg" />
          Add Org User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Add Org User</DialogTitle>
          <DialogDescription>
            Org Users allow you to manage competitions you&apos;re not directly
            managing.
          </DialogDescription>
        </DialogHeader>
        <AddOrgUserForm teamId={teamId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
