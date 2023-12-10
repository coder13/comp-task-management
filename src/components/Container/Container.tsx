import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export const Container = ({
  children,
  className = '',
  rootClassName = '',
}: PropsWithChildren<{
  className?: string;
  rootClassName?: string;
}>) => (
  <div className={classNames('flex flex-col items-center', rootClassName)}>
    <div
      className={classNames('flex w-full max-w-screen-md flex-col', className)}
    >
      {children}
    </div>
  </div>
);
