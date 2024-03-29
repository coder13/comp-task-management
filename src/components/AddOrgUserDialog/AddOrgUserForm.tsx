'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCallback, useState } from 'react';
import { LoadingButton } from '../Buttons';
import {
  TeamDocument,
  TeamImportableCompetitionsDocument,
  useLinkAndUpsertOrgUserMutation,
} from '@/generated/queries';

export function AddOrgUserForm({
  teamId,
  onSuccess,
}: {
  teamId: number;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [importComps, setImportComps] = useState<boolean>(true);

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
        importComps,
      },
    }).then(() => {
      onSuccess();
    });
  }, [addOrgUser, email, importComps, onSuccess, password, teamId]);

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
        <div className="grid gap-1.5">
          <div className="flex w-full space-x-2">
            <Checkbox
              id="importComps"
              checked={importComps}
              onCheckedChange={(checked) => setImportComps(!!checked)}
            />
            <label
              htmlFor="importComps"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Import or link competitions
            </label>
          </div>
          <p className="text-xs text-neutral-600">
            Looks for competitions already managed by the org user and links
            them to the team if found. Otherwise, imports the competitions.
          </p>
        </div>
        <LoadingButton loading={loading} disabled={!canSubmit}>
          Add Org User
        </LoadingButton>
        <p aria-live="polite">{error?.message}</p>
      </div>
    </form>
  );
}
