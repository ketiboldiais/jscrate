import { Print } from "@util";

function hashDiv(k: string, L = 10) {
  let h = 0;
  const bound = (k.length < 100 && k.length) || 100;
  for (let i = 0; i < bound; i++) {
    h += k.charCodeAt(i);
  }
  return h % L;
}

const k1 = hashDiv("sally", 5);

Print(k1);
