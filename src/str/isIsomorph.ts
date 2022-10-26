import { struct } from "@type";

export function isIsomorph(s: string, t: string) {
  const L = s.length;
  if (L !== t.length) return false;
  const map1: struct = {};
  const map2: struct = {};
  for (let i = 0; i < L; i++) {
    const cs = s.charCodeAt(i);
    const ct = t.charCodeAt(i);
    if (!(cs in map1) && !(ct in map2)) {
      map1[cs] = ct;
      map2[ct] = cs;
    } else if (map1[cs] !== ct || map2[ct] !== cs) {
      return false;
    }
  }
  return true;
}
