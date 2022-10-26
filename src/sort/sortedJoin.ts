import { comp, generics } from "@type";
import { cmp } from "./cmp";

export function sortedJoin(
  A1: generics = [],
  A2: generics = [],
  order: comp
): generics {
  let out = [];
  let i = 0;
  let j = 0;
  while (i < A1.length && j < A2.length)
    (cmp(A2[j], A1[i], order) && out.push(A1[i]) && (i++ || 1)) ||
      (out.push(A2[j]) && j++);
  while (i < A1.length) 1 && out.push(A1[i]) && i++;
  while (j < A2.length) 1 && out.push(A2[j]) && j++;
  return out;
}
