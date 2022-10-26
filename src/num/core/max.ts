export function max(array: number[]) {
  let max = Number.MIN_VALUE;
  const L = array.length;
  for (let i = 0; i < L; i++) {
    max = array[i] > max ? array[i] : max;
  }
  return max;
}
