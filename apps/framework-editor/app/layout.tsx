import { Toaster } from '@comp/ui/toaster';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { type ReactNode } from 'react';
import { MenuTabs } from './components/MenuTabs';

import '@comp/ui/globals.css';
import { headers } from 'next/headers';
import 'react-datasheet-grid/dist/style.css';
import '../styles/globals.css';
import { Header } from './components/HeaderFrameworks';
import { auth } from './lib/auth';

export const metadata: Metadata = {
  title: 'Comp AI - Framework Editor',
  description: 'Edit your framework',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const hasSession = session?.session.id && session.user.email.split('@')[1] === 'trycomp.ai';

  return (
    <html lang="en" className="h-full">
      <body>
        <NuqsAdapter>
          {hasSession && <Header />}
          <div className="flex h-full w-screen flex-col gap-2 p-4">
            {hasSession && <MenuTabs />}
            {children}
            <Toaster />
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
