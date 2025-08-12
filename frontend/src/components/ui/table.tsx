import { ReactNode } from 'react';

type WithClassName = { children: ReactNode; className?: string };

export function Table({ children, className }: WithClassName) {
  return <table className={`w-full text-sm ${className ?? ''}`}>{children}</table>;
}
export function Thead({ children, className }: WithClassName) {
  return <thead className={`bg-muted/60 text-left ${className ?? ''}`}>{children}</thead>;
}
export function Tbody({ children, className }: WithClassName) {
  return <tbody className={className}>{children}</tbody>;
}
export function Tr({ children, className }: WithClassName) {
  return <tr className={`border-t ${className ?? ''}`}>{children}</tr>;
}
export function Th({ children, className }: WithClassName) {
  return <th className={`px-4 py-2 font-medium ${className ?? ''}`}>{children}</th>;
}
export function Td({ children, className }: WithClassName) {
  return <td className={`px-4 py-2 ${className ?? ''}`}>{children}</td>;
}


