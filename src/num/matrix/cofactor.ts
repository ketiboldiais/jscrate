import { rowCount, colCount, mtxMinor, determinant } from "@num";
import { matrix } from "@type";

export function cofactor(m: matrix, rows = rowCount(m), cols = colCount(m)) {
  let det = 0;
  for (let r = 0; r < rows; r++) {
    const a = (-1) ** r;
    const b = m[0][r];
    const c = a * b;
    const mMinor = mtxMinor(m, 1, r + 1, rows, cols);
    const minorDeterminant: number = determinant(mMinor);
    det += c * minorDeterminant;
  }
  return det;
}
