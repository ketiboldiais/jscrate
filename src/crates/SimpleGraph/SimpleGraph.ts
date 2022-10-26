import { GRAPH } from "./Graph";
import { edgeset } from "@type";

export class SIMPLE_GRAPH extends GRAPH {
  constructor(...edges: edgeset) {
    super();
    if (edges.length !== 0) {
      const L = edges.length;
      for (let i = 0; i < L; i++) {
        let elm = edges[i];
        if (Array.isArray(elm)) {
          !this.vertices.has(elm[0]) && this.addVertex(elm[0]);
          !this.vertices.has(elm[1]) && this.addVertex(elm[1]);
        } else {
          !this.vertices.has(elm) && this.addVertex(elm);
          !this.vertices.has(elm) && this.addVertex(elm);
        }
        this.addEdge(elm[0], elm[1]);
      }
      return this;
    }
  }
  /**
   * @description
   * Adds an edge to the graph
   */
  addEdge(v1: any, v2: any) {
    this.vertices.get(v1)?.set(v2);
    this.vertices.get(v2)?.set(v1);
    return this;
  }
}

export const Graph = (...edges: edgeset) => new SIMPLE_GRAPH(...edges);
