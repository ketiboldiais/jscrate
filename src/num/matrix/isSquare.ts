import { colCount } from "@num";
import { rowCount } from "@num";
import { matrix } from "@type";

export function isSquare(m: matrix) {
  return rowCount(m) === colCount(m);
}
