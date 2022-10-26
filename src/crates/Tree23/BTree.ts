class BTreeNode {
	private leaf: boolean;
	private Keys: any[];
	private Children: BTreeNode[];
	private Parent: BTreeNode | null;
	private Tree: null | B_TREE;
	constructor(leaf: boolean = true) {
		this.Keys = [];
		this.Children = [];
		this.leaf = leaf;
		this.Tree = null;
		this.Parent = null;
	}
	get parent() { return this.Parent; }
	get keyCount() { return this.Keys.length; }
	enkey(key: number) {
		let k = 0;
		while (k < this.keyCount && this.Keys[k] < key) {
			k++;
		}
		this.Keys.splice(k, 0, key);
	}
	get children() { return this.Children; }
	get keys() { return this.Keys; }
	get isLeaf() { return this.leaf; }
	set isLeaf(b: boolean) { this.leaf = b; }
	get tree() { return this.Tree; }
	set tree(t: B_TREE | null) { this.Tree = t; }
	dekey(key: number) {
		if (key >= this.keyCount) {
			return null;
		}
		return this.Keys.splice(key, 1)[0];
	}
	enchild(node: BTreeNode, key: number) {
		this.children.splice(key, 0, node);
		node.Parent = this;
	}
	dechild(key: number) {
		return this.children.splice(key, 1)[0];
	}
}

class B_TREE {
	order: number;
	root: BTreeNode;
	constructor(order: number) {
		this.order = order;
		this.root = new BTreeNode(true);
	}
	private insert(node: BTreeNode, key: any) {
		if (node.isLeaf) {
			node.enkey(key);
			return;
		}
		let temp = node.keyCount;
		while (temp >= 1 && key < node.keys[temp - 1]) {
			temp -= 1;
		}
		if (node.children[temp].keyCount === 2 * this.order - 1) {
			this.split(node.children[temp], node, temp + 1);
			if (key > node.keys[temp]) {
				temp = temp + 1;
			}
		}
		this.insert(node.children[temp], key);
	}
	private split(child: BTreeNode, parent: BTreeNode, key: number) {
		const neonode = new BTreeNode(child.isLeaf);
		neonode.tree = this.root.tree;
		for (let k = 1; k < this.order; k++) {
			neonode.enkey(child.dekey(this.order));
		}
		if (!child.isLeaf) {
			for (let k = 1; k <= this.order; k++) {
				neonode.enchild(child.dechild(this.order), k - 1);
			}
		}
		parent.enchild(neonode, key);
		parent.enkey(neonode.dekey(this.order - 1));
		parent.isLeaf = false;
	}
	push(key: number) {
		const actual = this.root;
		if (actual.keyCount === 2 * this.order - 1) {
			const temp = new BTreeNode(false);
			temp.tree = this;
			this.root = temp;
			temp.enchild(actual, 0);
			this.split(actual, temp, 1);
			this.insert(temp, key);
		} else {
			this.insert(actual, key);
		}
	}
}

export const BTree = (order = 2) => new B_TREE(order);

const bt = BTree(3);
bt.push(30)
bt.push(40)
bt.push(50)
bt.push(60)
bt.push(70)
bt.push(80)
bt.push(90)
bt.push(100)
bt.push(110)
console.log(bt)
