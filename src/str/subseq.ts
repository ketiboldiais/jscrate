export function subseq(s = "", t = "") {
  const tL = t.length;
  const sL = s.length;
  if (sL === 0 && tL === 0) return true;
  if (sL > tL) return false;
  let i = 0;
  let j = 0;
  for (i = 0; i < tL; i++) {
    t[i] === s[j] && j++;
    if (j === s.length) return true;
  }
  return false;
}
