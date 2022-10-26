import { Vector } from "@crates";
import { Print } from "@util";

const vect = Vector.int8(1, 9, 3, 0, 18, 5, 2, 4, 10, 7, 12, 6);
// const vectHas345 = vect.has(4,5);
// Print(vectHas345);

const longestBandLength = vect.maxBandLength();
Print(longestBandLength);
