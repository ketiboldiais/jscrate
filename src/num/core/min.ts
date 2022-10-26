export function min(array: number[]) {
  let min = Number.MAX_VALUE;
  const L = array.length;
  for (let i = 0; i < L; i++) {
    min = array[i] < min ? array[i] : min;
  }
  return min;
}
