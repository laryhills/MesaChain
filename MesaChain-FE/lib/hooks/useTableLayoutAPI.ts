import { useState } from 'react';
import { TableLayout, Table } from '@/types/tableLayout';

// Mock API functions - replace with actual API calls
const mockAPI = {
  saveLayout: async (layout: TableLayout): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving layout to API:', layout);
    // TODO: Replace with actual API call
    // return fetch('/api/table-layouts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(layout)
    // });
  },

  loadLayout: async (layoutId: string): Promise<TableLayout> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Loading layout from API:', layoutId);
    
    // Mock response
    return {
      id: layoutId,
      name: 'Restaurant Layout',
      tables: [
        {
          id: 'table-1',
          name: 'T-1',
          capacity: 2,
          shape: 'square',
          status: 'available',
          position: { x: 0, y: 0, w: 2, h: 2 },
          bookings: [],
          orders: []
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  getTableBookings: async (tableId: string): Promise<any[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Loading bookings for table:', tableId);
    
    // Mock bookings data
    return [
      {
        id: 'booking-1',
        tableId,
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        partySize: 4,
        reservationTime: '2024-01-15T19:00:00Z',
        status: 'confirmed'
      }
    ];
  },

  getTableOrders: async (tableId: string): Promise<any[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Loading orders for table:', tableId);
    
    // Mock orders data
    return [
      {
        id: 'order-1',
        tableId,
        items: [
          { id: 'item-1', name: 'Burger', quantity: 2, price: 12.99 },
          { id: 'item-2', name: 'Fries', quantity: 1, price: 4.99 }
        ],
        total: 30.97,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
  },

  updateTableStatus: async (tableId: string, status: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Updating table status:', tableId, status);
    // TODO: Replace with actual API call
  }
};

export function useTableLayoutAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLayout = async (layout: TableLayout): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockAPI.saveLayout(layout);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save layout');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadLayout = async (layoutId: string): Promise<TableLayout | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const layout = await mockAPI.loadLayout(layoutId);
      return layout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load layout');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTableBookings = async (tableId: string): Promise<any[]> => {
    try {
      return await mockAPI.getTableBookings(tableId);
    } catch (err) {
      console.error('Failed to load table bookings:', err);
      return [];
    }
  };

  const getTableOrders = async (tableId: string): Promise<any[]> => {
    try {
      return await mockAPI.getTableOrders(tableId);
    } catch (err) {
      console.error('Failed to load table orders:', err);
      return [];
    }
  };

  const updateTableStatus = async (tableId: string, status: string): Promise<boolean> => {
    try {
      await mockAPI.updateTableStatus(tableId, status);
      return true;
    } catch (err) {
      console.error('Failed to update table status:', err);
      return false;
    }
  };

  return {
    isLoading,
    error,
    saveLayout,
    loadLayout,
    getTableBookings,
    getTableOrders,
    updateTableStatus
  };
} 