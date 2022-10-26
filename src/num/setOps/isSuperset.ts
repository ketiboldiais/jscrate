// import { set } from "@crates";
// import { anyset } from "@type";

// export function superset(A: anyset, B: anyset): boolean {
//   for (const x of B) if (!A.has(x)) return false;
//   return true;
// }

// export function seteq(A: anyset, B: anyset): boolean {
//   for (const x of A) if (!B.has(x)) return false;
//   for (const x of B) if (!A.has(x)) return false;
//   return true;
// }

// export function union(A: anyset, B: anyset): anyset {
//   const S = set(A);
//   for (const x of B) S.add(x);
//   return S;
// }

// export function cartprod(A: anyset, B: anyset): anyset {
//   let arr = [];
//   for (const x of A) {
//     for (const y of B) {
//       arr.push([x, y]);
//     }
//   }
//   return set(...arr);
// }

// export function intersection(A: anyset, B: anyset): anyset {
//   const S = set();
//   for (const x of B) if (A.has(x)) S.add(x);
//   return S;
// }

// export function disjoint(A: anyset, B: anyset): boolean {
//   for (const x of A) if (B.has(x)) return false;
//   for (const x of B) if (A.has(x)) return false;
//   return true;
// }

// export function diff(A: anyset, B: anyset): anyset {
//   const S = set(A);
//   for (const x of B) S.delete(x);
//   return S;
// }

// export function twin(B: anyset) {
//   let arr = [];
//   for (const el of B) {
//     arr.push([el, el]);
//   }
//   return set(...arr);
// }

// export function reflexive(A: anyset, B: anyset) {
//   let S = twin(B);
//   for (const x of S) {
//     if (A.has(x)) console.log(x);
//     // if (!A.has(x)) return false;
//   }
//   return true;
// }

// export function symdiff(A: anyset, B: anyset): anyset {
//   const S = set(A);
//   for (const x of B) S.has(x) ? S.delete(x) : S.add(x);
//   return S;
// }
