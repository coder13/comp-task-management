'use client';

import { useUserCompetitionsQuery } from '@/generated/queries';
import { ScrollArea } from '../ui/scroll-area';
import { CompetitionStatus } from '@/generated/graphql';
import classNames from 'classnames';
import { NavLink } from './NavLink';

export function CompetitionList() {
  const { data } = useUserCompetitionsQuery();

  const comps = data?.me?.Competitions || [];

  return (
    <ScrollArea className="px-1 w-full">
      <div className="space-y-1 p-2 text-xs w-full">
        {comps?.map(({ competitionId, Competition }) => {
          const name = Competition?.name || competitionId;
          const status = Competition?.status;
          const id = Competition?.Metadata?.wcaId || competitionId;

          return (
            <NavLink key={id} href={`/competitions/${id}`}>
              <i
                className={classNames('bx bxs-circle', {
                  'text-green-500': status === CompetitionStatus.Announced,
                  'text-blue-500': status === CompetitionStatus.Planning,
                  'text-yellow-500': status === CompetitionStatus.Potential,
                })}
              />
              <span className="whitespace-pre-line w-full text-left text-xs">
                {name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </ScrollArea>
  );
}
