export function succ(a = 0, b = 0) {
  if (a === null || a === undefined) a = 0;
  if (b === null || b === undefined) b = 0;
  return a < b ? b : a;
}
