import React from 'react';
import type { PdfElement, TextElement, ImageElement, ShapeElement, TableElement } from '../types';
import { TrashIcon } from '../constants';

interface PropertiesPanelProps {
  element: PdfElement | null;
  onUpdateElement: (id: string, updates: Partial<PdfElement>) => void;
  onDeleteElement: (id: string) => void;
}

const PropInput: React.FC<{ label: string; name: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; type?: string; step?: number; min?: number; }> =
  ({ label, ...props }) => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        {...props}
        className="w-full p-2 border border-slate-300 rounded-md text-sm"
      />
    </div>
  );
  
const PropTextArea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; }> =
  ({ label, ...props }) => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <textarea
        {...props}
        className="w-full p-2 border border-slate-300 rounded-md text-sm font-mono"
      />
    </div>
  );

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdateElement, onDeleteElement }) => {
  if (!element) {
    return (
      <aside className="w-72 bg-white p-4 border-l border-slate-200 overflow-y-auto">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Propiedades</h2>
        <div className="flex flex-col items-center justify-center text-center text-slate-400 pt-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>
            <p className="mt-4 text-sm">Selecciona un elemento para ver y editar sus propiedades.</p>
        </div>
      </aside>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['x', 'y', 'width', 'height', 'fontSize'].includes(name);
    onUpdateElement(element.id, { [name]: isNumeric ? parseFloat(value) : value });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          onUpdateElement(element.id, { src: event.target.result });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const renderTextProps = (el: TextElement) => (
    <>
      <PropTextArea label="Contenido" name="content" value={el.content} onChange={handleChange} rows={3} />
      <PropInput label="Tamaño de Fuente (pt)" name="fontSize" value={el.fontSize} onChange={handleChange} type="number" min={1} />
       <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Alineación</label>
          <select name="align" value={el.align} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-sm">
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>
    </>
  );

  const renderImageProps = (el: ImageElement) => (
    <>
      <PropInput label="URL de Imagen" name="src" value={el.src} onChange={handleChange} />
       <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Cargar Imagen Local</label>
          <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
       </div>
    </>
  );

  const renderShapeProps = (el: ShapeElement) => (
    <>
      <PropInput label="Color de Fondo" name="backgroundColor" value={el.backgroundColor} onChange={handleChange} type="color" />
      <PropInput label="Color de Borde" name="borderColor" value={el.borderColor} onChange={handleChange} type="color" />
    </>
  );
  
  const renderTableProps = (el: TableElement) => {
    const handleTableChange = (type: 'headers' | 'body', value: string) => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                onUpdateElement(el.id, { [type]: parsed });
            }
        } catch (e) { console.error("JSON inválido para datos de tabla"); }
    }
    return (
        <>
            <PropTextArea label="Cabeceras (JSON)" name="headers" value={JSON.stringify(el.headers, null, 2)} onChange={(e) => handleTableChange('headers', e.target.value)} rows={4} />
            <PropTextArea label="Cuerpo (JSON)" name="body" value={JSON.stringify(el.body, null, 2)} onChange={(e) => handleTableChange('body', e.target.value)} rows={6} />
            <PropTextArea label="Estilos Columnas (JSON)" name="columnStyles" value={el.columnStyles} onChange={handleChange} rows={4} />
        </>
    );
  };
  

  return (
    <aside className="w-72 bg-white p-4 border-l border-slate-200 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase">Propiedades</h2>
        <button onClick={() => onDeleteElement(element.id)} title="Eliminar Elemento" className="text-slate-500 hover:text-red-600">
            <TrashIcon className="w-5 h-5"/>
        </button>
      </div>
      <div className="space-y-4">
        <PropInput label="X" name="x" value={element.x.toFixed(2)} onChange={handleChange} type="number" step={0.1} />
        <PropInput label="Y" name="y" value={element.y.toFixed(2)} onChange={handleChange} type="number" step={0.1} />
        <PropInput label="Ancho" name="width" value={element.width.toFixed(2)} onChange={handleChange} type="number" step={0.1} min={1}/>
        <PropInput label="Alto" name="height" value={element.height.toFixed(2)} onChange={handleChange} type="number" step={0.1} min={1}/>

        <hr/>

        {element.type === 'text' && renderTextProps(element)}
        {element.type === 'image' && renderImageProps(element)}
        {element.type === 'shape' && renderShapeProps(element)}
        {element.type === 'table' && renderTableProps(element)}
      </div>
    </aside>
  );
};