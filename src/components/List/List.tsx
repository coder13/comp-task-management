import classNames from 'classnames';
import { ReactNode } from 'react';

interface ListItemProps {
  primary: ReactNode;
  secondary?: ReactNode;
  onClick?: () => void;
}

export const ListItem = ({ primary, secondary, onClick }: ListItemProps) => {
  return (
    <li className="w-full" onClick={() => onClick?.()}>
      <div className="flex flex-col w-full hover:bg-slate-100 hover:opacity-80 p-2 transition-all duration-75 ease-in-out cursor-pointer">
        <div className="flex w-full items-baseline">
          <div className="flex flex-col">
            <span className="text-lg px-1">{primary}</span>
            <span className="px-1 text-sm font-light">{secondary}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export const List = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <ul className={classNames('divide-y-2', className)}>{children}</ul>;
};
