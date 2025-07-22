'use client';

interface StatusFilterProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'canceled', label: 'Canceled' },
];

export function StatusFilter({ statusFilter, onStatusChange }: StatusFilterProps) {
  return (
    <select
      className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-gray-700"
      value={statusFilter}
      onChange={(e) => onStatusChange(e.target.value)}
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value} className="py-1">
          {option.label}
        </option>
      ))}
    </select>
  );
} 