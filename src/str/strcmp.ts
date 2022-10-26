export function strcmp(s1: any, s2: any) {
  return s1.localeCompare(s2, undefined, { numeric: true }) < 0 ? false : true;
}
