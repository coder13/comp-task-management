'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TeamDocument,
  useImportCompetitionMutation,
  useTeamImportableCompetitionsQuery,
} from '@/generated/queries';
import { Reference } from '@apollo/client';
import { Fragment, useCallback } from 'react';

export function ImportableCompetitionsList({ teamId }: { teamId: number }) {
  const { data, loading } = useTeamImportableCompetitionsQuery({
    variables: {
      id: teamId,
    },
    errorPolicy: 'ignore',
  });
  const team = data?.team;

  const [importCompetition] = useImportCompetitionMutation({
    refetchQueries: [TeamDocument],
    update(cache, { data }) {
      // removes competition from importable list after success
      const importedCompetition = data?.importCompetition;
      if (!importedCompetition) {
        return;
      }

      const wcaId = importedCompetition.Metadata?.wcaId;

      const orgUserForImportedComp = team?.OrgUsers?.find((orgUser) => {
        return orgUser?.importableCompetitions?.find((comp) => {
          return comp?.id === wcaId;
        });
      });

      if (!orgUserForImportedComp || !wcaId) {
        return;
      }

      cache.modify({
        id: cache.identify(orgUserForImportedComp),
        fields: {
          importableCompetitions(importableComps = [], { readField }) {
            return importableComps.filter(
              (ref: Reference) => wcaId !== readField('id', ref),
            );
          },
        },
      });
    },
  });

  const handleImportCompetition = useCallback(
    (wcaId: string, orgUserId: number) => {
      importCompetition({
        variables: {
          wcaId,
          teamId,
          orgUserId,
        },
      });
    },
    [importCompetition, teamId],
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between py-2 items-baseline">
        <h3 className="text-lg font-bold">Importable Competitions</h3>
      </div>
      <ul className="space-y-1">
        {team?.OrgUsers?.map((orgUser) => (
          <Fragment key={orgUser.id}>
            {orgUser?.importableCompetitions
              ?.sort((a, b) => a.start_date.localeCompare(b.start_date))
              .map(({ id, name, start_date }) => {
                return (
                  <li key={id} className="flex justify-between">
                    <Button
                      variant="ghost"
                      className="w-full justify-start items-baseline"
                      onClick={handleImportCompetition.bind(
                        null,
                        id,
                        orgUser.id,
                      )}
                    >
                      <div>
                        <i className="bx bx-import mr-2 text-lg" />
                      </div>
                      <div>
                        <span>{name}</span>
                        <span>{start_date}</span>
                      </div>
                    </Button>
                  </li>
                );
              })}
          </Fragment>
        ))}
        {loading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-8" />)}
      </ul>
    </div>
  );
}
