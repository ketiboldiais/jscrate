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

export function mergeSort(A: base[], order: comp = ">") {
  if (A.length < 2) return A;
  else if (A.length === 2)
    return (cmp(A[0], A[1], order) && ([A[0], A[1]] = [A[1], A[0]])) || A;
  const sort = (arr: generics) => {
    if (arr.length <= 1) return arr;
    let mid = floor(arr.length / 2);
    let left: generics = sort(arr.slice(0, mid));
    let right: generics = sort(arr.slice(mid));
    return sortedJoin(left, right, order);
  };
  return sort(A);
}
