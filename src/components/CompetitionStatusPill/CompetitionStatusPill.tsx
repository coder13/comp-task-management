import { CompetitionStatus } from '@prisma/client';
import classNames from 'classnames';

export function CompetitionStatusPill({
  status,
  className = '',
}: {
  status: CompetitionStatus;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        'relative grid items-center px-2 py-1 font-sans text-xs font-bold  uppercase rounded-md select-none whitespace-nowrap ',
        {
          'text-green-900 bg-green-500/20':
            status === CompetitionStatus.Announced,
          'text-blue-900 bg-blue-500/20': status === CompetitionStatus.Planning,
          'text-yellow-900 bg-yellow-500/20':
            status === CompetitionStatus.Potential,
        },
        className,
      )}
    >
      <div className="absolute w-4 h-4 top-2/4 left-1 -translate-y-2/4">
        <span
          className={classNames(
            "mx-auto mt-1 block h-2 w-2 rounded-full  content-['']",
            {
              'bg-green-900': status === CompetitionStatus.Announced,
              'bg-blue-900': status === CompetitionStatus.Planning,
              'bg-yellow-900': status === CompetitionStatus.Potential,
            },
          )}
        />
      </div>
      <span className="ml-4">{status}</span>
    </div>
  );
}
