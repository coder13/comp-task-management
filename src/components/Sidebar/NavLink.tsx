'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

export const NavLink = ({
  href,
  className = '',
  children,
}: PropsWithChildren<{ href: string; className?: string }>) => {
  const pathname = usePathname();

  return (
    <Link href={href} passHref>
      <Button
        variant="link"
        className={classNames(
          'w-full justify-start flex text-center items-baseline space-x-2',
          {
            'bg-slate-100': pathname === href,
          },

          className,
        )}
      >
        {children}
      </Button>
    </Link>
  );
};
