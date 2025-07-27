import { render, screen, fireEvent } from '@testing-library/react';
import { TableComponent } from '../TableComponent';
import { Table } from '@/types/tableLayout';

const mockTable: Table = {
  id: 'test-table-1',
  name: 'T-1',
  capacity: 4,
  shape: 'square',
  status: 'available',
  position: { x: 0, y: 0, w: 2, h: 2 },
  bookings: [],
  orders: []
};

const mockTableWithBookings: Table = {
  ...mockTable,
  id: 'test-table-2',
  name: 'T-2',
  status: 'reserved',
  bookings: [
    {
      id: 'booking-1',
      tableId: 'test-table-2',
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      partySize: 4,
      reservationTime: '2024-01-15T19:00:00Z',
      status: 'confirmed'
    }
  ]
};

describe('TableComponent', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders table with correct information', () => {
    render(
      <TableComponent
        table={mockTable}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('T-1')).toBeInTheDocument();
    expect(screen.getByText('4 Seats')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('applies selected styling when isSelected is true', () => {
    render(
      <TableComponent
        table={mockTable}
        isSelected={true}
        onClick={mockOnClick}
      />
    );

    const tableElement = screen.getByText('T-1').closest('div');
    expect(tableElement).toHaveClass('ring-2', 'ring-blue-500');
  });

  it('calls onClick when clicked', () => {
    render(
      <TableComponent
        table={mockTable}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByText('T-1'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays booking count when table has bookings', () => {
    render(
      <TableComponent
        table={mockTableWithBookings}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('1 Booking')).toBeInTheDocument();
  });

  it('displays correct status color for different statuses', () => {
    const { rerender } = render(
      <TableComponent
        table={mockTable}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    // Available status should have green background
    const tableElement = screen.getByText('T-1').closest('div');
    expect(tableElement).toHaveClass('bg-green-500');

    // Test reserved status
    const reservedTable = { ...mockTable, status: 'reserved' as const };
    rerender(
      <TableComponent
        table={reservedTable}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const reservedTableElement = screen.getByText('T-1').closest('div');
    expect(reservedTableElement).toHaveClass('bg-yellow-500');
  });

  it('renders round table with correct shape class', () => {
    const roundTable = { ...mockTable, shape: 'round' as const };
    render(
      <TableComponent
        table={roundTable}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const tableElement = screen.getByText('T-1').closest('div');
    expect(tableElement).toHaveClass('rounded-full');
  });
}); 