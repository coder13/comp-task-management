import classNames from 'classnames';
import { NavLink } from './NavLink';
import { CompetitionStatus } from '@/generated/queries';
import { CompetitionList } from './CompetitionList';
import Header from './Header';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  compLinks?: {
    name: string;
    id: string | number;
    status: CompetitionStatus;
  }[];
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav className={classNames('pb-12 bg-slate-50', className)}>
      <Header />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink href="/competitions">
              <i className="bx bxs-cube" />
              <span>Competitions</span>
            </NavLink>
            <NavLink href="/templates">
              <i className="bx bx-spreadsheet" />
              <span>Templates</span>
            </NavLink>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Competitions
          </h2>
          <CompetitionList />
        </div>
      </div>
    </nav>
  );
}
