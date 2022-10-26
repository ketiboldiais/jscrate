import { rem } from "@num";
import { dnode } from "@type";

function node(value: any): dnode {
  return { value, next: null, prev: null };
}

export class DoublyLinkedList {
  private head: dnode | null;
  private tail: dnode | null;
  private len: number;
  constructor(...args: any[]) {
    if (args.length !== 0) {
      const L = args.length;
      this.len = L;
      let newnode = node(args[0]);
      this.head = newnode;
      this.tail = newnode;
      for (let i = 1; i < L; i++) {
        newnode = node(args[i]);
        this.tail.next = newnode;
        newnode.prev = this.tail;
        this.tail = newnode;
      }
    } else {
      this.head = null;
      this.tail = null;
      this.len = 0;
    }
  }
  private traverse(index: number, f: Function) {
    if (this.head === null || this.tail === null) return null;
    let p: dnode;
    if (index <= this.len >> 1) {
      p = this.head;
      for (; p !== null && 0 < index; index--) p = p.next as dnode;
      return f(p);
    } else {
      index = this.len - 1 - index;
      p = this.tail;
      for (; p !== null && 0 < index; index--) p = p.prev as dnode;
      return f(p);
    }
  }
  insert(value: any, index: number) {
    const newnode = node(value);
    if (this.head === null) {
      this.head = newnode;
      this.tail = newnode;
      return this;
    }
    index = rem(index, this.len);
    if (index === 0) return this.prefix(value);
    if (index === this.len - 1) return this.push(value);
    index = index - 1;
    let leftNode: dnode = this.head;
    this.traverse(index, (n: dnode) => (leftNode = n));
    if (leftNode !== null) {
      const rightNode = leftNode.next;
      leftNode.next = newnode;
      newnode.prev = leftNode;
      newnode.next = rightNode;
      rightNode && (rightNode.prev = newnode);
      this.len += 1;
    }
    return this;
  }
  get(index: number) {
    index = rem(index, this.len);
    return this.traverse(index, (p: dnode) => p.value);
  }
  set(value: any, index: number) {
    let out = null;
    index = rem(index, this.len);
    this.traverse(index, (p: dnode) => {
      out = p.value;
      p.value = value;
    });
    return out;
  }
  delete(index: number) {
    index = rem(index, this.len);
    if (index === 0) return this.lop();
    if (index === this.len - 1) return this.pop();
    let ptr = this.head;
    this.traverse(index, (p: dnode) => (ptr = p));
    if (ptr && ptr.prev && ptr.next) {
      let out = ptr.value;
      ptr.prev.next = ptr.next;
      ptr.next.prev = ptr.prev;
      ptr.next = null;
      ptr.prev = null;
      this.len -= 1;
      return out;
    } else {
      console.error(`Call to delete() failed.`);
    }
  }
  length() {
    return this.len;
  }
  lop() {
    if (this.tail === null || this.head === null) return null;
    let oldhead = this.head;
    if (this.len === 1) {
      this.head = null;
      this.tail = null;
      return oldhead.value;
    } else {
      this.head = oldhead.next;
      if (this.head !== null) this.head.prev = null;
      oldhead.next = null;
    }
    this.len -= 1;
    return oldhead.value;
  }
  prefix(val: any) {
    const newnode = node(val);
    if (this.head === null) {
      this.head = newnode;
      this.tail = newnode;
    } else {
      this.head.prev = newnode;
      newnode.next = this.head;
      this.head = newnode;
    }
    this.len += 1;
    return this;
  }
  arrayed() {
    let array: any[] = [];
    if (this.head === null) return array;
    let p = this.head;
    while (p !== null) {
      array.push(p.value);
      p = p.next as dnode;
    }
    return array;
  }
  push(val: any) {
    const newnode = node(val);
    if (this.tail === null) {
      this.head = newnode;
      this.tail = newnode;
    } else {
      this.tail.next = newnode;
      newnode.prev = this.tail;
      this.tail = newnode;
    }
    this.len += 1;
    return this;
  }

  log() {
    const rows = [
      `---`,
      `Length: ${this.len}`,
      `Container: DoublyLinkedList`,
      `---`,
    ];
    for (let p = this.head; p != null; p = p.next) {
      let nextData = p.next ? p.next.value : " ";
      let prevData = p.prev ? p.prev.value : " ";
      if (p === this.head) {
        rows.push(
          `| data: ${p.value} | next: ${nextData} | prev: ${prevData} |<--head`
        );
      } else if (p === this.tail) {
        rows.push(
          `| data: ${p.value} | next: ${nextData} | prev: ${prevData} |<--tail`
        );
      } else {
        rows.push(
          `| data: ${p.value} | next: ${nextData} | prev: ${prevData} |`
        );
      }
    }
    console.log(rows.join("\n"));
  }
  pop() {
    if (this.tail === null) {
      return null;
    } else {
      let out = this.tail;
      if (this.len === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.tail = out.prev;
        if (this.tail && this.tail.next) this.tail.next = null;
        out.prev = null;
        this.len -= 1;
        return out.value;
      }
    }
  }
}

export const DList = (...args: any) => new DoublyLinkedList(...args);
