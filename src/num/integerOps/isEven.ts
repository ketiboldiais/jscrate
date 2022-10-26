import { abs } from "../core/abs";
import { integer } from "../core/integer";

export function isEven(n: number) {
  if (!integer(n)) return false;
  return (abs(n) | 1) > n;
}
