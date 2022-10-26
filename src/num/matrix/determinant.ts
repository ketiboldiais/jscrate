import { cofactor, colCount } from "@num";
import { rowCount } from "@num";
import { matrix } from "@type";

export function determinant(m: matrix, rows = rowCount(m), cols = colCount(m)) {
  if (rows === 2 && cols === 2) {
    const p1 = m[0][0] * m[1][1];
    const p2 = m[0][1] * m[1][0];
    return p1 - p2;
  }
  return cofactor(m, rows, cols);
}
