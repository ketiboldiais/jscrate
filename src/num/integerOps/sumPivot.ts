export function sumPivot(nums: number[]) {
  const L = nums.length; /* get the length */
  let totalSum = 0; /* get the total sum */
  for (let i = 0; i < L; i++) { /* compute the total sum */
    totalSum += nums[i];
  }
  let leftSum = 0; /* accumulate the left sum */
  for (let i = 0; i < L; i++) { /* iterate over nums */
		let current = nums[i];
		/**
		 * totalSum - leftsum - nums[i]  
		 * will give the right sum without the current element
		 * if that right sum is the same as the left sum,
		 * then we have the privot
		 */
    if (totalSum - leftSum - current === leftSum) {
      return i;
    }
    leftSum += nums[i];
  }
  return -1;
}
