'use client';

import { useState, useEffect } from 'react';
import { useTableLayoutStore } from '@/store/useTableLayoutStore';
import { TableStatus } from '@/types/tableLayout';
import { CAPACITY_OPTIONS } from './tableConfig';

export function PropertiesPanel() {
  const { getSelectedTable, updateTable, deleteTable, selectTable } = useTableLayoutStore();
  const selectedTable = getSelectedTable();

  const [formData, setFormData] = useState({
    name: '',
    capacity: 2,
    status: 'available' as TableStatus,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when selected table changes
  useEffect(() => {
    if (selectedTable) {
      setFormData({
        name: selectedTable.name,
        capacity: selectedTable.capacity,
        status: selectedTable.status,
      });
      setHasChanges(false);
    }
  }, [selectedTable]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (selectedTable && hasChanges) {
      updateTable(selectedTable.id, formData);
      setHasChanges(false);
      selectTable(null); // Cerrar el modal
    }
  };

  const handleCancel = () => {
    if (selectedTable) {
      // Reset form data to original values
      setFormData({
        name: selectedTable.name,
        capacity: selectedTable.capacity,
        status: selectedTable.status,
      });
      setHasChanges(false);
    }
    selectTable(null);
  };

  const handleDelete = () => {
    if (selectedTable) {
      deleteTable(selectedTable.id);
    }
  };

  if (!selectedTable) {
    return null;
  }

  const availableCapacities = CAPACITY_OPTIONS[selectedTable.shape];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Table {selectedTable.name}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as TableStatus)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="occupied">Occupied</option>
            <option value="out-of-service">Out of Service</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seats
          </label>
          <select
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableCapacities.map((capacity) => (
              <option key={capacity} value={capacity}>
                {capacity} seats
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleDelete}
          className="flex-1 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex-1 p-2 rounded-md transition-colors ${
            hasChanges 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
} 