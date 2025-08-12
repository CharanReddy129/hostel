import { SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = SelectHTMLAttributes<HTMLSelectElement> & { className?: string };

export function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={twMerge(
        'h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}


