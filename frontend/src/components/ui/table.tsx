import { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full text-sm">{children}</table>;
}
export function Thead({ children }: { children: ReactNode }) {
  return <thead className="bg-muted/60 text-left">{children}</thead>;
}
export function Tbody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}
export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t">{children}</tr>;
}
export function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-2 font-medium">{children}</th>;
}
export function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}


