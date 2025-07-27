import { create } from 'zustand';
import { Table, TableTemplate, LayoutState } from '@/types/tableLayout';
import { TABLE_CONFIGS } from '@/components/TableLayoutDesigner/tableConfig';

// Mock initial tables
const initialTables: Table[] = [
  {
    id: 'table-1',
    name: 'T-1',
    capacity: 2,
    shape: 'square',
    status: 'available',
    position: { x: 0, y: 0, w: 2, h: 2 },
    bookings: [],
    orders: []
  },
  {
    id: 'table-2',
    name: 'T-2',
    capacity: 6,
    shape: 'round',
    status: 'reserved',
    position: { x: 3, y: 0, w: 4, h: 4 },
    bookings: [
      {
        id: 'booking-1',
        tableId: 'table-2',
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        partySize: 4,
        reservationTime: '2024-01-15T19:00:00Z',
        status: 'confirmed'
      }
    ],
    orders: []
  }
];

// Función para obtener el tamaño por defecto según capacidad y forma
const getDefaultSize = (capacity: number, shape: 'square' | 'round') => {
  const config = TABLE_CONFIGS.find(
    c => c.capacity === capacity && c.shape === shape
  );
  return config?.defaultSize || { w: 2, h: 2 };
};

interface TableLayoutStore extends LayoutState {
  // Actions
  addTable: (template: TableTemplate, position: { x: number; y: number }) => void;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  deleteTable: (tableId: string) => void;
  selectTable: (tableId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  setResizing: (isResizing: boolean) => void;
  setZoom: (zoom: number) => void;
  setGridSize: (gridSize: number) => void;
  clearLayout: () => void;
  saveLayout: () => Promise<void>;
  loadLayout: () => Promise<void>;
  
  // Getters
  getSelectedTable: () => Table | null;
}

export const useTableLayoutStore = create<TableLayoutStore>((set, get) => ({
  // Initial state
  tables: initialTables,
  selectedTableId: null,
  isDragging: false,
  isResizing: false,
  zoom: 1,
  gridSize: 20,

  // Actions
  addTable: (template, position) => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: `T-${get().tables.length + 1}`,
      capacity: template.capacity,
      shape: template.shape,
      status: 'available',
      position: {
        x: position.x,
        y: position.y,
        w: template.defaultSize.w,
        h: template.defaultSize.h
      },
      bookings: [],
      orders: []
    };

    set((state) => ({
      tables: [...state.tables, newTable],
      selectedTableId: newTable.id
    }));
  },

  updateTable: (tableId, updates) => {
    set((state) => ({
      tables: state.tables.map((table) => {
        if (table.id === tableId) {
          const updatedTable = { ...table, ...updates };
          
          // Si cambió la capacidad, actualizar también el tamaño
          if (updates.capacity !== undefined && updates.capacity !== table.capacity) {
            const newSize = getDefaultSize(updates.capacity, updatedTable.shape);
            updatedTable.position = {
              ...updatedTable.position,
              w: newSize.w,
              h: newSize.h
            };
          }
          
          return updatedTable;
        }
        return table;
      })
    }));
  },

  deleteTable: (tableId) => {
    set((state) => ({
      tables: state.tables.filter((table) => table.id !== tableId),
      selectedTableId: state.selectedTableId === tableId ? null : state.selectedTableId
    }));
  },

  selectTable: (tableId) => {
    set({ selectedTableId: tableId });
  },

  setDragging: (isDragging) => {
    set({ isDragging });
  },

  setResizing: (isResizing) => {
    set({ isResizing });
  },

  setZoom: (zoom) => {
    set({ zoom });
  },

  setGridSize: (gridSize) => {
    set({ gridSize });
  },

  clearLayout: () => {
    set({ tables: [], selectedTableId: null });
  },

  saveLayout: async () => {
    const state = get();
    console.log('Saving layout:', state.tables);
  },

  loadLayout: async () => {
    console.log('Loading layout...');
  },

  // Getters
  getSelectedTable: () => {
    const state = get();
    return state.tables.find(table => table.id === state.selectedTableId) || null;
  }
})); 