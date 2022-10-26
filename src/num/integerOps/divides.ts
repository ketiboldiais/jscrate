import { rem } from "../core/rem";
import { trunc } from "../core/trunc";

/**
 * Returns true if a divides b
 * I.e., a/b === 0
 */

export function divides(a: number, b: number) {
  return rem(trunc(b), trunc(a)) === 0;
}
