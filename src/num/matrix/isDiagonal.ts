import { matrix } from "@type";

export function isDiagonal(m: matrix) {
  const mRows = m.length;
  if (m.length === 0) return false;
  for (let i = 0; i < mRows; i++) {
    const mCols = m[i].length;
    for (let j = 0; j < mCols; j++) {
      if (i !== j && m[i][j] !== 0) return false;
    }
  }
  return true;
}
