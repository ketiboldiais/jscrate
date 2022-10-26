import { Print } from "@util";

export function truthTable(f: Function, vars: string[]) {
  const L = f.length;
  const numberOfSets = 1 << L;
  let results: any = [];
  for (let i = 0; i < numberOfSets; i++) {
    results.push({});
    for (let j = 0; j < L; j++) {
      if (((1 << j) & i) > 0) {
        results[i][vars[j]] = true;
      } else {
        results[i][vars[j]] = false;
      }
    }
  }
  const n = results.length;

  for (let i = 0; i < n; i++) {
    let curr = Object.values(results[i]);
    results[i][vars[vars.length - 1]] = f.apply(null, curr);
  }

  return results;
}

const n = truthTable((a: boolean, b: boolean) => a || b, ["a", "b", "a or b"]);
console.log(n);
