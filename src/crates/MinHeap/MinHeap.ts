import { floor } from "@num";

class HeapMin {
  array: any[];
  constructor(...arr: any) {
    if (arr) {
      this.array = [];
      this.insert(arr);
    } else {
      this.array = [];
    }
  }
  private bubble() {
    let c = this.array.length - 1;
    let p = floor((c - 1) / 2);
    while (this.array[c] <= this.array[p]) {
      [this.array[p], this.array[c]] = [this.array[c], this.array[p]];
      c = p;
      p = floor((c - 1) / 2);
    }
  }
  push(value: any) {
    this.array.push(value);
    this.bubble();
    return this;
  }
  insert(array: any[]) {
    const L = array.length;
    for (let i = 0; i < L; i++) {
      this.push(array[i]);
    }
    return this;
  }
  max() {
    const L = this.array.length;
    if (L === 0) return null;
    if (L === 1) return this.array[0];
    let n = floor(L / 2);
    let max = this.array[n];
    for (let i = n + 1; i < L; i++) {
      max = this.array[i] > max ? this.array[i] : max;
    }
    return max;
  }
  min() {
    return this.array[0];
  }
  delete() {
    if (this.array.length === 1) return this.array.pop();
    if (this.array.length === 0) return null;
    this.swap(0, this.array.length - 1);
    const deletedNode = this.array.pop();
    const L = this.array.length;
    let p = 0; // parent index
    let l = 1; // left child index
    let r = 2; // right child index
    let min = Math.min(this.array[l], this.array[r] || Infinity);
    while (p < L && this.array[p] > min) {
      let child = this.array[l] === min ? l : r;
      this.swap(p, child);
      p = child;
      l = p * 2 + 1;
      r = l + 1;
      min = Math.min(this.array[l], this.array[r] || Infinity);
    }
    return deletedNode;
  }
  swap(i: number, j: number) {
    return ([this.array[i], this.array[j]] = [this.array[j], this.array[i]]);
  }
  print() {
    const L = this.array.length;
    let out;
    if (L) {
      out = `[${this.array[0]},`;
      for (let i = 1; i < L; i++) {
        i < L - 1 ? (out += `${this.array[i]},`) : (out += `${this.array[i]}`);
      }
      out += "]";
    } else {
      out = "[ ]";
    }
    console.log(out);
    return this;
  }
}

export const minHeap = (...arg: any[]) => new HeapMin(...arg);
