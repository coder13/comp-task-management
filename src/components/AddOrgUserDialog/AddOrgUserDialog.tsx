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

export function AddOrgUserDialog({ teamId }: { teamId: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <i className="bx bx-plus mr-1 text-lg" />
          Add Org User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Org User</DialogTitle>
          <DialogDescription>
            <p>
              Org Users allow you to manage competitions you&apos;re not
              directly managing.
            </p>
          </DialogDescription>
        </DialogHeader>
        <AddOrgUserForm teamId={teamId} />
      </DialogContent>
    </Dialog>
  );
}
