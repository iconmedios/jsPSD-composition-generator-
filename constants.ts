import type { PageFormat, Unit } from './types';
import React from 'react';

type Dimensions = {
    width: Record<Unit, number>;
    height: Record<Unit, number>;
};

export const PAGE_DIMENSIONS: Record<PageFormat, Dimensions> = {
  a4: {
    width: { mm: 210, pt: 595.28, in: 8.27 },
    height: { mm: 297, pt: 841.89, in: 11.69 },
  },
  letter: {
    width: { mm: 215.9, pt: 612, in: 8.5 },
    height: { mm: 279.4, pt: 792, in: 11 },
  },
  legal: {
    width: { mm: 215.9, pt: 612, in: 8.5 },
    height: { mm: 355.6, pt: 1008, in: 14 },
  },
};

// DPI for screen representation
export const DPI = 96;

// SVG Icons for UI
export const TextIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
    React.createElement('path', {d:"M17 6.1H3"}),
    React.createElement('path', {d:"M21 12.1H3"}),
    React.createElement('path', {d:"M15.1 18.1H3"}),
    React.createElement('path', {d:"M10 6v12"}),
  )
);

export const ImageIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
    React.createElement('rect', {width:"18", height:"18", x:"3", y:"3", rx:"2", ry:"2"}),
    React.createElement('circle', {cx:"9", cy:"9", r:"2"}),
    React.createElement('path', {d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}),
  )
);

export const SquareIcon: React.FC<{className?: string}> = ({className}) => (
 React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
    React.createElement('rect', {width:"18", height:"18", x:"3", y:"3", rx:"2"}),
 )
);

export const TableIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
    React.createElement('path', {d:"M12 3v18"}),
    React.createElement('rect', {width:"18", height:"18", x:"3", y:"3", rx:"2"}),
    React.createElement('path', {d:"M3 9h18"}),
    React.createElement('path', {d:"M3 15h18"}),
  )
);

export const CodeIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
    React.createElement('polyline', {points:"16 18 22 12 16 6"}),
    React.createElement('polyline', {points:"8 6 2 12 8 18"}),
  )
);

export const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
    React.createElement('path', {d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),
    React.createElement('polyline', {points:"7 10 12 15 17 10"}),
    React.createElement('line', {x1:"12", x2:"12", y1:"15", y2:"3"}),
  )
);

export const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", width:"24", height:"24", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", className},
      React.createElement('path', {d:"M3 6h18"}),
      React.createElement('path', {d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}),
      React.createElement('line', {x1:"10", x2:"10", y1:"11", y2:"17"}),
      React.createElement('line', {x1:"14", x2:"14", y1:"11", y2:"17"}),
    )
);