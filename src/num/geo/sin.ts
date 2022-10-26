import { trunc, ct, cos } from "@num";

export function sin(x: number): number {
  let a = x;
  let div = trunc(x / ct.pi);
  x = x - div * ct.pi;
  let sign = 1;
  x > ct.pi && 1 && (x -= ct.pi || 1) && ((sign = -1) || 1);
  let xxx = x * x * x;
  return (
    (a > ct.pi / 4 && cos(ct.pi / 2 - x)) ||
    sign *
      (x -
        xxx / 6 +
        (xxx * x * x) / 120 -
        (xxx * xxx * x) / 5040 +
        (xxx * xxx * xxx) / 362880 -
        (xxx * xxx * xxx * x * x) / 39916800 +
        (xxx * xxx * xxx * xxx) / 6227020800)
  );
}
