import { create } from 'zustand';
import { Table, TableTemplate, LayoutState } from '@/types/tableLayout';
import { TABLE_CONFIGS } from '@/components/TableLayoutDesigner/tableConfig';

const STORAGE_KEY = 'mesachain-table-layout';

// Mock initial tables - ahora vacío para primera vez
const initialTables: Table[] = [];

// Función para obtener el tamaño por defecto según capacidad y forma
const getDefaultSize = (capacity: number, shape: 'square' | 'round') => {
  const config = TABLE_CONFIGS.find(
    c => c.capacity === capacity && c.shape === shape
  );
  return config?.defaultSize || { w: 2, h: 2 };
};

// Función para cargar datos del localStorage
const loadFromStorage = (): LayoutState => {
  // Verificar si estamos en el navegador
  if (typeof window === 'undefined') {
    return {
      tables: initialTables, // Array vacío
      selectedTableId: null,
      isDragging: false,
      isResizing: false,
      zoom: 1,
      gridSize: 20,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded from storage:', parsed);
      return {
        tables: parsed.tables || [],
        selectedTableId: null,
        isDragging: false,
        isResizing: false,
        zoom: parsed.zoom || 1,
        gridSize: parsed.gridSize || 20,
      };
    }
  } catch (error) {
    console.error('Error loading layout from storage:', error);
  }
  
  // Retornar estado inicial vacío si no hay datos guardados
  return {
    tables: initialTables, // Array vacío
    selectedTableId: null,
    isDragging: false,
    isResizing: false,
    zoom: 1,
    gridSize: 20,
  };
};

// Función para guardar datos en localStorage
const saveToStorage = (state: LayoutState) => {
  // Verificar si estamos en el navegador
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const dataToSave = {
      tables: state.tables,
      zoom: state.zoom,
      gridSize: state.gridSize,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('Saved to storage:', dataToSave);
  } catch (error) {
    console.error('Error saving layout to storage:', error);
  }
};

// Función para detectar colisiones entre dos mesas
const checkCollision = (table1: { position: { x: number; y: number; w: number; h: number } }, 
                       table2: { position: { x: number; y: number; w: number; h: number } }): boolean => {
  return !(
    table1.position.x + table1.position.w <= table2.position.x ||
    table1.position.x >= table2.position.x + table2.position.w ||
    table1.position.y + table1.position.h <= table2.position.y ||
    table1.position.y >= table2.position.y + table2.position.h
  );
};

// Función para verificar si una posición es válida (sin colisiones)
const isValidPosition = (newTable: { position: { x: number; y: number; w: number; h: number } } | { x: number; y: number; w: number; h: number }, 
                        existingTables: Table[], 
                        excludeTableId?: string): boolean => {
  const position = 'position' in newTable ? newTable.position : newTable;
  
  return !existingTables.some(table => {
    if (excludeTableId && table.id === excludeTableId) return false;
    return checkCollision({ position }, table);
  });
};

