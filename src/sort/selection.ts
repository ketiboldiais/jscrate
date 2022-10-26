import { comp } from "@type";
import { cmp } from "./cmp";

/**
 * @param A
 * An array of `string` or `number`.
 * @param order
 * One of `"<"` or `">"`
 */
export function selection(A: any[], order: comp = ">") {
  const L = A.length;
  if (L < 2) return A;
  else if (L === 2)
    return (cmp(A[0], A[1], order) && ([A[0], A[1]] = [A[1], A[0]])) || A;
  let j: number;
  let i: number;
  for (i = 1; i < L; i++) {
    let min = A[i];
    for (j = i; j > 0 && cmp(A[j - 1], min, order); j--) {
      A[j] = A[j - 1];
    }
    A[j] = min;
  }
  return A;
}
