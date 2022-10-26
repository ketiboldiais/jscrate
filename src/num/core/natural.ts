import { number } from "./number";

export function natural(n: number) {
  return number(n) && (n | 0) === n && n >= 0;
}
