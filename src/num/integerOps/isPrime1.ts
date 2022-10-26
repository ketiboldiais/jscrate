import { divides } from "./divides";
import { natural } from "../core/natural";

export function isPrime(n: number) {
  if (!natural(n)) return false;
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (divides(2, n) || divides(3, n)) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (divides(i, n) || divides(i + 2, n)) return false;
  }
  return true;
}
