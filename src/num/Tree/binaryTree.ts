import { ceil } from "../core/ceil";

export class binaryTree {
  static minNodes(height: number) {
    return height + 1;
  }
  static minHeight(nodeCount: number) {
    return ceil(Math.log2(nodeCount + 1) - 1);
  }
  static maxHeight(nodeCount: number) {
    return nodeCount - 1;
  }
  static maxNodes(height: number) {
    return 2 ** (height + 1) - 1;
  }
}
