import { rem } from "@num";
import { node } from "@type";

function listNode(value: any): node {
  return { value, next: null };
}

/* prettier-ignore */
export class SINGLY_LINKED_LIST {
  private head: null | node;
  private tail: null | node;
  private len: number;
  constructor(...args:any) {
		if (args) {
			const node = listNode(args[0]);
			this.head = node;
			this.tail = this.head;
			for (let i = 1; i < args.length; i++) {
				this.push(args[i]);
			}
			this.len = args.length;
		} else {
			this.head = null;
			this.tail = null;
			this.len = 0;
		}
  }
  get first() { return this.head ? this.head.value : null; }
	set first(value: any) {
		if (this.head !== null) this.head.value = value;
		else { this.push(value) };
	}
	get last() { return this.tail ? this.tail.value : null; }
	set last(value: any) {
		if (this.tail !== null) this.tail.value = value;
		else { this.push(value) };
	}
	arrayed() {
		let array:any[] = [];
		if (this.head===null) return array;
		let p = this.head;
		while (p !== null) {
			array.push(p.value);
			p = (p.next as node);
		}
		return array;
	}
	length() { return this.len; }
	search(value: any) {
		let p = this.head;
		while (p !== null) {
			if (p.value === value) return p.value;
			p = p.next;
		}
		return null;
	}
	insert(value:any, i:number) {
		if (this.head === null) { return this.push(value) }
		else {
			let t = listNode(value);
			let p = this.head;
			i = rem(i,this.len);
			if (i === 0) { return this.prepend(value) }
			while (0 < i-1 && p !== null && i--) { p = p.next as node; }
			t.next = p.next;
			p.next = t;
			this.len++;
			return this;
		}
	}
	remove(index: number) {
		if (this.head === null) { return null }
		else {
			let p = this.head;
			index = rem(index,this.len);
			if (index === 0) { return this.lop() }
			else if (index === this.len - 1) { return this.pop() }
			else {
				while (0 < index-1 && p !== null && index--) { p = p.next as node; }
				let out = p?.next?.value;
				let q = p.next?.next;
				p.next = q as node;
				this.len--;
				return out;
			}
		}
	}
	lop() {
		if (this.head !== null) {
			let p = this.head;
			let t = this.head.next;
			this.head = null;
			this.head = t;
			this.len--;
			return p;
		}
		return null;
	}
	pop() {
		let p = this.head;
		if (p === null) return null;
		for (let i = 2; (i < this.len && p !== null); i++) { p = p.next }
		let out = p?.next?.value;
		(p) && (p.next = null);
		this.tail = p;
		this.len--;
		return out;
	}
	prepend(value: any) {
		if (this.head === null) { this.push(value) }
		else {
			const node = listNode(value);
			node.next = this.head;
			this.head = node;
			this.len++;
		}
	}
	get(i:number) {
		let p = this.head;
		i = rem(i,this.len);
		while (p !== null && 0 < i && i--) { p = p.next }
		return p !== null ? p.value : null;
	}
	reversed() {
		const list = new SINGLY_LINKED_LIST();
		let p = this.head;
		while (p !== null) {
			list.prepend(p.value);
			p = p.next;
		}
		return list;
	}
	kreverse(k:number) {
		k = rem(k, this.len);
		if (k === 0||k===1||k===this.len) { return this; }
		const rev = (n: any, k: number) => {
			if (n === null) { return null };
			let prev:any = null;
			let current = n;
			let temp:any;
			let count = 1;
			while (current !== null && count <= k) {
				temp = current.next;
				current.next = prev;
				prev = current;
				current = temp;
				count++;
			} 
			if (temp !== null) { n.next = rev(temp, k) }
			return prev;
		}
		this.head = rev(this.head, k);
		return this;

	}
	reverse() {
		if (this.head === null || this.len === 1) { return this; }
		else {
			let prev:any = null;
			let current: any = this.head; this.tail = current;
			let next:any = this.head.next;
			do {
				current.next = prev;
				prev = current;
				current = next;
				next = next.next;
			} while (next !== null)
			current.next = prev;
			this.head = current;
			return this;
		}
	}
	set(i: number, value: any) {
		let p = this.head;
		i = rem(i,this.len);
		while (p !== null && 0 < i && i--) { p = p.next }
		let out = p?.value;
		(p) && (p.value = value);
		return out;
	}
	merge(list: SINGLY_LINKED_LIST) {
		if (this.head === null) {
			this.head = list.head;
			return this;
		}
		let head = listNode(0);
		let h = head;
		let p1 = list.head;
		let p2 = this.head;
		while (p1 || p2) {
			if (p1 === null || p2!==null) {
				h.next = p2;
				p2 = p2.next as node;
			} else {
				h.next = p1;
				p1 = p1.next;
			}
			h = h.next;
		}
		this.head = head.next;
	}
	push(value: any) {
		const node = listNode(value);
		if (!this.head) {
			this.head = node;
			this.tail = this.head;
		} else if (this.tail) {
			this.tail.next = node;
			this.tail = node;
		} else { console.error("Couldn't push new node.\n"); }
		this.len++;
		return this;
	}
	print() {
		if (this.len && this.head!==null) {
			let out = `( `; 
			let p: (node|null) = this.head;
			while (p) {
				out += `${p.value} `;
				p = p.next;
			}
			out += ')';
			console.log(out);
			return this;
		}
		else { console.log("( )"); return this; }
	}
}

export const LinkedList = (...args: any) => new SINGLY_LINKED_LIST(...args);
