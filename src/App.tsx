import React, { useState, useCallback, useMemo } from 'react';
// FIX: Corrected import paths to point to the root directory.
import { Toolbar } from '../components/Toolbar';
import { Canvas } from '../components/Canvas';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CodeModal } from '../components/CodeModal';
import type { PageSettings, PdfElement, ElementType, TextElement, ImageElement, ShapeElement, TableElement } from '../types';
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

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedElementId) || null,
    [elements, selectedElementId]
  );

  const updateElement = useCallback((id: string, updates: Partial<PdfElement>) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
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

  return (
    <div className="flex h-screen font-sans text-sm">
      <Toolbar 
        onAddElement={addElement} 
        pageSettings={pageSettings}
        setPageSettings={setPageSettings}
        onGenerateCode={handleGenerateCode}
        onDownloadPdf={handleDownloadPdf}
      />
      <main className="flex-1 flex items-center justify-center p-4 overflow-auto bg-slate-200">
        <Canvas
          elements={elements}
          pageSettings={pageSettings}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={updateElement}
        />
      </main>
      {selectedElement && (
        <PropertiesPanel
          element={selectedElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
        />
      )}
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
