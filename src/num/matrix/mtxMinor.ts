import { rowCount } from "@num";
import { colCount } from "@num";
import { matrix } from "@type";

export function mtxMinor(
  m: matrix,
  row: number,
  col: number,
  totalRows = rowCount(m),
  totalCols = colCount(m)
) {
  let out = [];
  for (let i = 0; i < totalRows; i++) {
    if (i === row - 1) continue;
    let minorRow = [];
    for (let j = 0; j < totalCols; j++) {
      if (j === col - 1) continue;
      minorRow.push(m[i][j]);
    }
    out.push(minorRow);
  }
  return out;
}
