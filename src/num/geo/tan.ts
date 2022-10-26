import { trunc, ct } from "@num";

export function tan(x: number): number {
  let a = x;
  let div = trunc(x / ct.pi);
  x = x - div * ct.pi;
  x > ct.pi && 1 && (x -= ct.pi || 1);
  let xxx = x * x * x;
  if (a > ct.pi / 4) {
    const w = ct.pi / 2 - x;
    const www = w * w * w;
    const t =
      w +
      www / 3 +
      (2 * www * w * w) / 15 +
      (17 * www * www * w) / 315 +
      (62 * www * www * www) / 2835 +
      (1382 * www * www * www * w * w) / 155925 +
      (21844 * www * www * www * www * w) / 6081075 +
      (929569 * www * www * www * www * www) / 638512875;
    return 1 / t;
  } else if (a > ct.pi / 8) {
    const j = x / 2;
    const jjj = j * j * j;
    const v =
      j +
      jjj / 3 +
      (2 * jjj * j * j) / 15 +
      (17 * jjj * jjj * j) / 315 +
      (62 * jjj * jjj * jjj) / 2835 +
      (1382 * jjj * jjj * jjj * j * j) / 155925 +
      (21844 * jjj * jjj * jjj * jjj * j) / 6081075 +
      (929569 * jjj * jjj * jjj * jjj * jjj) / 638512875;
    const n = 2 * v;
    const m = 1 - v ** 2;
    return n / m;
  } else {
    return (
      x +
      xxx / 3 +
      (2 * xxx * x * x) / 15 +
      (17 * xxx * xxx * x) / 315 +
      (62 * xxx * xxx * xxx) / 2835 +
      (1382 * xxx * xxx * xxx * x * x) / 155925 +
      (21844 * xxx * xxx * xxx * xxx * x) / 6081075 +
      (929569 * xxx * xxx * xxx * xxx * xxx) / 638512875
    );
  }
}
