import chroma from 'chroma-js';

export const getColors = (n: number) => {
  return chroma.scale(['#cf4d48','#486acf']).mode('hsv').colors(n);
}
