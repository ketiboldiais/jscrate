export function productRule(a: any[], b: any[]) {
  const aL = a.length;
  const bL = b.length;
  let out = [];
  for (let i = 0; i < bL; i++) {
    for (let j = 0; j < aL; j++) {
      let op = [a[j], b[i]];
      out.push(op);
    }
  }
  return out;
}
