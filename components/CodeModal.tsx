
import React, { useRef } from 'react';

interface CodeModalProps {
  code: string;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ code, onClose }) => {
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.textContent || '');
      // Puedes añadir una pequeña notificación de "copiado" aquí si quieres
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Código jsPDF Generado</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        <div className="p-4 bg-slate-900 text-white overflow-auto flex-1">
          <pre ref={codeRef} className="text-sm whitespace-pre-wrap"><code className="language-javascript">{code}</code></pre>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={handleCopy} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Copiar al portapapeles
          </button>
        </div>
      </div>
    </div>
  );
};
