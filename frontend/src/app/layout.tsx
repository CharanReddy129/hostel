import './globals.css';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Hostel Admin',
  description: 'Admin portal for Hostel/PG Management SaaS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


