import { max } from "@num";
import { min } from "@num";
import { interval } from "@type";

export namespace Interval {
  export function equal(a: interval, b: interval) {
    return a[0] === b[0] && a[1] === b[1];
  }
  export function sect(A: interval, B: interval) {
    const a = A[0];
    const b = A[1];
    const c = B[0];
    const d = B[1];
    const max = a > c ? a : c;
    const min = b < d ? b : d;
    if (a > d || c > d) return [];
    return [max, min];
  }
  export function union(A: interval, B: interval) {
    const a = A[0];
    const b = A[1];
    const c = B[0];
    const d = B[1];
    const max = a > c ? a : c;
    const min = b < d ? b : d;
    if (a > d || c > d) return [];
    return [min, max];
  }
  export function order(A: interval, B: interval) {
    const b = A[1];
    const c = B[0];
    if (b < c) return [A, B];
    return [B, A];
  }
  export function width(A: interval) {
    return A[1] - A[0];
  }
  export function abs(A: interval) {
    const a = A[0] < 0 ? -A[0] : A[0];
    const b = A[1] < 0 ? -A[1] : A[1];
    return a > b ? a : b;
  }
  export function add(A: interval, B: interval) {
    const a = A[0];
    const b = A[1];
    const c = B[0];
    const d = B[1];
    return [a + c, b + d];
  }
  export function sub(A: interval, B: interval) {
    const a = A[0];
    const b = A[1];
    const c = B[0];
    const d = B[1];
    return [a - d, b - c];
  }
  export function mul(A: interval, B: interval) {
    const a = A[0];
    const b = A[1];
    const c = B[0];
    const d = B[1];
    const ac = a * c;
    const ad = a * d;
    const bc = b * c;
    const bd = b * d;
    const minimum = min([ac, ad, bc, bd]);
    const maximum = max([ac, ad, bc, bd]);
    return [minimum, maximum];
  }
  export function div(A: interval, B: interval) {
    const a = A[0];
    const b = A[1];
    const c = B[0];
    const d = B[1];
    const ac = a / c;
    const ad = a / d;
    const bc = b / c;
    const bd = b / d;
    const minimum = min([ac, ad, bc, bd]);
    const maximum = max([ac, ad, bc, bd]);
    return [minimum, maximum];
  }
}
