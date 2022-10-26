import { matrix } from "@type";

export function mtxAdd(m1: matrix, m2: matrix) {
  const m1L = m1.length;
  const m2L = m2.length;
  for (let i = 0; i < m1L; i++) {
    for (let j = 0; j < m2L; j++) {
      m1[i][j] += m2[i][j];
    }
  }
  return m1;
}
