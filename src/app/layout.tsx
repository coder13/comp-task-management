import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/providers';
import Header from '@/components/Header/Header';
import classNames from 'classnames';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { getUserSidebarData } from '@/controllers';
import { getUser } from '@/helpers/user';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Cometition Task Manager',
  description: 'Manage tasks related to WCA competitions',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const userData = user?.id ? await getUserSidebarData(user.id) : null;

  const compLinks =
    userData?.Competitions.map(({ competitionId, Competition }) => ({
      id: Competition.MetaData?.wcaId || competitionId,
      name: Competition.name,
    })) || [];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" sizes="any" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
        />
      </head>
      <body
        className={classNames(
          'min-h-screen bg-background font-sans antialiased',
          inter.className,
        )}
      >
        <div className="grid grid-cols-6 h-screen">
          <Sidebar compLinks={compLinks} className="col-span-1 h-screen" />
          <main className="col-span-5 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
