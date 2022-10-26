export function number(n: any) {
  return (
    typeof n === "number" &&
    Number.MIN_SAFE_INTEGER < n &&
    n < Number.MAX_SAFE_INTEGER &&
    !isNaN(n)
  );
}
