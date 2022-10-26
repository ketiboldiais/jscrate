import { rem } from "@num";

export class VECTOR_UINT8 {
  private count: number;
  private capacity: number;
  private array: Uint8Array;
  constructor(...nums: any[]) {
    this.count = 0;
    this.capacity = 0;
    this.array = new Uint8Array();
    if (nums.length !== 0) {
      const L = nums.length;
      for (let i = 0; i < L; i++) {
        this.push(nums[i]);
      }
      return this;
    }
  }
  at(i: number) {
    i = rem(i, this.count);
    return this.array[i];
  }
  set(i: number, val: number) {
    i = rem(i, this.count);
    this.array[i] = val;
  }
  first() {
    return this.array[0];
  }
  last() {
    return this.array[this.count - 1];
  }
  empty() {
    return this.count === 0;
  }
  fit() {
    let n: Uint8Array | null = new Uint8Array(this.count);
    for (let i = 0; i < this.count; i++) {
      n[i] = this.array[i];
    }
    this.array = n;
    n = null;
    return this;
  }
  get length() {
    return this.count;
  }
  push(val: number) {
    if (this.capacity < this.count + 1) {
      let n: Uint8Array | null = new Uint8Array(2 * this.capacity + 1);
      this.capacity = 2 * this.capacity + 1;
      for (let i = 0; i < this.count; ++i) {
        n[i] = this.array[i];
      }
      this.array = n;
      n = null;
    }
    this.array[this.count] = val;
    this.count += 1;
    return this;
  }
  concat(array: VECTOR_UINT8) {
    const v8 = new VECTOR_UINT8();
    for (let i = 0; i < this.count; ++i) {
      v8.push(this.array[i]);
    }
    for (let i = 0; i < array.count; ++i) {
      v8.push(array.array[i]);
    }
    return v8;
  }
  includes(val: number) {
    for (let i = 0; i < this.count; i++) {
      if (this.array[i] === val) return true;
    }
    return false;
  }
  insert(index: number, val: number) {
    index = rem(index, this.count);
    if (this.capacity < this.count + 1) {
      let n: Uint8Array | null = new Uint8Array(2 * this.capacity + 1);
      this.capacity = 2 * this.capacity + 1;
      for (let i = 0; i < this.count; ++i) {
        n[i] = this.array[i];
      }
      this.array = n;
      n = null;
    }
    for (let i = this.count; i > index; i--) {
      this.array[i] = this.array[i - 1];
    }
    this.array[index] = val;
    this.count++;
    return this;
  }
  delete(index: number) {
    index = rem(index, this.count);
    let out = this.array[index];
    for (let i = index; i < this.count - 1; ++i) {
      this.array[i] = this.array[i + 1];
    }
    this.count -= 1;
    return out;
  }
  pop() {
    let out = this.array[this.count - 1];
    this.count--;
    return out;
  }
  arrayed() {
    let out: number[] = [];
    if (this.array === null) return out;
    for (let i = 0; i < this.count; ++i) {
      out.push(this.array[i]);
    }
    return out;
  }
  log() {
    console.log(this);
    return this;
  }
}

export const VectorUint8 = (...nums: any[]) => new VECTOR_UINT8(...nums);
