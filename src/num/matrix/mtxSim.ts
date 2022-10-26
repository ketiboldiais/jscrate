import { rowCount, colCount } from "@num";
import { matrix } from "@type";

export function mtxSim(m1: matrix, m2: matrix) {
  return rowCount(m1) === rowCount(m2) && colCount(m1) === colCount(m2);
}
