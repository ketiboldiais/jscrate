import { binode, treeNode } from "@type";
import { Print } from "@util";
import { queue } from "../Queue/Queue";

function node(value: any): binode {
  return { value, left: null, right: null };
}

export class BinaryTree {
  root: treeNode | null;
  constructor(...data: any[]) {
    this.root = null;
    if (data) {
      const L = data.length;
      for (let i = 0; i < L; i++) {
        this.push(data[i]);
      }
    }
  }
  protected levelOrder(f: Function) {
    function trav(node: binode) {
      let p = node;
      const _queue = queue(p);
      while (!_queue.isEmpty()) {
        p = _queue.dequeue();
        f(p);
        if (p.left) {
          _queue.enqueue(p.left);
        }
        if (p.right) {
          _queue.enqueue(p.right);
        }
      }
    }
    this.root && trav(this.root);
  }
  protected postorder(f: Function) {
    function trav(this: any, node: binode) {
      node.left && trav(node.left);
      node.right && trav(node.right);
      f.call(this, node);
    }
    this.root && trav(this.root);
  }
  protected preorder(f: Function) {
    function trav(this: any, node: binode) {
      f.call(this, node);
      node.left && trav(node.left);
      node.right && trav(node.right);
    }
    this.root && trav(this.root);
  }
  protected inorder(f: Function) {
    function trav(this: any, node: binode) {
      node.left && trav(node.left);
      f.call(this, node);
      node.right && trav(node.right);
    }
    this.root && trav(this.root);
  }
  protected inorderPrec(p: binode | null): binode | null {
    while (p && p.right !== null) {
      p = p.right;
    }
    return p;
  }
  protected inorderSucc(p: binode | null): binode | null {
    while (p && p.left !== null) {
      p = p.left;
    }
    return p;
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
  arrayed(order?: "pre" | "in" | "post" | "level") {
    let out: any[] = [];
    if (this.root === null) return out;
    order = order || "in";
    switch (order) {
      case "pre": {
        this.preorder((n: binode) => out.push(n.value));
        break;
      }
      case "in": {
        this.inorder((n: binode) => out.push(n.value));
        break;
      }
      case "post": {
        this.postorder((n: binode) => out.push(n.value));
        break;
      }
      case "level": {
        this.levelOrder((n: binode) => out.push(n.value));
        break;
      }
      default: {
        console.error(
          `Call BinarySearchTree.arrayed() failed. ${order} is not a valid argument. Valid options are: 'preorder', 'inorder', and 'postorder'.`
        );
        return out;
      }
    }
    return out;
  }
  size() {
    if (this.root === null) return 0;
    else {
      const trav = (node: binode) => {
        let x = 0;
        let y = 0;
        node && (x = node.left ? trav(node.left) : 0);
        node && (y = node.right ? trav(node.right) : 0);
        return x + y + 1;
      };
      return trav(this.root);
    }
  }
  minDepth() {
    if (this.root === null) return -1;
    else {
      let leftDepth = 0;
      let rightDepth = 0;
      function trav(node: binode) {
        if (node === null) return -1;
        else {
          leftDepth = node.left ? trav(node.left) : 0;
          rightDepth = node.right ? trav(node.right) : 0;
          return leftDepth < rightDepth ? leftDepth + 1 : rightDepth + 1;
        }
      }
      return trav(this.root);
    }
  }
  maxDepth() {
    if (this.root === null) return -1;
    else {
      let leftDepth = 0;
      let rightDepth = 0;
      const trav = (node: binode) => {
        if (node === null) return -1;
        else {
          leftDepth = node.left ? trav(node.left) : 0;
          rightDepth = node.right ? trav(node.right) : 0;
          return leftDepth > rightDepth ? leftDepth + 1 : rightDepth + 1;
        }
      };
      return trav(this.root);
    }
  }
  height() {
    if (this.root === null) return -1;
    let leftHeight = 0;
    let rightHeight = 0;
    function trav(node: binode) {
      if (node === null) return -1;
      else {
        leftHeight = node.left ? trav(node.left) : 0;
        rightHeight = node.right ? trav(node.right) : 0;
        return leftHeight > rightHeight ? leftHeight + 1 : rightHeight + 1;
      }
    }
    return trav(this.root);
  }
  isStrict() {
    return this.deg1Count() === 0;
  }
  leafCount() {
    let count = 0;
    this.inorder(
      (node: binode) => node.left === null && node.right === null && count++
    );
    return count;
  }
  deg2Count() {
    return this.leafCount() - 1;
  }
  deg1Count() {
    return this.size() - (this.leafCount() + this.deg2Count());
  }
  nonleafCount() {
    return this.size() - this.leafCount();
  }
  contains(val: any) {
    const f = (node: binode): boolean => {
      if (node.value === val) return true;
      else if (node === null) return false;
      else if (node.value < val && node.right) return f(node.right);
      else if (node.value > val && node.left) return f(node.left);
      else return false;
    };
    return f(this.root as binode);
  }
  print() {
    Print(this.root, "tree");
  }
}
