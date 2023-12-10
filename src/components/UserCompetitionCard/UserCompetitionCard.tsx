import { formatDateShort } from '@/lib/time';
import Link from 'next/link';
import { CompetitionStatusPill } from '../CompetitionStatusPill';
import {
  Competition,
  CompetitionMetadata,
  UserCompetitionMap,
} from '@/generated/graphql';

interface UserCompetitionCardProps
  extends Pick<Competition, 'name' | 'status'> {
  id: string;
  roles: UserCompetitionMap['roles'];
  wcaId?: CompetitionMetadata['wcaId'];
  startDate?: CompetitionMetadata['startDate'];
}

export function UserCompetitionCard({
  id,
  wcaId,
  name,
  status,
  startDate,
  roles,
}: UserCompetitionCardProps) {
  const compId = wcaId || id;
  const rolesText = roles.join(' & ');
  const dateString = startDate && formatDateShort(startDate);

  return (
    <Link passHref href={`/competitions/${compId}`}>
      <li className="flex flex-col w-full hover:bg-slate-100 hover:opacity-80 p-2 transition-all duration-75 ease-in-out">
        <div className="flex w-full items-baseline">
          <div className="divide-x flex">
            <h3 className="text-xl px-1">{name}</h3>
            <span className="px-1">{dateString}</span>
          </div>
          <div className="flex flex-grow" />
          <CompetitionStatusPill status={status} />
        </div>
        <span className="px-1">{rolesText}</span>
      </li>
    </Link>
  );
}
