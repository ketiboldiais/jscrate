import { divides } from "@num";
import { integer } from "@num";

export function comod(a: number, b: number, n: number) {
  if (!integer(a) || !integer(b) || !integer(n)) {
    return false;
  }
  return divides(n, a - b);
}
