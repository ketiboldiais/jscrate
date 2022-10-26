import { abs } from "../core/abs";
import { integer } from "../core/integer";

export function isOdd(n: number) {
  if (!integer(n)) return false;
  return (abs(n) & 1) === 1;
}
