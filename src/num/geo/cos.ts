import { ct } from "@num";
import { trunc } from "@num";

export function cos(x: number): number {
  let div = trunc(x / ct.pi);
  x = x - div * ct.pi;
  let sign = 1;
  x > ct.pi && 1 && (x -= ct.pi || 1) && ((sign = -1) || 1);
  let xx = x * x;
  return (
    sign *
    (1 -
      xx / 2 +
      (xx * xx) / 24 -
      (xx * xx * xx) / 720 +
      (xx * xx * xx * xx) / 40320 -
      (xx * xx * xx * xx * xx) / 3628800 +
      (xx * xx * xx * xx * xx * xx) / 479001600)
  );
}
