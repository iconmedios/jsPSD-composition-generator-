
import type { PageSettings, PdfElement } from '../types';

const getElementCode = (el: PdfElement): string => {
  switch (el.type) {
    case 'text':
      return `doc.text(${JSON.stringify(el.content)}, ${el.x}, ${el.y}, { maxWidth: ${el.width}, align: '${el.align}' });`;
    case 'image':
      // Las imágenes de Picsum no funcionarán directamente en jsPDF por CORS. 
      // Se necesita una imagen convertida a Base64 para que funcione de forma fiable.
      // Aquí simulamos que el usuario ha proporcionado una URL base64.
      return `
// Nota: addImage requiere una imagen en formato Base64 para funcionar de forma fiable en el navegador.
// Este código asume que 'imageData' es una variable que contiene la imagen en formato de datos URI.
// const imageData = 'data:image/jpeg;base64,...';
// doc.addImage(imageData, 'JPEG', ${el.x}, ${el.y}, ${el.width}, ${el.height});
// Por ahora, usamos un placeholder que no se renderizará en el PDF final sin una imagen real.
doc.addImage('${el.src}', 'JPEG', ${el.x}, ${el.y}, ${el.width}, ${el.height});`;
    case 'shape':
      const style = el.backgroundColor === 'transparent' ? 'S' : 'FD'; // S = Stroke, F = Fill, D = Stroke
      return `doc.setFillColor('${el.backgroundColor}');\ndoc.setDrawColor('${el.borderColor}');\ndoc.rect(${el.x}, ${el.y}, ${el.width}, ${el.height}, '${style}');`;
    case 'table':
      let options = `{ startY: ${el.y}, startX: ${el.x} }`;
      if (el.columnStyles && el.columnStyles.trim() !== '{}' && el.columnStyles.trim() !== '') {
          try {
              // Validar que es un JSON
              JSON.parse(el.columnStyles);
              options = `{ startY: ${el.y}, startX: ${el.x}, columnStyles: ${el.columnStyles} }`;
          } catch(e) {
              console.warn("Estilos de columna no son un JSON válido.");
          }
      }
      return `doc.autoTable({
  head: ${JSON.stringify(el.headers)},
  body: ${JSON.stringify(el.body)},
  ...${options}
});`;
    default:
      return '';
  }
};

export const generateJsPdfCode = (
  pageSettings: PageSettings,
  elements: PdfElement[],
  isForDisplay: boolean
): string => {
  const { orientation, units, format } = pageSettings;
  let code = `const doc = new jspdf.jsPDF({
  orientation: '${orientation}',
  unit: '${units}',
  format: '${format}'
});\n\n`;

  elements.forEach(el => {
    code += `// Elemento: ${el.type} (${el.id})\n`;
    if (el.type === 'text') {
        code += `doc.setFontSize(${el.fontSize});\n`
    }
    code += getElementCode(el) + '\n\n';
  });

  if (isForDisplay) {
    code += `\n// Para previsualizar o descargar el PDF, añade la siguiente línea:
// doc.save('documento.pdf');`;
  } else {
    code += `doc.save('documento_generado.pdf');`;
  }

  return code;
};
