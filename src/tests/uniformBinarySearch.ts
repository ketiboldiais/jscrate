import { ceil, floor } from "@num";

const uniformBinarySearch = (arr: number[], K: number) => {
  let N = arr.length;

  let i = ceil(N / 2);
  let m = floor(N / 2);

  do {
    if (K === arr[i]) return K;
    if (K < arr[i]) {
      i = i - ceil(m / 2);
    } else {
      i = i + ceil(m / 2);
      m = floor(m / 2);
    }
  } while (m !== 0);

  return null;
};

let arr = [1, 2, 8, 3, 5, 9, 10];
console.log(uniformBinarySearch(arr, 2));
