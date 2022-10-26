import { rem } from "@num";

export class SET {
  private set: Map<any, number>;
  private index: number;
  constructor(...array: any[]) {
    this.set = new Map();
    this.index = 0;
    if (array.length !== 0) {
      this.index = array.length;
      for (let i = 0; i < this.index; i++) {
        !this.set.has(array[i]) && this.set.set(array[i], i);
      }
    }
  }
  size() {
    return this.set.size;
  }
  has(elm: any) {
    return this.set.has(elm);
  }
  at(idx: number) {
    idx = rem(idx, this.index);
    let i = 0;
    let out: any = null;
    for (const [key, _val] of this.set) {
      if (idx === i) {
        return (out = key);
      }
      i++;
    }
    return out;
  }
  intersection(set: any[] | SET) {
    const S = new SET();
    if (Array.isArray(set)) {
      const L = set.length;
      for (let i = 0; i < L; i++) {
        this.has(set[i]) && S.push(set[i]);
      }
    } else {
      for (const v of set.set.keys()) {
        this.has(v) && S.push(v);
      }
    }
    return S;
  }
  union(set: any[] | SET) {
    const S = new SET();
    for (const v of this.set.keys()) {
      S.push(v);
    }
    if (Array.isArray(set)) {
      const L = set.length;
      for (let i = 0; i < L; i++) {
        S.push(set[i]);
      }
    } else {
      for (const v of set.set.keys()) {
        S.push(v);
      }
    }
    return S;
  }
  pop(elm: any) {
    for (const [k, v] of this.set) {
      if (v === elm) {
        this.set.delete(k);
      }
    }
    let i = 0;
    let tmp = [];
    for (const [k, v] of this.set) {
      tmp[i] = v;
      this.set.delete(k);
      i++;
    }
    for (let j = 0; j < i; j++) {
      this.set.set(tmp[j], j);
    }
    this.index = i - 1;
    return this;
  }
  push(elm: any) {
    !this.set.has(elm) && this.set.set(elm, this.index);
    this.index += 1;
    return this;
  }
  arrayed() {
    let out: any[] = [];
    if (this.set.size === 0) return out;
    for (const v of this.set.keys()) {
      out.push(v);
    }
    return out;
  }
  log() {
    console.log(this.set);
  }
}

export const Set = (...elements: any[]) => new SET(...elements);
