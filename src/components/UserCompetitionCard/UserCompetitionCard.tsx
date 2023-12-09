import { formatDateShort } from '@/lib/time';
import { Competition, CompetitionMetaData } from '@prisma/client';
import Link from 'next/link';

interface UserCompetitionCardProps extends Competition {
  MetaData: CompetitionMetaData | null;
  roles: string[];
}

export function UserCompetitionCard({
  id,
  name,
  MetaData,
  roles,
}: UserCompetitionCardProps) {
  const compId = MetaData?.wcaId || id;
  const rolesText = roles.join(' & ');
  const dateString = MetaData?.startDate && formatDateShort(MetaData.startDate);

  return (
    <Link passHref href={`/competitions/${compId}`}>
      <li className="flex flex-col w-full hover:bg-slate-100 hover:opacity-80 p-2 transition-all duration-75 ease-in-out">
        <div className="flex w-full items-baseline divide-x">
          <h3 className="text-xl px-1">{name}</h3>
          <p className="px-1">{dateString}</p>
        </div>
        <span className="px-1">{rolesText}</span>
      </li>
    </Link>
  );
}
