import { comp } from "@type";
import { cmp } from "./cmp";

/**
 * @param A
 * An array of `string` or `number`.
 * @param order
 * One of `"<"` or `">"`
 */
export function bubble(A: any[], order: comp = ">") {
  const L = A.length;
  if (L < 2) return A;
  else if (L === 2)
    return (cmp(A[0], A[1], order) && ([A[0], A[1]] = [A[1], A[0]])) || A;
  for (let i = L; i > 0; i--) {
    let noneSwapped = true;
    for (let j = 0; j < i - 1; j++) {
      cmp(A[j], A[j + 1], order) &&
        ([A[j], A[j + 1]] = [A[j + 1], A[j]]) &&
        (noneSwapped = false);
    }
    if (noneSwapped) break;
  }
  return A;
}
