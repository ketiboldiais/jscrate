import { BinaryTree } from "../BinaryTree/BinaryTree";
import { avlnode } from "@type";

function node(value: any, height = 1): avlnode {
  return { value, left: null, right: null, height };
}
export class AVL extends BinaryTree {
  root: null | avlnode;
  constructor(...array: any[]) {
    super(array);
    this.root = null;
    if (array) {
      const L = array.length;
      for (let i = 0; i < L; i++) {
        this.push(array[i]);
      }
    }
  }
  private nodeHeight(n: avlnode | null = null): number {
    if (n === null) return 0;
    const hL = (n && n.left && n.left.height) || 0;
    const hR = (n && n.right && n.right.height) || 0;
    return (hL > hR && hL + 1) || hR + 1;
  }
  // rotate left
  private RotateL(p: avlnode): avlnode | null {
    if (p.left === null) return null;
    const pl: avlnode = p.left;
    const plr = pl.right;
    pl.right = p;
    p.left = plr;
    p.height = this.nodeHeight(p);
    pl.height = this.nodeHeight(pl);
    if (p === this.root) this.root = pl;
    return pl;
  }
  // rotate right
  private RotateR(p: avlnode): avlnode | null {
    if (p.left === null) return null;
    const pl: avlnode = p.left;
    if (pl === null || pl.right === null) return null;
    const plr = pl.right;
    pl.right = (plr && plr.left) || null;
    p.left = (plr && plr.right) || null;
    plr.left = pl;
    plr.right = p;
    pl.height = this.nodeHeight(pl);
    p.height = this.nodeHeight(p);
    plr.height = this.nodeHeight(plr);
    if (p === this.root) this.root = pl;
    return plr;
  }
  // rotate left-right
  private RotateLR(p: avlnode): avlnode | null {
    if (p.left === null) return null;
    p.left = this.RotateL(p.left);
    return this.RotateR(p);
  }
  // rotate right-left
  private RotateRL(p: avlnode): avlnode | null {
    if (p.right === null) return null;
    p.right = this.RotateR(p.right);
    return this.RotateL(p);
  }
  private bf(p: avlnode | null) {
    if (p === null) return 0;
    const hL = (p.left && p.left.height) || 0;
    const hR = (p.right && p.right.height) || 0;
    return hL - hR;
  }
  push(value: any) {
    const insert = (root: avlnode | null, val: any): avlnode | null => {
      if (root === null) return node(val);
      else if (val < root.value) root.left = insert(root.left, val);
      else if (val > root.value) root.right = insert(root.right, val);
      root.height = this.nodeHeight(root);
      return (
        (this.bf(root) === 2 &&
          (this.bf(root.left) === 1 || this.bf(root.left) === 0) &&
          this.RotateL(root)) ||
        (this.bf(root) === 2 &&
          (this.bf(root.right) === 1 || this.bf(root.right) === 0) &&
          this.RotateR(root)) ||
        (this.bf(root) === -2 &&
          this.bf(root.left) === 1 &&
          this.RotateLR(root)) ||
        (this.bf(root) === 2 &&
          this.bf(root.right) === -1 &&
          this.RotateRL(root)) ||
        root
      );
    };
    let ptr = this.root;
    this.root = insert(ptr, value);
    return this;
  }
}

export const AvlTree = (...arg: any[]) => new AVL(...arg);
