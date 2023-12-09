import classNames from 'classnames';
import { ScrollArea } from '../ui/scroll-area';
import { CompetitionStatus } from '@prisma/client';
import { NavLink } from './NavLink';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  compLinks: {
    name: string;
    id: string | number;
    status: CompetitionStatus;
  }[];
}

export function Sidebar({ className, compLinks }: SidebarProps) {
  return (
    <nav className={classNames('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink href="/templates">
              <i className="bx bx-spreadsheet" />
              <span>Templates</span>
            </NavLink>
            <NavLink href="/competitions">
              <i className="bx bxs-cube" />
              <span>Competitions</span>
            </NavLink>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Competitions
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {compLinks?.map(({ id, name, status }) => (
                <NavLink key={id} href={`/competitions/${id}`}>
                  <i
                    className={classNames('bx bxs-circle', {
                      'text-green-500': status === CompetitionStatus.Announced,
                      'text-blue-500': status === CompetitionStatus.Planning,
                      'text-yellow-500': status === CompetitionStatus.Potential,
                    })}
                  />
                  <span>{name}</span>
                </NavLink>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </nav>
  );
}
