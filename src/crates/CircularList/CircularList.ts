import { monode } from "@aux";
import { node } from "@type";

export class CIRCULAR_LIST {
  head: null | node;
  tail: null | node;
  len: number;
  constructor(...elms: any[]) {
    this.head = null;
    this.tail = null;
    this.len = 0;
    if (elms && elms.length !== 0) {
      let firstnode = monode(elms[0]);
      this.head = this.tail = firstnode;
      const L = elms.length;
      for (let i = 1; i < L; i++) {
        firstnode = monode(elms[i]);
        this.tail.next = firstnode;
        firstnode.next = this.head;
        this.tail = firstnode;
        this.len++;
      }
      this.len++;
      return this;
    }
  }
  arrayed() {
    let out: any[] = [];
    if (this.head === null) return out;
    let p: null | node = this.head;
    do {
      out.push(p.value);
      p = p.next;
    } while (p !== this.head && p !== null);
    return out;
  }
  push(val: any) {
    const newnode = monode(val);
    if (this.head === null || this.tail === null) {
      this.head = this.tail = newnode;
    } else {
      this.tail.next = newnode;
      newnode.next = this.head;
      this.tail = newnode;
    }
    this.len++;
    return this;
  }
}

export const CircularList = (...elms: any[]) => new CIRCULAR_LIST(...elms);
