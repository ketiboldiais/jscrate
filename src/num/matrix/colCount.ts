import { rowCount } from "@num";
import { matrix } from "@type";

export function colCount(m1: matrix) {
  const IC = m1[0].length; // initial column count
  const IR = rowCount(m1);
  let count = IC;
  for (let i = 0; i < IR; i++) {
    const mRowLen = m1[i].length;
    count -= IC - mRowLen;
  }
  return count;
}
