/**
 * Given x, returns the largest integer n where n ≥ x
 */

import { number } from "./number";

export function ceil(n: number) {
  if (number(n)) {
    let i = n | 0;
    return i < n ? i + 1 : i;
  } else {
    console.error(`${n} is not a number.`);
  }
}
