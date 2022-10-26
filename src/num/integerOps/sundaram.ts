import { bitset } from "@crates";

export function sundaram(n: number) {
  let out: number[] = [];
  let b = bitset();
  for (let i = 0; i < n; i++) {
    b.push(1);
  }
  
  for (let i = 2; i < n; i++) {
    if (b.getBit(i) === 1) out.push(i);
  }
  return out;
}
