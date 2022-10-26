import { isString } from "@str";

export function reverse(s: string) {
  const L = s.length;
  if (!isString(s) || L === 0) return "";
  let reversed = "";
  for (let i = L - 1; i >= 0; i--) {
    reversed = `${reversed}${s[i]}`;
  }
  return reversed;
}
