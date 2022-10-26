import { base, comp } from "@type";
import { cmp } from "./cmp";

/**
 * @param A
 * An array of `string` or `number`.
 * @param order
 * One of `"<"` or `">"`
 */

export function insertion(A: base[], order: comp = ">") {
  const L = A.length;
  if (L < 2) return A;
  else if (L === 2)
    return (cmp(A[0], A[1], order) && ([A[0], A[1]] = [A[1], A[0]])) || A;
  let i;
  let j;
  for (i = 1; i < L; i++) {
    let C = A[i];
    for (j = i - 1; j >= 0 && cmp(A[j], C, order); j--) {
      A[j + 1] = A[j];
    }
    A[j + 1] = C;
  }
  return A;
}
