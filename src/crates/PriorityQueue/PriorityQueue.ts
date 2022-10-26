import { pnode } from "@aux";
import { abs, floor } from "@num";
import { PriorityNode } from "@type";
import { Print } from "@util";

class PRIORITYQUEUE {
  private array: PriorityNode[];
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
    let p = abs(floor((c - 1) / 2));
    while (0 < c && this.array[c].priority < this.array[p].priority) {
      [this.array[p], this.array[c]] = [this.array[c], this.array[p]];
      c = p;
      p = floor((c - 1) / 2);
    }
  }
  private swap(i: number, j: number) {
    return ([this.array[i], this.array[j]] = [this.array[j], this.array[i]]);
  }
  enqueue(value: any, priority: number) {
    let p = pnode(value, priority);
    this.array.push(p);
    this.bubble();
    return this;
  }
  insert(array: [any, number][]) {
    const L = array.length;
    for (let i = 0; i < L; i++) {
      this.enqueue(array[i][0], array[i][1]);
    }
    return this;
  }
  rear() {
    const L = this.array.length;
    if (L === 0) return null;
    if (L === 1) return this.array[0];
    let n = floor(L / 2);
    let max = this.array[n];
    let maxPriority = max.priority;
    for (let i = n + 1; i < L; i++) {
      max = this.array[i].priority > maxPriority ? this.array[i] : max;
    }
    return max;
  }
  front() {
    return this.array[0];
  }
  dequeue() {
    if (this.array.length === 0) return;
    // if (this.array.length === 1) return this.array.pop();
    this.swap(0, this.array.length - 1);
    const deletedNode = this.array.pop();
    let p = 0; // parent index
    let l = 1; // left child index
    let r = 2; // right child index
    let min = Math.min(
      this.array[l]?.priority,
      this.array[r]?.priority || Infinity
    );
    while (this.array[p]?.priority >= min) {
      let child = this.array[l]?.priority === min ? l : r;
      this.swap(p, child);
      p = child;
      l = p * 2 + 1;
      r = l + 1;
      min = Math.min(
        this.array[l]?.priority,
        this.array[r]?.priority || Infinity
      );
    }
    return deletedNode;
  }
  empty() {
    return this.array.length === 0;
  }
  nonempty() {
    return this.array.length !== 0;
  }
  print() {
    const L = this.array.length;
    let out;
    if (L) {
      out = `[ `;
      for (let i = 0; i < L; i++) {
        out += `(${this.array[i].value},${this.array[i].priority}) `;
      }
      out += "]";
    } else {
      out = "[ ]";
    }
    Print(out);
    return this;
  }
}

export const PriorityQueue = (...arg: any[]) => new PRIORITYQUEUE(...arg);
