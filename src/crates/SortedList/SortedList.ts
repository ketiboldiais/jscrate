import { monode } from "@aux";
import { node } from "@type";

export class SORTED_SINGLY_LINKED_LIST {
  head: null | node;
  tail: null | node;
  constructor(args: any[], f = (x: number, y: number) => x < y) {
    this.head = null;
    this.tail = null;
    if (args.length !== 0) {
      const L = args.length;
      for (let i = 0; i < L; i++) {
        this.push(args[i]);
      }
    }
  }
  push(val: any) {
    const n = monode(val);
    if (this.head === null) {
      this.head = n;
      this.tail = n;
    } else if (this.tail) {
      if (val < this.head.value) {
        n.next = this.head;
        this.head = n;
      }
      let p = this.head;
      while (p !== null && p.next && p.next.value < val) {
        p = p.next;
      }
      let t = p.next;
      p.next = n;
      n.next = t;
    } else {
      console.error("Couldn't push new node.");
    }
    return this;
  }
  merge(list: SORTED_SINGLY_LINKED_LIST) {
    if (list.head === null) return this;
    let current: any = monode(0);
    let result = current;
    let L1: any = this.head;
    let L2: any = list.head;
    while (L1 && L2) {
      if (L1.value > L2.value) {
        current.next = L2;
        L2 = L2.next;
      } else {
        current.next = L1;
        L1 = L1.next;
      }
      current = current.next;
    }
    while (L1) {
      current.next = L1;
      L1 = L1.next;
      current = current.next;
    }
    while (L2) {
      current.next = L2;
      L2 = L2.next;
      current = current.next;
    }
    this.tail = current;
    this.head = result.next;
    return this;
  }
  arrayed() {
    let array: any[] = [];
    if (this.head === null) return array;
    let p = this.head;
    while (p !== null) {
      array.push(p.value);
      p = p.next as node;
    }
    return array;
  }
}

export const SortedList = (...args: any[]) =>
  new SORTED_SINGLY_LINKED_LIST(args);
