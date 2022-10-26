import { struct } from "@type";
import { Print } from "@util";

function asciiGen() {
  let listfrm =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.!\"#$%&'()*+,/:;<=>?@\\[]^_{|}~";
  let listto =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.!\"#$%&'()*+,/:;<=>?@\\[]^_{|}~";
  let len = listfrm.length;
  let max = 164;
  let fnd = 0;
  let splt = 16; // How many chars before a line break

  let i, j;
  let out = [];
  out.push(`[`);
  for (i = 0; i < max; ++i) {
    fnd = 0;
    for (j = 0; j < len; ++j) {
      if (listfrm[j].codePointAt(0) === i) {
        out.push(`"${listto[j]}",`);
        fnd = 1;
        break;
      }
    }
    if (!fnd) out.push(` 0 , `);
    if (i % splt == splt - 1) out.push(`\n`);
  }
  out.push(`]`);
  out.push("\n");
  return out.join("");
}

function asciiArray() {
  let out: struct = {};
  let alphabetSize = 0;
  for (let i = 0; i < 126; i++) {
    if (i < 97 && i !== 0) continue;
    if (i > 122) continue;
    if (i <= 32 && i !== 0) {
      continue;
    }
    if (14 <= i && i <= 31) {
      continue;
    }
    if (1 <= i && i <= 7) {
      continue;
    }
    if (i === 11) {
      continue;
    }
    out[i] = { char: String.fromCharCode(i), index: alphabetSize };
    alphabetSize += 1;
  }
  console.log(alphabetSize);
  return out;
}

// const str = asciiGen();

const asciiArr = asciiArray();
console.log(asciiArr);

// console.log(str);
