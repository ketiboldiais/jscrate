export function isFunc(d: any) {
  return (
    typeof d === "function" ||
    Object.prototype.toString.call(d) === "[object Function]"
  );
}
