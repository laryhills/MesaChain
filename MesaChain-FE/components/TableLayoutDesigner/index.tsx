'use client';

import { useState } from 'react';
import { ToolsPanel } from './ToolsPanel';
import { LayoutCanvas } from './LayoutCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { Toast } from './Toast';
import { useTableLayoutStore } from '@/store/useTableLayoutStore';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function TableLayoutDesigner() {
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { saveLayout, selectedTableId } = useTableLayoutStore();

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      await saveLayout();
      showToast('Layout saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save layout:', error);
      showToast('Failed to save layout. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tools Panel */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        <ToolsPanel />
      </div>

      {/* Main Canvas Area - Full width */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed height */}
        <div className="h-16 bg-gray-800 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            Table Layout Designer
          </h2>
          <button
            onClick={handleSaveLayout}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Layout
              </>
            )}
          </button>
        </div>

        {/* Canvas - Scrollable area */}
        <div className="flex-1 relative overflow-hidden">
          <LayoutCanvas />
        </div>
      </div>

      {/* Properties Panel - Hidden by default, shown as modal */}
      {selectedTableId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md">
            <PropertiesPanel />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
} 