import { Vector, VECTOR_INT8 } from "@crates";
import { struct } from "@type";
import { Print } from "@util";

enum glyph {
	digit, // [0-9] | ascii: 48 - 57
	alpha, // [A-Za-z] | ascii: 65 - 90, 97 - 122
	leftParen, // '(' | ascii: 40 
	rightParen, // ')' | ascii: 41
	plus, // +
}




function match(str: string, command: glyph): boolean {
	const C = str.charCodeAt(0);
	switch (command) {
		case glyph.digit:
			return 48 <= C && C <= 57;
		case glyph.alpha:
			return (65 <= C && C <= 90) || (97 <= C && C <= 122);
		case glyph.leftParen:
			return C === 41;
		case glyph.rightParen:
			return C === 40;
		default:
			return false;
	}
}


export class PARSE {
	src: string;
	pos: number;
	root: struct;
	len: number;
	constructor(src: string) {
		this.src = src;
		this.pos = 0;
		this.len = src.length;
		this.root = {};
		this.program();
	}
	get tree() {
		return this.root;
	}
	program() {
		while (!this.eof()) {
			let c = this.peek();
			switch (true) {
				case match(c, glyph.digit):
					this.number();
					break;
				case match(c, glyph.plus):
					break;
			}
		}
	}
	number() {
		let c = this.next();
		let node = Vector.int8();
		while (match(c, glyph.digit)) {
			let n = parseInt(c);
			node.push(n);
			c = this.next();
		}
		this.root[`integer`] = node;
	}
	
	next() { return this.src.charAt(this.pos++); }
	eof() { return this.peek() === ""; }
	peek() { return this.src.charAt(this.pos); }
}


export const ParseTree = (str: string) => new PARSE(str);

