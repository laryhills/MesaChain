export interface Order {
  id: string;
  items: string[];
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Canceled';
}

export type SortField = 'id' | 'items' | 'date' | 'amount' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
} 