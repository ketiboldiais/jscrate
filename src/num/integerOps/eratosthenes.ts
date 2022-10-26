import { bitset } from "@crates";

export function eratosthenes(n: number) {
  let out: number[] = [];
  let b = bitset();
  for (let i = 0; i < n; i++) {
    b.push(1);
  }
  for (let i = 2; i <= n / 2; i++) {
    if (b.getBit(i)) {
      for (let j = i * 2; j <= n; j += i) {
        b.clearBit(j);
      }
    }
  }
  for (let i = 2; i < n; i++) {
    if (b.getBit(i) === 1) out.push(i);
  }
  return out;
}
