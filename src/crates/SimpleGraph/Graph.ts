import { Queue, Stack } from "@crates";
import { struct } from "@type";

function map() {
  return new Map();
}

export abstract class GRAPH {
  vertices: Map<any, any>;
  constructor() {
    this.vertices = map();
  }
  /**
   * @param start
   * A vertex in the graph
   *
   * @description
   * Iterative breadth-first-traversal of the graph
   */
  IBFS(start: any) {
    let result: any = [];
    if (!this.vertices.has(start)) return result;
    let queue = Queue(start);
    let visited = map();
    visited.set(start, true);
    let vertex: any;
    while (queue.nonempty()) {
      vertex = queue.dequeue();
      result.push(vertex);
      for (const k of this.vertices.keys()) {
        !visited.has(k) && 1 && visited.set(k, true) && 1 && queue.enqueue(k);
      }
    }
    return result;
  }
  /**
   * @param start - a vertex in the graph
   *
   * @description
   * Iterative depth-first-traversal of the graph
   *
   * IDFS(start):
   *   let S be a stack
   *   S.push(start)
   *   while (S is not empty):
   *     vertex = S.pop();
   *     if (vertex is not visited):
   *       visit vertex (add to result list)
   *       label vertex as visited
   *       for each of vertex's neighbors N:
   *         do S.push(N)
   */
  IDFS(start: any) {
    let result: any = [];
    let visited = map();
    if (!this.vertices.has(start)) return result;
    let stack = Stack(start);
    let vertex: any;
    visited.set(start, true);
    while (stack.nonempty()) {
      vertex = stack.pop();
      result.push(vertex);
      for (const k of this.vertices.keys()) {
        !visited.has(k) && 1 && visited.set(k, true) && 1 && stack.push(k);
      }
    }
    return result;
  }
  /**
   * @description
   * Recursive depth-first-traversal of the graph
   *
   * RDFS(v):
   *   v does not exist => return
   *   add vertex to results list
   *   mark vertex as visited
   *   for each neighbor vi in v's neighbors:
   *     - if vertex is not visited => DFS(vi)
   */
  RDFS(start: any) {
    let result: any = [];
    if (!this.vertices.has(start)) return result;
    let visited = map();
    let adjacencyList = this.vertices;

    (function dfs(v): any {
      visited.set(v, true);
      result.push(v);
      for (const [k, _v] of adjacencyList.get(v)) {
        !visited.has(k) && 1 && dfs(k);
      }
    })(start);

    return result;
  }
  /**
   * @description
   * Adds a vertex to the graph
   */
  addVertex(vertex: any) {
    this.vertices.set(vertex, map());
    return this;
  }
  /**
   * @description
   * Removes an edge from the graph
   */
  popEdge(v1: any, v2: any) {
    this.vertices.get(v1)?.delete(v2);
    this.vertices.get(v2)?.delete(v1);
    return this;
  }
  /**
   * @description
   * Removes a vertex from the graph
   */
  popVertex(v1: any) {
    for (const [key, _value] of this.vertices) {
      if (this.vertices.get(key).has(v1)) {
        this.vertices.get(key).delete(v1);
      }
    }
    this.vertices.delete(v1);
    return this;
  }
  /**
   * @description
   * Returns the graph as object consisting
   * of the vertices as properties, with their
   * connected vertices in an array
   */
  struct() {
    let obj: struct = {};
    for (const [key, value] of this.vertices) {
      let arr: any = [];
      value.forEach((_v: any, k: any) => {
        arr.push(k);
      });
      obj[key] = arr;
    }
    return obj;
  }
  adjacent(v1: any, v2: any) {
    return this.vertices?.get(v1)?.has(v2) && this.vertices?.get(v2)?.has(v1);
  }
  independent(v1: any, v2: any) {
    return !this.adjacent(v1, v2);
  }
  isolated(v1: any) {
    if (!this.vertices.has(v1)) return null;
    return this.vertices.get(v1).size === 0;
  }
  degree(v1: any) {
    return this.vertices?.get(v1).size;
  }
  edgeCount() {
    let sum = 0;
    for (const k of this.vertices.keys()) {
      sum += this.degree(k);
    }
    return sum / 2;
  }
  complete() {
    const n = this.vertexCount();
    const n_1 = n - 1;
    const nn_1 = n * n_1;
    const E = this.edgeCount() * 2;
    return nn_1 === E;
  }
  vertexCount() {
    return this.vertices.size;
  }
  neighborhood(v1: any) {
    let out: any[] = [];
    if (!this.vertices.has(v1)) return out;
    for (const k of this.vertices?.get(v1).keys()) {
      out.push(k);
    }
    return out;
  }
}
