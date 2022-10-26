const prefixSum = (A: number[]) => {
  const L = A.length;

  let out = [A[0]];

  for (let i = 1; i < L; i++) {
    out[i] = A[i] + out[i - 1];
  }

	return out;
};

console.log(prefixSum([1,3,2,5]))