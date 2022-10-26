// import { RELATION, SET } from "@crates";

// native javascript collections
export type anyset = Set<any>;
export type anyarray = any[];

export type numbers = number[];
export type numSet = "R" | "R+" | "R-" | "Z" | "Z+" | "Z-" | "N" | "C";

export type tuple = [number, number];
export type interval = number[];
export type orderedPair = [any, any];
export type relation = Set<orderedPair>;

export type matrix = number[][];
export type edge = [any, any];
export type edgeset = any[];

export type vertex = { [key: string]: Map<any, any> };
export type angleUnit = "rad" | "deg";
export type struct = { [key: string]: any };
export type binary = 0 | 1;
export type generics = any[];
export type base = number | string | any;

// typed array types
export enum vect {
  int8,
  uint8,
  uint8clamped,
  int16,
  uint16,
  int32,
  uint32,
  float32,
  float64,
  bigint64,
  biguint64,
}

// node types
export type node = { value: any; next: null | node };
export type wgnode = { node: any; weight: number };
export type dnode = { value: any; next: null | dnode; prev: null | dnode };
export type PriorityNode = {
  value: any;
  priority: number;
};
export type binode = {
  value: any;
  left: null | binode;
  right: null | binode;
};
export type avlnode = {
  value: any;
  left: null | avlnode;
  right: null | avlnode;
  height: number;
};
export type trienode = { char: string; kids: any[]; eow: boolean };
export type treeNode = binode | avlnode;

export type comp = "<" | ">" | ((a: any, b: any) => boolean);
export type BinarySearchTree = {
  root: null | binode;
};

// export type collection = SET | RELATION;
