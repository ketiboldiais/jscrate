import { floor } from "@num";
import { mergeSort } from "@sort"
import { Print } from "@util";

const binarySearch = (arr: number[], K: number) => {
	arr = mergeSort(arr);

	const N = arr.length;
	let l = 0;
	let u = N-1;

	do {
		let i = floor((l + u) / 2)
		if (K === arr[i]) return K;
		else if (K < arr[i]) { u = i - 1; }
		else { l = i + 1; }
	} while (u >= l);

	return null;
}


let arr = [1, 2, 8, 3, 5, 9, 10];
console.log(binarySearch(arr, 2));
