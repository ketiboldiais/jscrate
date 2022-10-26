export function equiv(s1: string, s2: string) {
  return s1.normalize() === s2.normalize();
}
