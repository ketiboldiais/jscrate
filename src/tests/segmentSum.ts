import { Print } from "@util";

function segSum(A: number[], S: number) {
  const L = A.length;
  let i = 0;
  let j = 0;
  let result = [];
  let cs = 0;
	while (j < L) {
		cs += A[j];
		j++;
		while (cs > S && i < j) {
			cs = cs - A[i];
			i++;
		}
		if (cs === S) {
			result.push([i, j - 1]);
		}
	}
  // for (let i = 0; i < L; i++) {
  //   sum = A[i];
  //   while (sum < S && j < L) {
  //     j++;
  //     sum += A[j];
  //   }
	// 	console.log(sum);
  //   while (sum > S && i < L) {
  //     i++;
  //     sum -= A[i];
  //   }
  //   if (sum === S) result.push([i, j]);
	// 	j++;
  // }
	return result
}

const A = [1, 3, 2, 1, 4, 1, 3, 2, 1, 1, 2];

Print(segSum(A, 8));
