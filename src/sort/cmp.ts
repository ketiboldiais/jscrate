import { number } from "@num";
import { isFunc, isString, strcmp } from "@str";
import { base, comp } from "@type";

export function cmp(a: base = 0, b: base = 0, order: comp = "<") {
  if (isFunc(order)) {
    return (order as Function)(a, b);
  } else if (number(a) && number(b)) {
    return order === "<" ? a < b : a > b;
  } else if (isString(a) && isString(b)) {
    return order === "<" ? strcmp(b, a) : !strcmp(b, a);
  } else {
    return a === b;
  }
}
