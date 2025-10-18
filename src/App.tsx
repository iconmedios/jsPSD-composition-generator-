
import React, { useState, useCallback, useMemo } from 'react';
// FIX: Corrected import paths to point to the root directory.
import { Toolbar } from '../components/Toolbar';
import { Canvas } from '../components/Canvas';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CodeModal } from '../components/CodeModal';
import type { PageSettings, PdfElement, ElementType } from '../types';
import { generateJsPdfCode } from '../services/codeGenerator';
import { PAGE_DIMENSIONS } from '../constants';

// Declaraciones para librerías globales
declare const jspdf: any;
const { jsPDF } = jspdf;

const App: React.FC = () => {
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    format: 'a4',
    orientation: 'p',
    units: 'mm',
  });
  const [elements, setElements] = useState<PdfElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isCodeModalOpen, setCodeModalOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState<string>('Mi Documento PDF');
  const [zoom, setZoom] = useState<number>(1);

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedElementId) || null,
    [elements, selectedElementId]
  );

  const updateElement = useCallback((id: string, updates: Partial<PdfElement>) => {
    // FIX: Add type assertion to resolve incorrect type inference when spreading.
    // TypeScript cannot guarantee that `{ ...el, ...updates }` is a valid `PdfElement`
    // because `updates` is a partial of the entire union, potentially mixing properties.
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...updates } as PdfElement : el))
    );
  }, []);

  // FIX: Refactored element creation to use a switch statement for better type safety.
  // This resolves a TypeScript error with conditional spreading in a single object literal.
  const addElement = (type: ElementType) => {
    let newElement: PdfElement;
    
    const baseProps = {
      id: `${type}-${Date.now()}`,
      x: 10,
      y: 10,
      width: type === 'text' ? 50 : 40,
      height: type === 'text' ? 10 : 40,
    };

    switch (type) {
      case 'text':
        newElement = {
          ...baseProps,
          type: 'text',
          content: 'Texto de ejemplo',
          fontSize: 16,
          align: 'left',
        };
        break;
      case 'image':
        newElement = {
          ...baseProps,
          type: 'image',
          src: 'https://picsum.photos/200/200',
        };
        break;
      case 'shape':
        newElement = {
          ...baseProps,
          type: 'shape',
          shape: 'rectangle',
          backgroundColor: '#ffffff',
          borderColor: '#000000',
        };
        break;
      case 'table':
        newElement = {
          ...baseProps,
          type: 'table',
          headers: [['Columna 1', 'Columna 2', 'Columna 3']],
          body: [
            ['Celda 1', 'Celda 2', 'Celda 3'],
            ['Celda 4', 'Celda 5', 'Celda 6'],
          ],
          columnStyles: `{}`,
        };
        break;
      default:
        // This will cause a compile-time error if a case is missed.
        const _exhaustiveCheck: never = type;
        throw new Error(`Unhandled element type: ${_exhaustiveCheck}`);
    }
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElementId(null);
  }, []);

  const handleGenerateCode = () => {
    setCodeModalOpen(true);
  };

  const handleDownloadPdf = () => {
    const code = generateJsPdfCode(pageSettings, elements, false);
    // Usamos new Function para evitar el uso directo de eval, es un poco más seguro.
    try {
      const generate = new Function('jsPDF', code);
      generate(jsPDF);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Revisa la consola para más detalles.");
    }
  };
  
  const generatedCode = useMemo(() => {
    if (isCodeModalOpen) {
      return generateJsPdfCode(pageSettings, elements, true);
    }
    return '';
  }, [isCodeModalOpen, pageSettings, elements]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="flex h-screen font-sans text-sm">
      <Toolbar 
        onAddElement={addElement} 
        pageSettings={pageSettings}
        setPageSettings={setPageSettings}
        onGenerateCode={handleGenerateCode}
        onDownloadPdf={handleDownloadPdf}
      />
      <main className="flex-1 flex flex-col items-center justify-start p-8 overflow-auto bg-slate-200 relative">
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="text-2xl font-bold text-slate-700 bg-transparent border-b-2 border-transparent focus:border-slate-400 focus:outline-none text-center w-full max-w-lg mb-6 transition-colors"
          aria-label="Título del Documento"
          placeholder="Escribe un título para tu documento"
        />
        {/* FIX: Added missing 'zoom' property to the Canvas component. */}
        <Canvas
          elements={elements}
          pageSettings={pageSettings}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={updateElement}
          zoom={zoom}
        />
        <div className="absolute bottom-4 right-4 z-10 bg-white shadow-lg rounded-lg flex items-center border border-slate-300">
            <button
                onClick={handleZoomOut}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-l-md transition-colors"
                title="Alejar"
                aria-label="Alejar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button 
                onClick={handleZoomReset} 
                className="px-3 py-2 text-sm text-slate-700 font-medium hover:bg-slate-100 border-x border-slate-300 transition-colors"
                title="Restablecer zoom"
            >
                {Math.round(zoom * 100)}%
            </button>
            <button
                onClick={handleZoomIn}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-r-md transition-colors"
                title="Acercar"
                aria-label="Acercar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
      </main>
      <PropertiesPanel
        element={selectedElement}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />
      {isCodeModalOpen && (
        <CodeModal
          code={generatedCode}
          onClose={() => setCodeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
