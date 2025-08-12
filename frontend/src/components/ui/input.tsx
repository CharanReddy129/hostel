import { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = InputHTMLAttributes<HTMLInputElement> & { className?: string };

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={twMerge(
        'h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-0 placeholder:text-muted-foreground',
        'focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
      {...props}
    />
  );
});