// Función para encontrar una posición válida cercana
const findValidPosition = (desiredPosition: { x: number; y: number; w: number; h: number }, 
                          existingTables: Table[], 
                          excludeTableId?: string): { x: number; y: number } => {
  const gridSize = 20; // Tamaño de la cuadrícula
  const maxAttempts = 100; // Aumentado para más opciones
  
  // Primero intentar la posición original
  if (isValidPosition(desiredPosition, existingTables, excludeTableId)) {
    return { x: desiredPosition.x, y: desiredPosition.y };
  }
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Intentar posiciones en espiral alrededor de la posición deseada
    const radius = Math.floor(attempt / 4) + 1;
    const direction = attempt % 4;
    
    let offsetX = 0, offsetY = 0;
    switch (direction) {
      case 0: offsetX = radius * gridSize; offsetY = 0; break; // Derecha
      case 1: offsetX = 0; offsetY = radius * gridSize; break; // Abajo
      case 2: offsetX = -radius * gridSize; offsetY = 0; break; // Izquierda
      case 3: offsetX = 0; offsetY = -radius * gridSize; break; // Arriba
    }
    
    const testPosition = {
      x: desiredPosition.x + offsetX,
      y: desiredPosition.y + offsetY,
      w: desiredPosition.w,
      h: desiredPosition.h
    };
    
    if (isValidPosition(testPosition, existingTables, excludeTableId)) {
      return { x: testPosition.x, y: testPosition.y };
    }
  }
  
  // Si no se encuentra posición válida, retornar la posición original
  return { x: desiredPosition.x, y: desiredPosition.y };
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
  initializeFromStorage: () => void;
  
  // Getters
  getSelectedTable: () => Table | null;
  
  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useTableLayoutStore = create<TableLayoutStore>((set, get) => ({
  // Initial state
  tables: initialTables,
  selectedTableId: null,
  isDragging: false,
  isResizing: false,
  zoom: 1,
  gridSize: 20,
  isLoading: true, // Comenzar con loading activo

  // Actions
  addTable: (template, position) => {
    const state = get();
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: `T-${state.tables.length + 1}`,
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

    // Verificar si la posición es válida (sin colisiones)
    if (!isValidPosition(newTable, state.tables)) {
      console.warn('Position overlaps with existing table, finding valid position...');
      // Encontrar una posición válida cercana
      const validPosition = findValidPosition(newTable.position, state.tables);
      newTable.position.x = validPosition.x;
      newTable.position.y = validPosition.y;
    }

    set((state) => {
      const newState = {
        ...state,
        tables: [...state.tables, newTable],
        selectedTableId: newTable.id
      };
      // Auto-save después de agregar mesa
      saveToStorage(newState);
      return newState;
    });
  },

  updateTable: (tableId, updates) => {
    set((state) => {
      const newState = {
        ...state,
        tables: state.tables.map((table) => {
          if (table.id === tableId) {
            const updatedTable = { ...table, ...updates };
            
            // Si cambió la capacidad, actualizar también el tamaño
            if (updates.capacity !== undefined && updates.capacity !== table.capacity) {
              const newSize = getDefaultSize(updates.capacity, updatedTable.shape);
              const newPosition = {
                ...updatedTable.position,
                w: newSize.w,
                h: newSize.h
              };
              
              // Verificar si el nuevo tamaño causa colisiones
              const tempTable = { ...updatedTable, position: newPosition };
              if (!isValidPosition(tempTable, state.tables, tableId)) {
                console.warn('Cannot resize table: new size would overlap with existing table');
                return table; // Mantener la mesa original si hay colisión
              } else {
                updatedTable.position = newPosition;
              }
            }

            // Si cambió la posición, verificar colisiones
            if (updates.position) {
              const tempTable = { ...updatedTable, position: updates.position };
              if (!isValidPosition(tempTable, state.tables, tableId)) {
                console.warn('Cannot move table: position overlaps with existing table');
                return table; // Mantener la posición original si hay colisión
              }
            }
            
            return updatedTable;
          }
          return table;
        })
      };
      // Auto-save después de actualizar mesa
      saveToStorage(newState);
      return newState;
    });
  },

  deleteTable: (tableId) => {
    set((state) => {
      const newState = {
        ...state,
        tables: state.tables.filter((table) => table.id !== tableId),
        selectedTableId: state.selectedTableId === tableId ? null : state.selectedTableId
      };
      // Auto-save después de eliminar mesa
      saveToStorage(newState);
      return newState;
    });
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
    set((state) => {
      const newState = { ...state, zoom };
      // Auto-save después de cambiar zoom
      saveToStorage(newState);
      return newState;
    });
  },

  setGridSize: (gridSize) => {
    set((state) => {
      const newState = { ...state, gridSize };
      // Auto-save después de cambiar grid size
      saveToStorage(newState);
      return newState;
    });
  },

  clearLayout: () => {
    set((state) => {
      const newState = { ...state, tables: [], selectedTableId: null };
      // Auto-save después de limpiar layout
      saveToStorage(newState);
      return newState;
    });
  },

  saveLayout: async () => {
    const state = get();
    saveToStorage(state);
    console.log('Layout saved successfully');
  },

  loadLayout: async () => {
    const loadedState = loadFromStorage();
    set(loadedState);
    console.log('Layout loaded successfully');
  },

  initializeFromStorage: () => {
    const { setLoading } = get();
    // No necesitamos setLoading(true) porque ya comienza en true
    
    // Simular un pequeño delay para que se vea el loader
    setTimeout(() => {
      const loadedState = loadFromStorage();
      set({ ...loadedState, isLoading: false });
      console.log('Initialized from storage');
    }, 500);
  },

  // Getters
  getSelectedTable: () => {
    const state = get();
    return state.tables.find(table => table.id === state.selectedTableId) || null;
  },
  
  // Loading state
  setLoading: (loading) => {
    set({ isLoading: loading });
  }
})); 