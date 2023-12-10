import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import classNames from 'classnames';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import Providers from '@/providers';

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
        <Providers>
          <div className="flex h-screen">
            <Sidebar className="col-span-1 h-screen w-64" />
            <main className="overflow-y-auto h-screen w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
