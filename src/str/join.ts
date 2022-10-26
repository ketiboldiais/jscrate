export function join(...s: string[]) {
  const L = s.length;
  if (L === 0) return "";
  let out = s[0];
  if (L === 1) return out;
  for (let i = 1; i < L; i++) {
    out += s[i];
  }
  return out;
}
