import { formatDateShort } from '@/lib/time';
import Link from 'next/link';
import { CompetitionStatusPill } from '../CompetitionStatusPill';
import { Competition, CompetitionMetadata } from '@/generated/graphql';

interface TeamCompetitionCardProps
  extends Pick<Competition, 'name' | 'status'> {
  id: string;
  wcaId?: CompetitionMetadata['wcaId'];
  startDate?: CompetitionMetadata['startDate'];
}

export function TeamCompetitionCard({
  id,
  wcaId,
  name,
  status,
  startDate,
}: TeamCompetitionCardProps) {
  const compId = wcaId || id;
  const dateString = startDate && formatDateShort(startDate);

  return (
    <Link passHref href={`/competitions/${compId}`}>
      <li className="flex flex-col w-full hover:bg-slate-100 hover:opacity-80 p-2 transition-all duration-75 ease-in-out">
        <div className="flex w-full items-baseline">
          <div className="divide-x flex">
            <h3 className="text-xl px-1">{name}</h3>
          </div>
          <div className="flex flex-grow" />
          <CompetitionStatusPill status={status} />
        </div>
        <div className="divide-x">
          <span className="px-1">{dateString}</span>
        </div>
      </li>
    </Link>
  );
}
