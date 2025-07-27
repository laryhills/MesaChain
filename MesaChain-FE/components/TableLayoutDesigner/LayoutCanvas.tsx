'use client';

import { useCallback, useRef, useState } from 'react';
import { useTableLayoutStore } from '@/store/useTableLayoutStore';
import { TableComponent } from './TableComponent';

export function LayoutCanvas() {
  const {
    tables,
    selectedTableId,
    selectTable,
    updateTable,
    setDragging,
    setResizing,
    zoom,
    gridSize
  } = useTableLayoutStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedTableId, setDraggedTableId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setIsDragging(true);
    setDraggedTableId(tableId);
    
    const table = tables.find(t => t.id === tableId);
    if (table && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - (table.position.x * gridSize);
      const offsetY = e.clientY - rect.top - (table.position.y * gridSize);
      setDragOffset({ x: offsetX, y: offsetY });
    }
  }, [tables, gridSize]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!draggedTableId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left - dragOffset.x) / gridSize;
    const rawY = (e.clientY - rect.top - dragOffset.y) / gridSize;
    
    const x = Math.max(0, Math.round(rawX));
    const y = Math.max(0, Math.round(rawY));
    
    updateTable(draggedTableId, {
      position: {
        ...tables.find(t => t.id === draggedTableId)!.position,
        x,
        y
      }
    });
  }, [draggedTableId, dragOffset, gridSize, updateTable, tables]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
    setIsDragging(false);
    setDraggedTableId(null);
    setDragOffset({ x: 0, y: 0 });
    
    setTimeout(() => {
      setDragging(false);
      setIsDragging(false);
    }, 100);
  }, []);

  const handleItemClick = useCallback((tableId: string) => {
    if (!isDragging && !draggedTableId) {
      selectTable(tableId);
    }
  }, [selectTable, isDragging, draggedTableId]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    try {
      const templateData = event.dataTransfer.getData('application/json');
      if (templateData && canvasRef.current) {
        const template = JSON.parse(templateData);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.round((event.clientX - rect.left) / gridSize));
        const y = Math.max(0, Math.round((event.clientY - rect.top) / gridSize));
        
        const { addTable } = useTableLayoutStore.getState();
        addTable(template, { x, y });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [gridSize]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedTableId) {
      handleDragMove(e);
    }
  }, [draggedTableId, handleDragMove]);

  const handleMouseUp = useCallback(() => {
    if (draggedTableId) {
      handleDragEnd();
    }
  }, [draggedTableId, handleDragEnd]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectTable(null);
    }
  }, [selectTable]);

  const maxX = Math.max(...tables.map(t => t.position.x + t.position.w), 20);
  const maxY = Math.max(...tables.map(t => t.position.y + t.position.h), 15);
  const contentWidth = maxX * gridSize + 100;
  const contentHeight = maxY * gridSize + 100;

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full bg-gray-100 relative overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: '0 0',
        }}
      />
      
      <div 
        className="relative"
        style={{
          width: `${contentWidth}px`,
          height: `${contentHeight}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        {tables.map((table) => (
          <div
            key={table.id}
            className="absolute cursor-move"
            style={{
              left: `${table.position.x * gridSize}px`,
              top: `${table.position.y * gridSize}px`,
              width: `${table.position.w * gridSize}px`,
              height: `${table.position.h * gridSize}px`,
            }}
          >
            <TableComponent
              table={table}
              isSelected={selectedTableId === table.id}
              onClick={() => handleItemClick(table.id)}
              isDragging={isDragging}
              onDragStart={(e) => handleDragStart(e, table.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 