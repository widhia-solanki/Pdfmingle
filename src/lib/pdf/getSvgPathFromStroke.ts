// src/lib/pdf/getSvgPathFromStroke.ts

// This is a helper function that turns the points from perfect-freehand into an SVG path string.

const average = (a: number, b: number) => (a + b) / 2;

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) {
    return '';
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push('Q', x0, y0, average(x0, x1), average(y0, y1));
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}
