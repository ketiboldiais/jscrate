import { node } from "@type";
import { monode } from "@aux";

class QUEUE {
  private first: null | node;
  private last: null | node;
  private len: number;
  constructor(...arg: any[]) {
    this.first = null;
    this.last = null;
    this.len = 0;
    if (arg) {
      const L = arg.length;
      for (let i = 0; i < L; i++) {
        this.enqueue(arg[i]);
      }
    }
  }
  private traverse(f: Function) {
    let p = this.first;
    while (p !== null) {
      f.call(this, p);
      p = p.next;
    }
  }
  clear() {
    this.first = null;
    this.last = null;
    this.len = 0;
    return this;
  }
  nonempty() {
    return this.len !== 0;
  }
  empty() {
    return this.len === 0;
  }
  arrayed() {
    if (this.empty()) {
      return null;
    }
    let out = [];
    let p = this.first;
    while (p !== null) {
      out.push(p.value);
      p = p.next;
    }
    return out;
  }
  length() {
    return this.len;
  }
  peek() {
    return this.first !== null ? this.first.value : null;
  }
  insert(value: any, index: number) {
    if (index === this.len || this.first === null) {
      return this.enqueue(value);
    } else if (index < 0 || this.len < index) {
      console.error(
        index < 0
          ? `Invalid index in call to Queue.insert(). Negative index passed.`
          : `Invalid index in call to Queue.insert(). Passed ${index}, but the maximum index is ${this.len}.`
      );
    } else {
      let t = monode(value);
      let p = this.first;
      if (index === 0) {
        t.next = p;
        this.first = t;
        return this;
      } else {
        for (let i = 1; i < index && p.next !== null; i++) {
          p = p.next;
        }
        if (p !== null) {
          t.next = p.next;
          p.next = t;
          this.len += 1;
          return this;
        } else {
          console.error(
            `Insertion failed in call to Queue.insert(${value}, ${index}). This is a rare edge case, contact the developer at koldiais@gmail.com`
          );
        }
      }
    }
  }
  enqueue(value: any) {
    const node = monode(value);
    if (this.first === null) {
      this.first = this.last = node;
      this.len += 1;
    } else {
      this.last && (this.last.next = node);
      this.last = node;
      this.len += 1;
    }
    return this;
  }
  dequeue() {
    if (this.first === null) return null;
    else {
      let node = this.first;
      if (this.first === this.last) {
        this.last = null;
      }
      this.first = this.first.next;
      this.len -= 1;
      return node.value;
    }
  }
  contains(value: any) {
    let out = false;
    this.traverse((n: node) => {
      if (n.value === value) {
        out = true;
      }
    });
    return out;
  }
  print() {
    if (this.len !== 0) {
      let out = `( `;
      let p: node | null = this.first;
      while (p) {
        out += `${p.value} `;
        p = p.next;
      }
      out += ")";
      console.log(out);
    } else {
      console.log("( )");
    }
    return this;
  }
}

export const Queue = (...args: any) => new QUEUE(...args);
