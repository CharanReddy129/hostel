import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 bg-muted/30">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ReactQueryProvider>
  );
}


