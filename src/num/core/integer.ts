import { number } from "./number";

export function integer(n: any) {
  return number(n) && (n | 0) === n;
}
