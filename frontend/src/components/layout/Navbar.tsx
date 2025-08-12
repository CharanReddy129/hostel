"use client";
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="border-b bg-white">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-lg font-semibold">
            Hostel Admin
          </Link>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 border border-blue-200">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>admin@example.com</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border hover:bg-muted"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center">A</div>
        </div>
      </div>
    </header>
  );
}


