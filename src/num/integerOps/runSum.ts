export function runSum(nums: number[]) {
  const L = nums.length;
  let out = new Array(L).fill(0);
  out[0] = nums[0];
  for (let i = 1; i < L; i++) {
    out[i] = out[i - 1] + nums[i];
  }
  return out;
}
