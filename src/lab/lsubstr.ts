class QueueNode {
	constructor(val) {
		this.data = val;
		this.next = null;
	}
}
class Queue {
	constructor() {
		this.first = null;
		this.last = null;
		this.length = 0;
	}
	enqueue(val) {
		const q = new QueueNode(val);
		if (this.first === null) {
			this.first = q;
			this.last = this.first;
		} else {
			let t = this.last;
			this.last.next = q;
			this.last = q;
		}
		this.length += 1;
		return this;
	}
	dequeue() {
		if (this.first !== null) {
			let p = this.first.data;
			this.first = this.first.next;
			this.length--;
			return p;
		}
	}
	print() {
		console.log(this);
	}
	toArray() {
		let out = [];
		let p = this.first;
		while (p !== null) {
			out.push(p.data);
			p = p.next;
		}
		return out;
	}
}

// const x = new Queue();
// x.enqueue(5).enqueue(7).enqueue(8);
// console.log(x.toArray());
// x.dequeue();
// console.log(x.toArray());

// class NODE {
//   constructor(val) {
//     this.val = val;
//     this.left = null;
//     this.right = null;
//   }
// }

// const a = new NODE("a");
// const b = new NODE("b");
// const c = new NODE("c");
// const d = new NODE("d");
// const e = new NODE("e");
// const f = new NODE("f");

// a.left = b;
// a.right = c;
// b.left = d;
// b.right = e;
// c.right = f;

// function leafList(root) {
// 	let out = [];
// 	const f = (node) => {
// 		if (node === null) { return; }
// 		if (node.left === null && node.right === null) { out.push(node.val); }
// 		f(node.left);
// 		f(node.right);
// 	}
// 	f(root);
// 	return out;
// }

// console.log(leafList(a));


// const out = [12, 24, 10, 24];

// function breakingRecords(scores: number[]) {
// 	const L = scores.length;
// 	let max = scores[0];
// 	let min = scores[0];
// 	let maxchangecount = 0;
// 	let minchangecount = 0;
// 	for (let i = 1; i < L; i++) {
// 		if (scores[i] < min) {
// 			min = scores[i];
// 			minchangecount++;
// 		}
// 		if (scores[i] > max) {
// 			max = scores[i];
// 			maxchangecount++;
// 		}
// 	}
// 	return [minchangecount,maxchangecount];
// }
// console.log(breakingRecords(out))



// function dft(graph,source){
// 	console.log(source);
// 	for (let neighbor of graph[source]) {
// 		dft(graph, neighbor);
// 	}
// }

function bft(graph, source) {
	const queue = [source];
	while (queue.length > 0) {
		const current = queue.shift();
		console.log(current);
		for (let neighbor of graph[current]) {
			queue.push(neighbor);
		}
	}
}
const graph = {
	a: ["b", "c"],
	b: ["d"],
	c: ["e"],
	d: ["f"],
	e: [],
	f: [],
}
console.log(bft(graph, "a"));

// const graph = {
//   f: ['g', 'i'],
//   g: ['h'],
//   h: [],
//   i: ['g', 'k'],
//   j: ['i'],
//   k: []
// };

// function hasPath(graph,src,dst) {
// 	let result = false;
// 	const f = (s) => {
// 		if (s===dst) { result = true }
// 		for (let n of graph[s]) { f(n) }
// 	}
// 	f(src);
// 	return result;
// }

// function hasPath(graph,src,dst) {
// 	let result = false;
// 	let queue = [src];
// 	while (queue.length > 0) {
// 		const current = queue.shift();
// 		if (current === dst) {
// 			result = true;
// 		}
// 		for (let neighbor of graph[current]) {
// 			queue.push(neighbor);
// 		}
// 	}
// 	return result;
// }


// console.log(hasPath(graph,'f','j'));