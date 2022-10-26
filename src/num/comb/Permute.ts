import { Print } from "@util";

export function Permute(array: any) {
  let N = array.length;
  const heapsPermuteString = (n:number, results:any[] = []) => {
    n = n || N;
    if (n === 1) results.push(array.slice().join(""));
    else {
      for (let i = 1; i <= n; i += 1) {
        heapsPermuteString(n - 1, results);
        let j = n & 1 ? 1 : i;
        [array[j - 1], array[n - 1]] = [array[n - 1], array[j - 1]];
      }
    }
    return results;
  };
  const heapsPermute = (n:number, results:any[] = []) => {
    n = n || N;
    if (n === 1) results.push(array.slice());
    else {
      for (let i = 1; i <= n; i += 1) {
        heapsPermute(n - 1, results);
        let j = n & 1 ? i : 1;
        [array[j - 1], array[n - 1]] = [array[n - 1], array[j - 1]];
      }
    }
    return results;
  };
  if (typeof array === "string") {
    array = [...array];
    return heapsPermuteString(N, []);
  }
  return heapsPermute(N, []);
}

Print(Permute("110"));
