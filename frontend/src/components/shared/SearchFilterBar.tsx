"use client";
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChangeEvent } from 'react';

type Props = {
  onSearch: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  onStatusChange?: (value: string) => void;
};

export function SearchFilterBar({ onSearch, statusOptions, onStatusChange }: Props) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value);
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) => onStatusChange?.(e.target.value);
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <Input placeholder="Search..." onChange={handleSearch} />
      </div>
      {statusOptions && (
        <div className="w-full md:w-48">
          <Select onChange={handleStatus}>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      )}
      <Button variant="outline">Clear</Button>
    </div>
  );
}


