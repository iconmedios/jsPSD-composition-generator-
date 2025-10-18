
export type Unit = 'mm' | 'pt' | 'in';
export type PageFormat = 'a4' | 'letter' | 'legal';
export type PageOrientation = 'p' | 'l'; // portrait or landscape

export interface PageSettings {
  format: PageFormat;
  orientation: PageOrientation;
  units: Unit;
}

export interface ElementBase {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextElement extends ElementBase {
  type: 'text';
  content: string;
  fontSize: number;
  align: 'left' | 'center' | 'right';
}

export interface ImageElement extends ElementBase {
  type: 'image';
  src: string;
}

export interface ShapeElement extends ElementBase {
  type: 'shape';
  shape: 'rectangle' | 'ellipse';
  backgroundColor: string;
  borderColor: string;
}

export interface TableElement extends ElementBase {
  type: 'table';
  headers: string[][];
  body: string[][];
  columnStyles: string; // JSON string for column styles
}

export type PdfElement = TextElement | ImageElement | ShapeElement | TableElement;
export type ElementType = 'text' | 'image' | 'shape' | 'table';
