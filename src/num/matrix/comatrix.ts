import { colCount } from "@num";
import { mtxMinor } from "@num";
import { determinant } from "@num";
import { cofactor } from "@num";
import { rowCount } from "@num";
import { matrix } from "@type";

export function comatrix(m: matrix, rows = rowCount(m), cols = colCount(m)) {
  let cofactors = [];
  if (rows === 2 && cols === 2) {
    cofactors.push([cofactor]);
    return cofactors;
  }
  for (let r = 0; r < rows; r++) {
    let cofactorRow = [];
    for (let c = 0; c < rows; c++) {
      let minor = mtxMinor(m, r + 1, c + 1, rows, cols);
      const n = (-1) ** (r + c);
      const d = n * determinant(minor);
      cofactorRow.push(d);
    }
    cofactors.push(cofactorRow);
  }
  return cofactors;
}
