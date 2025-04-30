'use client';

import { Order, SortConfig, SortField } from './types';

interface OrderTableProps {
  orders: Order[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

export function OrderTable({ orders, sortConfig, onSort }: OrderTableProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-600';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'Canceled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="overflow-x-auto rounded-[8px] border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-[#F4A340]">
            {[
              { field: 'id', label: 'Order ID', className: 'w-24' },
              { field: 'items', label: 'Items', className: 'min-w-[200px]' },
              { field: 'date', label: 'Date', className: 'w-32' },
              { field: 'amount', label: 'Amount', className: 'w-28' },
              { field: 'status', label: 'Status', className: 'w-28' },
              { field: 'action', label: 'Action', className: 'w-24' },
            ].map(({ field, label, className }) => (
              <th
                key={field}
                scope="col"
                className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${
                  field !== 'action' ? 'cursor-pointer hover:bg-[#E89938] transition-colors' : ''
                } ${className}`}
                onClick={() => field !== 'action' && onSort(field as SortField)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  {sortConfig.field === field &&
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                  }
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <span className="text-[#F4A340] font-medium text-sm">#{order.id}</span>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4">
                <span className="text-gray-900 text-sm">{order.items.join(', ')}</span>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                {order.date}
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                ${order.amount.toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 sm:px-2.5 py-1 rounded-[4px] text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <button className="inline-flex items-center px-2 sm:px-3 py-1 rounded text-xs sm:text-sm text-white bg-[#F4A340] hover:bg-[#E89938] transition-colors">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 