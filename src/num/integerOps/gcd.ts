import { rem } from "@num";
import { abs } from "@num";

export function gcd(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  let m = abs(a);
  let n = abs(b);
  if (m < n) {
    let tmp = n;
    n = m;
    m = tmp;
  }
  let r;
  do {
    r = rem(m, n);
    if (r === 0) break;
    m = n;
    n = r;
  } while (r !== 0);
  return n;
}

