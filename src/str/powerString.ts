import { Print } from "@util";

function bitstring(i: number, B=[], bitstrings=[]) {
	if (i === B.length) return bitstrings.push(B.slice())
	else {
		B[i] = 1;
		return bitstring(i + 1, B, bitstrings);
		B[i] = 0;
		return bitstrings(i + 1, B, bitstrings);
	}
}



function powerString(S: string) {
}

const b = bitstring(0, [0,0,0], []);

Print(b);