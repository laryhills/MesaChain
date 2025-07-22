'use client';

import { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { StatusFilter } from './StatusFilter';
import { OrderTable } from './OrderTable';
import { Pagination } from './Pagination';
import { Order, SortConfig, SortField } from './types';

// Mock data
const mockOrders: Order[] = [
  {
    id: '12345',
    items: ['1× Cola', '1× Water'],
    date: 'Apr 26, 2025',
    amount: 4.33,
    status: 'Completed',
  },
  {
    id: '12344',
    items: ['1× Salad', '1× Cola'],
    date: 'Apr 25, 2025',
    amount: 10.82,
    status: 'Completed',
  },
  {
    id: '12343',
    items: ['1× Fries', '2× Cola'],
    date: 'Apr 25, 2025',
    amount: 8.83,
    status: 'Pending',
  },
  {
    id: '12342',
    items: ['1× Salad', '1× Water', '1× Fries'],
    date: 'Apr 24, 2025',
    amount: 13.32,
    status: 'Canceled',
  },
  {
    id: '12341',
    items: ['2× Cola', '1× Fries'],
    date: 'Apr 24, 2025',
    amount: 8.83,
    status: 'Completed',
  },
  {
    id: '12340',
    items: ['3× Water', '2× Fries'],
    date: 'Apr 23, 2025',
    amount: 15.99,
    status: 'Completed',
  },
  {
    id: '12339',
    items: ['1× Burger', '1× Cola'],
    date: 'Apr 23, 2025',
    amount: 12.50,
    status: 'Pending',
  },
  {
    id: '12338',
    items: ['2× Salad'],
    date: 'Apr 22, 2025',
    amount: 18.00,
    status: 'Completed',
  },
  {
    id: '12337',
    items: ['1× Pizza', '2× Water'],
    date: 'Apr 22, 2025',
    amount: 16.45,
    status: 'Canceled',
  },
  {
    id: '12336',
    items: ['1× Burger', '1× Fries', '1× Cola'],
    date: 'Apr 21, 2025',
    amount: 14.99,
    status: 'Completed',
  },
  {
    id: '12335',
    items: ['2× Pizza', '3× Cola'],
    date: 'Apr 21, 2025',
    amount: 28.75,
    status: 'Pending',
  },
  {
    id: '12334',
    items: ['1× Salad', '1× Water'],
    date: 'Apr 20, 2025',
    amount: 11.25,
    status: 'Completed',
  },
  {
    id: '12333',
    items: ['3× Burger', '3× Fries', '3× Cola'],
    date: 'Apr 20, 2025',
    amount: 42.99,
    status: 'Completed',
  },
  {
    id: '12332',
    items: ['1× Pizza', '1× Water'],
    date: 'Apr 19, 2025',
    amount: 13.99,
    status: 'Canceled',
  },
  {
    id: '12331',
    items: ['2× Burger', '2× Cola'],
    date: 'Apr 19, 2025',
    amount: 22.50,
    status: 'Completed',
  }
];

export default function OrderHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...mockOrders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) => item.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'desc' ? bValue - aValue : aValue - bValue;
      }

      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const aStr = aValue.join(', ');
        const bStr = bValue.join(', ');
        return sortConfig.direction === 'desc'
          ? bStr.localeCompare(aStr)
          : aStr.localeCompare(bStr);
      }

      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, sortConfig]);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      {/* Header and Filters */}
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex items-center justify-end lg:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Orders History</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow">
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
          <div className="w-full sm:w-48">
            <StatusFilter statusFilter={statusFilter} onStatusChange={setStatusFilter} />
          </div>
        </div>
      </div>

      {/* Table */}
      <OrderTable
        orders={paginatedOrders}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
} 