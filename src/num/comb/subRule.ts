import { generics } from "@type";

export function subRule(A1: generics = [], A2: generics = []) {
  const n1 = new Set(A1.concat(A2));
  let out: generics = [];
  n1.forEach((d) => out.push(d));
  return out;
}
