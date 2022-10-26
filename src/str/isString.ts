export function isString(d: any) {
  return (
    typeof d === "string" ||
    Object.prototype.toString.call(d) === "[object String]"
  );
}
