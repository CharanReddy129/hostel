import type { TableHTMLAttributes, HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export function Table({ className, children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`w-full text-sm ${className ?? ''}`} {...props}>
      {children}
    </table>
  );
}
export function Thead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-muted/60 text-left ${className ?? ''}`} {...props}>
      {children}
    </thead>
  );
}
export function Tbody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}
export function Tr({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-t ${className ?? ''}`} {...props}>
      {children}
    </tr>
  );
}
export function Th({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-2 font-medium ${className ?? ''}`} {...props}>
      {children}
    </th>
  );
}
export function Td({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-2 ${className ?? ''}`} {...props}>
      {children}
    </td>
  );
}


