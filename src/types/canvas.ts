export interface SubStyleOptions {
  type: 'arc' | 'square' | 'circle';
  lightGradientColor: string;
  darkGradientColor: string;
}

export interface SubFontInfo {
  type: string;
  largestSize?: number;
  largeSize?: number;
  mediumSize?: number;
  smallSize?: number;
  color: string;
  text: string;
  subtitle: string;
  marking: string;
}

export interface RectRadius {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}