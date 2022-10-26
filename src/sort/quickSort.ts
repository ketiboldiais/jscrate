import { floor } from "@num";
import { base, comp, generics } from "@type";
import { cmp } from "./cmp";
import { sortedJoin } from "./sortedJoin";

/**
 * @param A
 * An array of `string` or `number`.
 * @param order
 * One of `"<"` or `">"`
 */

export function quickSort(A: base[], order: comp = ">") {
  if (A.length < 2) return A;
  else if (A.length === 2)
    return (cmp(A[0], A[1], order) && ([A[0], A[1]] = [A[1], A[0]])) || A;
}
