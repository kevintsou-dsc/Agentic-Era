import rawMap from '../../content/figure-map.json';

export interface OrigImage {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export interface OrigFigure {
  page: number;
  images?: OrigImage[];
  layout?: 'stack';
  vector?: boolean;
}

type FigureMap = Record<string, Record<string, OrigFigure>>;
const MAP = rawMap as FigureMap;

export function getFigure(articleId: string, blockIndex: number): OrigFigure | undefined {
  return MAP[articleId]?.[String(blockIndex)];
}

export function printPageSrc(articleId: string, page: number): string {
  return `/pages/${articleId}/p${String(page).padStart(3, '0')}.webp`;
}
