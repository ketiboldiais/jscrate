import { Print } from "@util";

function f(S: string) {
	const L = S.length;

	let i = 0;
	let j = 0;
	let w = 0;
	let max_window = 0;
	let start_window = -1;

	let hashmap = new Map();

	while (j < L) {
		let char = S[j];
		if (hashmap.has(char) && hashmap.get(char) >= i) {
			i = hashmap.get(char) + 1;
			w = j - 1;
		} 
		hashmap.set(char, j);
		w++;
		j++;

		if (w > max_window) {
			max_window = w;
			start_window = i;
		}
	}
	return S.slice(start_window, max_window+1);
}

Print(f("abcabed"))
