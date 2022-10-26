import { matrix } from "@type";

export function rowCount(m1: matrix) {
  const IR = m1.length; // initial row count
  let count = 0;
  for (let i = 0; i < IR; i++) {
    m1[i].length !== 0 ? (count += 1) : (count -= 1 / IR);
  }
  return count;
}
