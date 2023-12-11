'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { useCallback, useState } from 'react';
import { SubmitButton } from '../SubmitButton';
import { AddOrgUserState, addOrgUser } from '@/app/actions';

const initialState: AddOrgUserState = {
  message: '',
};

export function AddOrgUserForm({ teamId }: { teamId: number }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = username && password;

  const [state, formAction] = useFormState(addOrgUser, initialState);

  const addOrgUserWithTeam = useCallback(() => {
    const formData = new FormData();
    formData.append('teamId', teamId.toString());
    formData.append('email', username);
    formData.append('password', password);

    formAction(formData);
  }, [formAction, password, teamId, username]);

  return (
    <form action={addOrgUserWithTeam}>
      <input type="hidden" name="teamId" value={teamId} />
      <div className="max-w-screen-md space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Email</Label>
          <Input
            type="text"
            name="email"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Password</Label>
          <Input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <SubmitButton disabled={!canSubmit}>Add Org User</SubmitButton>
        <p aria-live="polite">{state?.message}</p>
      </div>
    </form>
  );
}
