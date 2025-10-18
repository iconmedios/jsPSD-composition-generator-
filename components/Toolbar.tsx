
import React from 'react';
import type { ElementType, PageSettings } from '../types';
import { TextIcon, ImageIcon, SquareIcon, TableIcon, CodeIcon, DownloadIcon } from '../constants';

interface ToolbarProps {
  onAddElement: (type: ElementType) => void;
  pageSettings: PageSettings;
  setPageSettings: React.Dispatch<React.SetStateAction<PageSettings>>;
  onGenerateCode: () => void;
  onDownloadPdf: () => void;
}

const ToolButton: React.FC<{ onClick: () => void; children: React.ReactNode, title: string }> = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="flex items-center justify-start w-full px-3 py-2 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
  >
    {children}
  </button>
);

export const Toolbar: React.FC<ToolbarProps> = ({ onAddElement, pageSettings, setPageSettings, onGenerateCode, onDownloadPdf }) => {
  const handleSettingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPageSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <aside className="w-64 bg-white p-4 border-r border-slate-200 flex flex-col">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Compositor PDF</h1>
      
      <div className="space-y-2 mb-6">
        <h2 className="text-sm font-semibold text-slate-500 px-3">Añadir Elemento</h2>
        <ToolButton onClick={() => onAddElement('text')} title="Añadir Texto">
          <TextIcon className="w-5 h-5 mr-3" /> Texto
        </ToolButton>
        <ToolButton onClick={() => onAddElement('image')} title="Añadir Imagen">
          <ImageIcon className="w-5 h-5 mr-3" /> Imagen
        </ToolButton>
        <ToolButton onClick={() => onAddElement('shape')} title="Añadir Forma">
          <SquareIcon className="w-5 h-5 mr-3" /> Forma
        </ToolButton>
        <ToolButton onClick={() => onAddElement('table')} title="Añadir Tabla">
          <TableIcon className="w-5 h-5 mr-3" /> Tabla
        </ToolButton>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-500 px-3">Ajustes de Página</h2>
        <div className="px-3">
          <label htmlFor="format" className="block text-xs font-medium text-slate-600 mb-1">Formato</label>
          <select id="format" name="format" value={pageSettings.format} onChange={handleSettingChange} className="w-full p-2 border border-slate-300 rounded-md text-sm">
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>
        <div className="px-3">
          <label htmlFor="orientation" className="block text-xs font-medium text-slate-600 mb-1">Orientación</label>
          <select id="orientation" name="orientation" value={pageSettings.orientation} onChange={handleSettingChange} className="w-full p-2 border border-slate-300 rounded-md text-sm">
            <option value="p">Vertical (Portrait)</option>
            <option value="l">Horizontal (Landscape)</option>
          </select>
        </div>
        <div className="px-3">
          <label htmlFor="units" className="block text-xs font-medium text-slate-600 mb-1">Unidades</label>
          <select id="units" name="units" value={pageSettings.units} onChange={handleSettingChange} className="w-full p-2 border border-slate-300 rounded-md text-sm">
            <option value="mm">Milímetros (mm)</option>
            <option value="pt">Puntos (pt)</option>
            <option value="in">Pulgadas (in)</option>
          </select>
        </div>
      </div>
      
      <div className="mt-auto space-y-2">
        <button onClick={onGenerateCode} className="w-full flex items-center justify-center bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
          <CodeIcon className="w-5 h-5 mr-2" /> Generar Código
        </button>
        <button onClick={onDownloadPdf} className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          <DownloadIcon className="w-5 h-5 mr-2" /> Descargar PDF
        </button>
      </div>
    </aside>
  );
};
