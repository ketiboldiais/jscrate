import {
  TRIE,
  CIRCULAR_LIST,
  DoublyLinkedList,
  SIMPLE_GRAPH,
  STACK,
  WEIGHTED_SIMPLE_GRAPH,
  ABSTRACT_VECTOR,
  SET,
  SORTED_SINGLY_LINKED_LIST,
} from "@crates";
import { INT, PARSE } from "@num";

// import { RELATION, SET, } from "@crates";
import { rowCount, colCount } from "@num";

function TreePrint(d: any) {
  function link(key: any, last: any) {
    let str = last ? "└" : "├";
    (key && (str += "─ ")) || (str += "──┐");
    return str;
  }

  function getKeys(obj: { [key: string]: any }) {
    var keys = [];
    for (const branch in obj) {
      if (!obj.hasOwnProperty(branch)) {
        continue;
      }
      keys.push(branch);
    }
    return keys;
  }

  function treeGen(
    key: string,
    root: any,
    last: boolean,
    lastStates: any[],
    showValues: boolean,
    callback: { (line: any): void; (arg0: string): void }
  ) {
    let line = "",
      index = 0,
      lastKey,
      lastStatesCopy = lastStates.slice(0);

    if (lastStatesCopy.push([root, last]) && 0 < lastStates.length) {
      lastStates.forEach((lastState: any[], idx: number) => {
        if (idx > 0) {
          line += (lastState[1] ? " " : "│") + "  ";
        }
      });
      line += link(key, last) + key;
      showValues &&
        (typeof root !== "object" || root === null || root instanceof Date) &&
        (line += ": " + root);
      if (root instanceof Set) {
        const res = Array.from(root);
        line += ": {";
        for (let i = 0; i < res.length; i++) {
          if (i !== 0) {
            line += ", ";
          }
          line += res[i];
        }
        line += "}";
      }
      callback(line);
    }
    if (typeof root === "object") {
      const keys = getKeys(root);
      keys.forEach((branch) => {
        lastKey = ++index === keys.length;
        treeGen(
          branch,
          root[branch],
          lastKey,
          lastStatesCopy,
          showValues,
          callback
        );
      });
    }
  }
  var tree = "";
  treeGen(".", d, false, [], true, (line: string) => (tree += line + "\n"));
  return tree;
}

export function Log(d: any) {
  console.log(d);
  return 1;
}

export function Print(
  d: any,
  option: "default" | "tree" | "list" | "array" = "default"
) {
  if (d[0] && Array.isArray(d[0])) {
    if (d.length === 0) {
      console.log(`matrix[ empty ]`);
      return 1;
    }
    const R = rowCount(d);
    const C = colCount(d);
    let str = "";
    for (let i = 0; i < R; i++) {
      i < R && (str += "\n");
      for (let j = 0; j < C; j++) {
        j === 0 && (str += "[ ");
        str += d[i][j];
        j < C && j !== C - 1 && (str += "    ");
        j === C - 1 && (str += "  ]");
      }
    }
    console.log(str);
    return 1;
  }
  if (d instanceof SET) {
    let str = "{ ";
    const A = d.arrayed();
    const L = A.length;
    for (let i = 0; i < L; ++i) {
      str += `${A[i]} `;
    }
    str += "}";
    console.log(str);
    return 1;
  }
  if (d instanceof STACK) {
    let str = "";
    const A = d.arrayed();
    const L = A.length - 1;
    for (let i = L; i >= 0; --i) {
      str += `[`;
      str += ` `.padStart(2, " ");
      str += `${A[i]}`.padEnd(10, " ");
      str += `]`.padEnd(2, " ");
      i === L && (str += `<-- top`);
      str += "\n";
    }
    console.log(str);
    return 1;
  }
  if (d instanceof DoublyLinkedList) {
    let str = "<--";
    const arr = d.arrayed();
    const L = arr.length;
    for (let i = 0; i < L; i++) {
      if (i !== 0) str += "=";
      str += `[${arr[i]}]`;
      if (i !== L - 1) str += "=";
    }
    str += "--> null";
    console.log(str);
    return 1;
  }
  if (d instanceof TRIE) {
    let out = d.words();
    let str = "";
    for (let i = 0; i < out.length; i++) {
      str += `word: ${out[i]}\n`;
    }
    console.log(str);
    return 1;
  }
  if (Array.isArray(d)) {
    let out = "[";
    for (let i = 0; i < d.length; i++) {
      i !== 0 && (out += ", ");
      out += d[i];
    }
    out += "]";
    console.log(out);
    return 1;
  }
  if (d instanceof INT) {
    let str = "";
    let arr = d.val;
    for (let i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    console.log(str);
    return 1;
  }
  if (d instanceof ABSTRACT_VECTOR) {
    let arr = d.arrayed();
    let out = "[";
    for (let i = 0; i < arr.length; i++) {
      i !== 0 && (out += ", ");
      out += arr[i];
    }
    out += "]";
    console.log(out);
    return 1;
  }
  if (d instanceof PARSE) {
    console.log(TreePrint(d));
    return 1;
  }
  if (d instanceof TRIE) {
    console.log(TreePrint(d));
    return 1;
  }
  if (d instanceof CIRCULAR_LIST) {
    const arr = d.arrayed();
    const L = arr.length;
    let str = "[";
    for (let i = 0; i < L; i++) {
      i !== 0 && (str += ", ");
      str += `${arr[i]}`;
    }
    str += "]";
    console.log(str);
    return 1;
  }
  if (d instanceof SIMPLE_GRAPH || d instanceof WEIGHTED_SIMPLE_GRAPH) {
    console.log(TreePrint(d.struct()));
    return 1;
  }
  if (d instanceof SORTED_SINGLY_LINKED_LIST) {
    let str = "";
    const arr = d.arrayed();
    const L = arr.length;
    for (let i = 0; i < L; i++) {
      str += arr[i] + " ⟹ ";
    }
    str += "null";
    console.log(str);
    return 1;
  }

  switch (option) {
    case "tree":
      console.log(TreePrint(d));
      break;
    case "list": {
      let str = "";
      const arr = d.arrayed();
      const L = arr.length;
      for (let i = 0; i < L; i++) {
        str += arr[i] + " ⟹ ";
      }
      str += "null";
      console.log(str);
      break;
    }
    default:
      console.log(JSON.stringify(d, null, 2));
      break;
  }
}
