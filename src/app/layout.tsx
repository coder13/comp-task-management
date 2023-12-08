import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/providers';
import Header from '@/components/Header/Header';
import classNames from 'classnames';
import { Sidebar } from '@/components/Sidebar/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Cometition Task Manager',
  description: 'Manage tasks related to WCA competitions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={classNames(
          'min-h-screen bg-background font-sans antialiased',
          inter.className,
        )}
      >
        <div className="grid grid-cols-6 h-screen">
          <Sidebar
            competitions={['foo', 'bar', 'baz']}
            className="col-span-1 h-screen"
          />
          <main className="col-span-5 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
