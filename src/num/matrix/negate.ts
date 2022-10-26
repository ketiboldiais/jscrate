import { rowCount, colCount } from "@num";
import { matrix } from "@type";

export function negate(m: matrix, rows = rowCount(m), cols = colCount(m)) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      m[i][j] = -m[i][j];
    }
  }
  return m;
}
