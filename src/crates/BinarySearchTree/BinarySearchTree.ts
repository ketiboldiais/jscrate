import { BinaryTree } from "../BinaryTree/BinaryTree";
import { binode } from "@type";

function node(value: any): binode {
  return { value, left: null, right: null };
}

export class BST extends BinaryTree {
  root: null | binode;
  constructor(...data: any[]) {
    super(...data);
    this.root = null;
  }
  push(value: any) {
    if (this.root === null) {
      const newNode = node(value);
      this.root = newNode;
      return this;
    } else {
      let p = this.root;
      let r = null;
      while (p !== null) {
        r = p;
        if (value < p.value && p !== null) {
          p = p.left as binode;
        } else if (value > p.value && p !== null) {
          p = p.right as binode;
        } else {
          return this;
        }
      }
      p = node(value);
      if (value < (r as binode).value) {
        (r as binode).left = p;
      } else {
        (r as binode).right = p;
      }
      return this;
    }
  }
  nodeHeight(n: binode | null): number {
    let h = 0;
    if (n === null) return h;
    else {
      const f = (ptr: binode | null) => {
        if (ptr === null) return 0;
        let x: number = f(ptr.left);
        let y: number = f(ptr.right);
        return x > y ? x + 1 : y + 1;
      };
      return f(n);
    }
  }
  delete(value: any) {
    if (this.root === null) return null;
    else {
      let q: binode | null;
      const del = (node: binode | null, key: any) => {
        if (node === null) return null;
        if (node.left === null && node.right === null) {
          node = null;
          return null;
        }
        if (key < node.value) node.left = del(node.left, key);
        else if (key > node.value) node.right = del(node.right, key);
        else {
          if (this.nodeHeight(node.left) > this.nodeHeight(node.right)) {
            q = this.inorderPrec(node.left);
            node.value = q?.value;
            node.left = del(node.left, q?.value);
          } else {
            q = this.inorderSucc(node.right);
            node.value = q?.value;
            node.right = del(node.right, q?.value);
          }
        }
        return node;
      };
      del(this.root, value);
      return this;
    }
  }
}

export const binarySearchTree = (...arg: any) => new BST(...arg);
