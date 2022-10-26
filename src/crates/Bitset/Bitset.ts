import { abs, divint, rem, trunc } from "@num";

class BITSET {
  private array: Uint32Array;
  private arraySize: number;
  private arrayLength: number;
  private len: number;
  constructor(...arg: (0 | 1)[]) {
    this.arraySize =
      abs(divint(trunc(10), 32)) <= 0
        ? abs(divint(trunc(10), 32) + 1)
        : abs(divint(trunc(10), 32));
    this.arrayLength = this.arraySize * 32;
    this.len = 0;
    this.array = new Uint32Array(this.arraySize);
    if (arg.length !== 0) {
      this.shove(arg);
    }
  }
  private extend() {
    this.arraySize = this.arraySize * 2;
    const newArray = new Uint32Array(this.arraySize);
    for (let i = 0; i < this.arraySize; i++) {
      newArray[i] = this.array[i];
    }
    this.array = newArray;
    this.arrayLength = this.arraySize * 32;
  }
  get length() {
    return this.len;
  }
  fill(val = 1, start = 0, end = this.len) {
    if (val === 1) {
      for (let i = start; i < end; i++) {
        if (i >= this.len) {
          this.push(1);
        } else {
          this.setBit(i);
        }
      }
    } else {
      for (let i = start; i < end; i++) {
        if (i >= this.len) {
          this.push(0);
        } else {
          this.clearBit(i);
        }
      }
    }
    return this;
  }
  arrayed() {
    let out = [];
    for (let i = 0; i < this.len; i++) {
      let b = this.getBit(i);
      out.push(b);
    }
    return out;
  }
  reset() {
    const a = new Uint32Array(this.arraySize);
    this.array = a;
    return this;
  }
  uInt() {
    let sum = 0;
    for (let i = 0; i < this.arraySize; i++) {
      sum += this.array[i];
    }
    return sum;
  }
  push(b: 1 | 0) {
    this.len += 1;
    this.len + 3 > this.arrayLength && this.extend();
    if (b) {
      this.setBit(this.len - 1);
    } else {
      this.clearBit(this.len - 1);
    }
    return this;
  }
  shove(bits: number[]) {
    if (bits.length === 0) {
      return this;
    }
    const L = bits.length;
    for (let i = 0; i < L; i++) {
      bits[i] === 1 ? this.push(1) : this.push(0);
    }
    return this;
  }
  pop() {
    return this.len > 0
      ? this.clearBit(this.len - 1) && (this.len -= 1) && this
      : 0;
  }
  getBit(index: number) {
    if (index < 0 || this.len <= index) {
      return 0;
    }
    const arrayIndex = divint(index, 32);
    let i = rem(index, 32);
    let mask = 1 << i;
    if (i === 31) {
      i = 32;
      mask = 1 << i;
      return (this.array[arrayIndex] & mask) > 0 ? 1 : 0;
    }
    return (this.array[arrayIndex] & mask) > 0 ? 1 : 0;
  }
  toggle(index: number) {
    this.getBit(index);
    return this.getBit(index) ? this.clearBit(index) : this.setBit(index);
  }
  setBit(index: number) {
    if (index < 0 || this.len <= index) {
      return this;
    }
    const arrayIndex = divint(index, 32);
    let i = rem(index, 32);
    const mask = 1 << i;
    let n = this.array[arrayIndex];
    n = n | mask;
    this.array[arrayIndex] = n;
    return this;
  }
  verifyBitwiseOperand(arg: number[] | BITSET) {
    if (!((arg && arg.length > 0) || BITSET)) {
      return false;
    }
  }
  or(bits: number[] | BITSET) {
    this.verifyBitwiseOperand(bits);
    for (let i = 0; i < this.len; i++) {
      let a =
        (bits instanceof BITSET && bits.getBit(i)) ||
        ((bits as number[])[i] === 1 ? 1 : 0);
      let b = this.getBit(i);
      let c = a | b;
      c && this.setBit(i);
    }
    return this;
  }
  xor(bits: number[] | BITSET) {
    this.verifyBitwiseOperand(bits);
    for (let i = 0; i < this.len; i++) {
      let a =
        (bits instanceof BITSET && bits.getBit(i)) ||
        ((bits as number[])[i] === 1 ? 1 : 0);
      let b = this.getBit(i);
      let c = a ^ b;
      (c && this.setBit(i)) || this.clearBit(i);
    }
    return this;
  }
  xnor(bits: number[] | BITSET) {
    this.verifyBitwiseOperand(bits);
    return this.xor(bits).not();
  }
  nor(bits: number[] | BITSET) {
    this.verifyBitwiseOperand(bits);
    return this.or(bits).not();
  }
  nand(bits: number[] | BITSET) {
    this.verifyBitwiseOperand(bits);
    return this.and(bits).not();
  }
  and(bits: number[] | BITSET) {
    this.verifyBitwiseOperand(bits);
    for (let i = 0; i < this.len; i++) {
      let a =
        (bits instanceof BITSET && bits.getBit(i)) ||
        ((bits as number[])[i] === 1 ? 1 : 0);
      let b = this.getBit(i);
      let c = a & b;
      (c && this.setBit(i)) || this.clearBit(i);
    }
    return this;
  }
  not() {
    if (this.len === 0) return this;
    for (let i = 0; i < this.len; i++) this.toggle(i);
    return this;
  }
  clearBit(index: number) {
    if (index === this.len + 1) {
      this.push(0);
      return this;
    }
    const arrayIndex = divint(index, 32);
    let i = rem(index, 32);
    const mask = ~(1 << i);
    let n = this.array[arrayIndex];
    n = n & mask;
    this.array[arrayIndex] = n;
    return this;
  }
  print(message = "") {
    let str = (message += "[");
    let i = 0;
    for (; i < this.len; i++) str += `${this.getBit(i)}`;
    str += "]";
    console.log(str);
    return this;
  }
}

export const Bitset = (...arg: (0 | 1)[]) => new BITSET(...arg);
