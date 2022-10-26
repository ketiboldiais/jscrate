import { Set } from "@crates";
import { Print } from "@util";

const A = Set(1, 2, 3, 4);
const B = Set(5, 6, 7, 1);
const C = A.intersection(B);

Print(A);
Print(B);
Print(C);
