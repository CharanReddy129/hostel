import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border bg-card text-card-foreground shadow-sm">{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-medium">{children}</h3>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
}


