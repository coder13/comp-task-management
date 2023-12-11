'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { CreateTeamState, createTeam } from '@/app/actions';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';

const initialState: CreateTeamState = {
  message: '',
};

export function CreateTeamForm() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');

  const canSubmit = teamName.length > 0;

  const [state, formAction] = useFormState(createTeam, initialState);

  useEffect(() => {
    if (state.teamId) {
      router.push(`/teams/${state.teamId}`);
    }
  }, [router, state]);

  return (
    <form action={formAction}>
      <div className="max-w-sm space-y-4">
        <div className="grid w-full max-w-md items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            autoFocus
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <SubmitButton disabled={!canSubmit}>Create Team</SubmitButton>
        <p aria-live="polite">{state?.message}</p>
      </div>
    </form>
  );
}
