'use client';

import classNames from 'classnames';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  compLinks: {
    name: string;
    id: string | number;
  }[];
}

export function Sidebar({ className, compLinks }: SidebarProps) {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className={classNames('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link href="/templates" passHref>
              <Button
                variant="link"
                className="w-full justify-start flex text-center items-baseline space-x-2"
              >
                <i className="bx bx-notepad" />
                <span>Templates</span>
              </Button>
            </Link>
            <Link href="/competitions" passHref>
              <Button
                variant="link"
                className="w-full justify-start flex text-center items-baseline space-x-2"
              >
                <i className="bx bxs-cube" />
                <span>Competitions</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Competitions
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {compLinks?.map(({ id, name }) => (
                <Link key={id} href={`/competitions/${id}`} passHref>
                  <Button
                    variant="ghost"
                    className={classNames(
                      'w-full justify-start flex text-center items-baseline space-x-2',
                      {
                        'bg-slate-100': pathname === `/competitions/${id}`,
                      },
                    )}
                  >
                    <i className="bx bxs-circle" />
                    <span>{name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </nav>
  );
}
