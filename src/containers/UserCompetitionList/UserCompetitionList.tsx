'use client';

import { UserCompetitionCard } from '@/components/UserCompetitionCard';
import { useUserCompetitionsQuery } from '@/generated/queries';
import { Loader2 } from 'lucide-react';

interface UserCompetitionList {}

export function UserCompetitionList(_: UserCompetitionList) {
  const { data, loading } = useUserCompetitionsQuery();

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!loading && !data?.me?.Competitions?.length) {
    return (
      <div className="w-full flex justify-center">
        <p>No competitions found.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y-2">
      {!loading &&
        data?.me?.Competitions?.map(({ competitionId, Competition, roles }) => (
          <UserCompetitionCard
            key={competitionId}
            id={Competition!.Metadata?.wcaId || competitionId.toString()}
            name={Competition!.name}
            status={Competition!.status}
            startDate={Competition!.Metadata?.startDate}
            roles={roles}
          />
        ))}
    </ul>
  );
}
