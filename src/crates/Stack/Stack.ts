import { rem } from "@num";

export class STACK {
  stack: any[];
  len: number;
  constructor(...frames: any[]) {
    this.stack = [];
    this.len = 0;
    if (frames && frames.length !== 0) {
      for (let i = 0; i < frames.length; ++i) this.stack.push(frames[i]);
      this.len = frames.length;
    }
    return this;
  }
  size() {
    return this.len;
  }
  search(key: any) {
    for (let i = 0; i < this.len; ++i) {
      if (this.stack[i] === key) return true;
    }
    return false;
  }
  push(frame: any) {
    this.stack.push(frame);
    this.len += 1;
    return this;
  }
  arrayed() {
    return this.stack;
  }
  clear() {
    this.stack = [];
    this.len = 0;
    return this;
  }
  pushall(frames: any[]) {
    const L = frames.length;
    for (let i = 0; i < L; i++) {
      this.stack[this.len] = frames[i];
      this.len += 1;
    }
    return this;
  }
  pop() {
    this.len -= 1;
    return this.stack.pop();
  }
  swap(i: number, j: number) {
    i = rem(i, this.len);
    j = rem(j, this.len);
    [this.stack[i], this.stack[j]] = [this.stack[j], this.stack[i]];
  }
  top() {
    return this.stack[this.len];
  }
  bottom() {
    return this.stack[0];
  }
  nonempty() {
    return this.len !== 0;
  }
  empty() {
    return this.len === 0;
  }
}

export const Stack = (...frames: any[]) => new STACK(...frames);
