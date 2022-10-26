import {
  cofactor,
  negate,
  isSquare,
  mtxMinor,
  mtxSub,
  comatrix,
  colCount,
  rowCount,
  mtxAdd,
  mtxSim,
  isDiagonal,
} from "@num";
import { Print } from "@util";

const A = [
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
];
const B = [
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
];

const C = [
  [1, 2, 3],
  [0, 4, 5],
  [1, 0, 6],
  [2, 8, 0],
];

const AsimB = mtxSim(A, B);

// Print(AsimB);

const AsimC = mtxSim(A, C);

// Print(AsimC);

const A1 = [
  [1, 0, 0, 0, 0],
  [0, 2, 0, 0, 0],
  [0, 0, 3, 0, 0],
  [0, 0, 0, 4, 0],
  [0, 0, 0, 0, 5],
];

const A2 = [
  [1, 0, 0, 0, 0],
  [0, 2, 0, 0, 0],
  [0, 0, 3, 0, 7],
  [0, 0, 0, 4, 0],
  [0, 0, 0, 0, 5],
];

const A1isDiagonal = isDiagonal(A1);
const A2isDiagonal = isDiagonal(A2);

Print(A1isDiagonal);
Print(A2isDiagonal);
