'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCallback, useState } from 'react';
import { LoadingButton } from '../Buttons';
import {
  TeamDocument,
  TeamImportableCompetitionsDocument,
  useLinkAndUpsertOrgUserMutation,
} from '@/generated/queries';

export function RevalidateCredentialsOrgUserForm({
  teamId,
  onSuccess,
}: {
  teamId: number;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [addOrgUser, { error, loading }] = useLinkAndUpsertOrgUserMutation({
    refetchQueries: [TeamDocument, TeamImportableCompetitionsDocument],
  });

  const canSubmit = email && password;

  const handleAddOrgUser = useCallback(() => {
    if (!email || !password) return;

    addOrgUser({
      variables: {
        email,
        password,
        teamId,
        importComps: false,
      },
    }).then(() => {
      onSuccess();
    });
  }, [addOrgUser, email, onSuccess, password, teamId]);

  return (
    <form action={handleAddOrgUser}>
      <input type="hidden" name="teamId" value={teamId} />
      <div className="max-w-screen-md space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Email</Label>
          <Input
            type="text"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-neutral-600">
            When you provide a password, tokens are obtained, stored, and used
            to fetch data. The password does not get stored and is only used
            when initially fetching access tokens.
          </p>
        </div>
        <LoadingButton loading={loading} disabled={!canSubmit}>
          Log in
        </LoadingButton>
        <p aria-live="polite">{error?.message}</p>
      </div>
    </form>
  );
}
