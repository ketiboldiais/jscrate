import { trunc } from "@num";

export function nthFib(i: number) {
  if (i < 0 || i !== (i | 0)) throw new Error(`Invalid index`);
  const commonFibs: any = {
    0: 0,
    1: 1,
    2: 1,
    3: 2,
    4: 3,
    5: 5,
    6: 8,
    7: 13,
    8: 21,
    9: 34,
    10: 55,
  };
  if (i in commonFibs) return commonFibs[i];
  const fib = (n: number): number => {
    switch (true) {
      case n in commonFibs:
        return commonFibs[n];
      case n < 47:
        const sq5 = 5 ** 0.5;
        const phi = (sq5 + 1) / 2;
        const res = (phi ** n - (-1 * phi) ** -n) / sq5;
        const c = trunc(res);
        commonFibs[n] = c;
        return c;
      default:
        commonFibs[n] = fib(n - 1) + fib(n - 2);
        return commonFibs[n];
    }
  };
  return fib(i);
}
