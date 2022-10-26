import { divint } from "@num";
import { rem } from "@num";
import { integer } from "@num";
import { isString, reverse } from "@str";

export function base(
  n: number | string,
  b: number = 2,
  size: number = 0
): string | number {
  let str = ")";
  if (b > 36)
    console.error(
      `JavaScript numbers aren't large enough to support that base.`
    );
  if (b <= 1) console.error(`Invalid base. Base must be between 2 and 36.`);
  if (integer(n)) {
    let q = n as number;
    switch (b) {
      case 8: {
        while (q !== 0) {
          let ak = rem(q, b);
          q = divint(q, b);
          (ak === 8 && (str += 10)) ||
            (ak === 9 && (str += 11)) ||
            (ak === 10 && (str += 12)) ||
            (ak === 11 && (str += 13)) ||
            (ak === 12 && (str += 14)) ||
            (ak === 13 && (str += 15)) ||
            (ak === 14 && (str += 16)) ||
            (ak === 15 && (str += 17)) ||
            (str += ak);
        }
        break;
      }
      case 16: {
        while (q !== 0) {
          let ak = rem(q, b);
          q = divint(q, b);
          (ak === 10 && (str += "A")) ||
            (ak === 11 && (str += "B")) ||
            (ak === 12 && (str += "C")) ||
            (ak === 13 && (str += "D")) ||
            (ak === 14 && (str += "E")) ||
            (ak === 15 && (str += "F")) ||
            (str += ak);
        }
        break;
      }
      default: {
        while (q !== 0) {
          let ak = rem(q, b);
          q = divint(q, b);
          str += ak;
        }
        break;
      }
    }
    while (size > str.length) {
      str += "0";
      size -= 1;
    }
    str += "(";
    str = reverse(str);
    str += `[${b}]`;
    return str;
  } else if (isString(n)) {
    n = n as string;
    const L = n.length;
    console.log(n);
    let num: string | number = "";
    let bas = "";
    for (let i = 0; i < L; i++) {
      if (n[i] === "(") {
        i++;
        while (n[i] !== ")") {
          num += n[i];
          i++;
        }
      }
      if (n[i] === "[") {
        i++;
        while (n[i] !== "]") {
          bas += n[i];
          i++;
        }
      }
    }
    num = parseInt(num, parseInt(bas));
    if (b === 10) return num;
    return base(num, b, size);
  } else {
    return " ";
  }
}
