import { tuple } from "@type";
import { divides } from "./divides";
import { integer } from "../core/integer";
import { pair } from "../core/pair";

export function primeFactors(n: number) {
  let factors: tuple[] = []; // Holds the primes
  if (n <= 1 || !integer(n)) return factors;
  let d = 2; // the divisor
  while (n > 1 && d * d <= n) {
    let k = 0; // counts how many times we can divide n
    while (divides(d, n)) (n /= d) && k++;
    k > 0 && factors.push(pair(d, k));
    d++;
  }
  n > 1 && factors.push(pair(n, 1));
  return factors;
}
