import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { PdfElement, PageSettings } from '../types';
import { PAGE_DIMENSIONS, DPI } from '../constants';

interface CanvasProps {
  elements: PdfElement[];
  pageSettings: PageSettings;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<PdfElement>) => void;
  zoom: number;
}

const unitToPx = (value: number, unit: 'mm' | 'pt' | 'in'): number => {
  if (unit === 'mm') return (value / 25.4) * DPI;
  if (unit === 'pt') return (value / 72) * DPI;
  return value * DPI;
};

const pxToUnit = (value: number, unit: 'mm' | 'pt' | 'in'): number => {
  if (unit === 'mm') return (value / DPI) * 25.4;
  if (unit === 'pt') return (value / DPI) * 72;
  return value / DPI;
};

export const Canvas: React.FC<CanvasProps> = ({ elements, pageSettings, selectedElementId, onSelectElement, onUpdateElement, zoom }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizedElement, setResizedElement] = useState<{ id: string; handle: string, startX: number, startY: number, startW: number, startH: number } | null>(null);

  const { format, orientation, units } = pageSettings;
  
  const [pageWidthInUnits, pageHeightInUnits] = useMemo(() => {
    const width = PAGE_DIMENSIONS[format].width[units];
    const height = PAGE_DIMENSIONS[format].height[units];
    return orientation === 'p' ? [width, height] : [height, width];
  }, [format, orientation, units]);

  const pageWidthPx = unitToPx(pageWidthInUnits, units);
  const pageHeightPx = unitToPx(pageHeightInUnits, units);


  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    onSelectElement(id);
    const element = elements.find(el => el.id === id);
    if (!element || !canvasRef.current) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    setDraggedElement({
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  }, [onSelectElement, elements]);

  const handleResizeHandleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string, handle: string) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === id);
    if (!element) return;
    setResizedElement({
      id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startW: unitToPx(element.width, units),
      startH: unitToPx(element.height, units),
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    if (draggedElement) {
        const mouseXInScaledCanvas = e.clientX - canvasRect.left;
        const mouseYInScaledCanvas = e.clientY - canvasRect.top;

        const mouseXInUnscaledCanvas = mouseXInScaledCanvas / zoom;
        const mouseYInUnscaledCanvas = mouseYInScaledCanvas / zoom;

        const offsetXInUnscaledCanvas = draggedElement.offsetX / zoom;
        const offsetYInUnscaledCanvas = draggedElement.offsetY / zoom;

        const newX = mouseXInUnscaledCanvas - offsetXInUnscaledCanvas;
        const newY = mouseYInUnscaledCanvas - offsetYInUnscaledCanvas;

        onUpdateElement(draggedElement.id, {
            x: pxToUnit(newX, units),
            y: pxToUnit(newY, units),
        });
    } else if (resizedElement) {
      const dx = (e.clientX - resizedElement.startX) / zoom;
      const dy = (e.clientY - resizedElement.startY) / zoom;
      
      let newWidth = resizedElement.startW;
      let newHeight = resizedElement.startH;

      if (resizedElement.handle.includes('r')) newWidth += dx;
      if (resizedElement.handle.includes('l')) newWidth -= dx;
      if (resizedElement.handle.includes('b')) newHeight += dy;
      if (resizedElement.handle.includes('t')) newHeight -= dy;

      onUpdateElement(resizedElement.id, {
        width: pxToUnit(Math.max(10, newWidth), units),
        height: pxToUnit(Math.max(10, newHeight), units),
      });
    }
  }, [draggedElement, resizedElement, onUpdateElement, units, zoom]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
    setResizedElement(null);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const renderElement = (el: PdfElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${unitToPx(el.x, units)}px`,
      top: `${unitToPx(el.y, units)}px`,
      width: `${unitToPx(el.width, units)}px`,
      height: `${unitToPx(el.height, units)}px`,
      cursor: 'move',
      boxSizing: 'border-box',
    };

    let content;
    switch (el.type) {
      case 'text':
        content = (
          <div
            style={{
              fontSize: `${el.fontSize * (DPI / 72)}px`,
              lineHeight: 1.2,
              textAlign: el.align,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              color: 'black',
              wordBreak: 'break-word',
              userSelect: 'none',
              padding: '2px',
              boxSizing: 'border-box',
            }}
          >
            {el.content}
          </div>
        );
        break;
      case 'image':
        content = <img src={el.src} alt="user content" className="w-full h-full object-cover" />;
        break;
      case 'shape':
        style.backgroundColor = el.backgroundColor;
        style.border = `1px solid ${el.borderColor}`;
        content = null;
        break;
      case 'table':
        content = <div className="w-full h-full border border-slate-400 text-slate-400 flex items-center justify-center text-xs">TABLA</div>;
        break;
      default:
        content = null;
    }

    const isSelected = selectedElementId === el.id;

    return (
      <div 
        key={el.id} 
        style={style} 
        onMouseDown={(e) => handleMouseDown(e, el.id)} 
        onClick={(e) => e.stopPropagation()}
        className={`select-none ${isSelected ? 'border-2 border-blue-500' : ''}`}
      >
        {content}
        {isSelected && (
          <>
            <div className="resize-handle" style={{ top: -5, left: -5, cursor: 'nwse-resize' }} onMouseDown={(e) => handleResizeHandleMouseDown(e, el.id, 'tl')}></div>
            <div className="resize-handle" style={{ top: -5, right: -5, cursor: 'nesw-resize' }} onMouseDown={(e) => handleResizeHandleMouseDown(e, el.id, 'tr')}></div>
            <div className="resize-handle" style={{ bottom: -5, left: -5, cursor: 'nesw-resize' }} onMouseDown={(e) => handleResizeHandleMouseDown(e, el.id, 'bl')}></div>
            <div className="resize-handle" style={{ bottom: -5, right: -5, cursor: 'nwse-resize' }} onMouseDown={(e) => handleResizeHandleMouseDown(e, el.id, 'br')}></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="canvas-bg shadow-lg relative"
      style={{
        width: `${pageWidthPx}px`,
        height: `${pageHeightPx}px`,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left'
      }}
      onClick={() => onSelectElement(null)}
    >
      {elements.map(renderElement)}
    </div>
  );
};