import { trunc } from "@num";

export function rem(a: number, b: number) {
  a = trunc(a);
  b = trunc(b);
  return ((a % b) + b) % b;
}
