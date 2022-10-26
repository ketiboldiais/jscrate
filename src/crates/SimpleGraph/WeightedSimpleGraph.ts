/**
 *
 * @file
 *
 * This is the weighted simple graph module for jsCrate.
 * The weighted simple graph is fairly special:
 *
 * 1. It has no loops.
 * 2. It has no directed edges.
 * 3. It has no multiedges.
 *
 * To begin, we import the `GRAPH` module. This is an abstract class
 * that the weighted simple graph class inherits from.
 */

import { GRAPH } from "./Graph";

/**
 * Next, we import some useful types. The `edgeset`, `struct`,
 * and `wgnode` (weighted graph node) types are all used as helpers.
 */
import { edgeset, struct, wgnode } from "@type";

/**
 * This is a function that returns a weighted graph node.
 */
import { nodewg } from "@aux";

/**
 * This is a priority queue. It's specifically imported
 * for use on Dijkstra's Algorithm (a fairly needy one, that).
 */
import { PriorityQueue } from "@crates";

/**
 * These are constants.
 */
import { ct } from "@num";

/**
 * The minimum spanning tree also needs a `Set`.
 */
import { Set } from "@crates";

/**
 * And a mergeSort function.
 */
import { mergeSort } from "@sort";

/**
 * We can now begin defining our class.
 */

export class WEIGHTED_SIMPLE_GRAPH extends GRAPH {
  /**
   * First, the constructor.
   */
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
        this.addEdge(elm[0], elm[1], elm[2]);
      }
      return this;
    }
  }
  /**
   * @params start
   * The starting vertex of the path
   *
   * @params end
   * The ending vertex of the path
   *
   * @description
   * Finds the shortest path between the two
   * argument vertices
   *
   * Procedure:
   *
   * 1. Upon receiving two nodes, visit
   *    the node with the smallest known distance
   *    first.
   *
   * 2. Upon visiting that node, look at each of
   *    its neighbors:
   *
   *   a. For each neighboring node, calculate the
   *      distance by summing the total edges that
   *      lead to the node, starting from the node.
   *   b. Branch:
   *      (1) If the new total distance is less
   *          than the previous total distance,
   *          update the new shorter distance for
   *          that node.
   *      (2) Otherwise, leave the distance as is.
   *
   * Example: shortestPath(A,E)
   * The graph visually:
   *
   *
   *       A────4────B
   *       │         │3
   *      2│  2   3  │
   *       C────D────E
   *       │    │    │
   *      4│    │1   │1
   *       └────F────┘
   *
   *
   * We start by initializing the shortest distances from A. We don't
   * know what these distances are, so we assume they're the largest
   * possible value. But, we know that the shortest distance from A to A
   * is zero, so that entry gets zero:
   *
   *        | Vertex | Shortest Distance from A |
   *        | A      | 0                        |
   *        | B      | max_int                  |
   *        | C      | max_int                  |
   *        | D      | max_int                  |
   *        | E      | max_int                  |
   *        | F      | max_int                  |
   *
   * Separately, we have an array that stores the visited nodes:
   *
   * visited = []
   *
   * We just visited A, so we store A in the visited array:
   *
   * visited = [A]
   *
   * We also maintain a table that stores the history of our path,
   * initially all null:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | null  |
   *  | C      | null  |
   *  | D      | null  |
   *  | E      | null  |
   *  | F      | null  |
   *
   * We started with A, so we look at each of its neighbors. That's
   * C and B. Because we're just starting, we can pick either. We
   * go B. We see that the distance from A to B is 4 (based on the
   * edge value's weight property).
   *
   * 4 < max_int, so we update the table:
   *
   *        | Vertex | Shortest Distance from A |
   *        | A      | 0                        |
   *        | B      | 4                        |
   *        | C      | max_int                  |
   *        | D      | max_int                  |
   *        | E      | max_int                  |
   *        | F      | max_int                  |
   *
   * We then update B in the history table, and set it to A:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | null  |
   *  | D      | null  |
   *  | E      | null  |
   *  | F      | null  |
   *
   * As is, this says that the way we go to B is through A.
   *
   * That took care of B. Now we look at A to C (A's other
   * neighbor). This edge has the weight 2. So, we update the distance
   * table:
   *
   *       | Vertex | Shortest Distance from A |
   *       | A      | 0                        |
   *       | B      | 4                        |
   *       | C      | 2                        |
   *       | D      | max_int                  |
   *       | E      | max_int                  |
   *       | F      | max_int                  |
   *
   * Again, we update the history table:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | A     |
   *  | D      | null  |
   *  | E      | null  |
   *  | F      | null  |
   *
   * After handling C, we've exhausted all of A's neighbors.
   * So, we turn to our distance table, and look at which path is shortest
   * so far. In this case, it's C.
   *
   * So, we visit C, and update our visited array:
   *
   * visited = [A,C]
   *
   * C has three neighbors: C to D, C to F, and C to A.
   * We've already visited A, so we're just looking at
   * C to D and C to F.
   *
   * We want to find which of the two is shortest: A to D or A to F.
   * We do that by summing the distances. This is where we use the
   * history table. We go back and ask, how did we get to C? By going
   * through A. What's the distance from A to C? It's 2.
   * So, we have:
   *
   * AC = 2
   * AD = AC + CD = 2 + 2 = 4
   *
   * We use this sum to update the D vertex entry in the distance table:
   *
   *       | Vertex | Shortest Distance from A |
   *       | A      | 0                        |
   *       | B      | 4                        |
   *       | C      | 2                        |
   *       | D      | 4                        |
   *       | E      | max_int                  |
   *       | F      | max_int                  |
   *
   * Likewise, we update the history table:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | A     |
   *  | D      | C     |
   *  | E      | null  |
   *  | F      | null  |
   *
   * C has another neighbor, C to F. We perform the same process:
   *
   * AC = 2
   * AF = AC + CD = 2 + 4 = 6
   *
   * We update the distance table for F:
   *
   *      | Vertex | Shortest Distance from A |
   *      | A      | 0                        |
   *      | B      | 4                        |
   *      | C      | 2                        |
   *      | D      | 4                        |
   *      | E      | max_int                  |
   *      | F      | 6                        |
   *
   * And we update the history table:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | A     |
   *  | D      | C     |
   *  | E      | null  |
   *  | F      | C     |
   *
   * Now we go back to the distance table. Which entry has the shortest
   * distance? It's between B and D. Since they're equal, we can just choose
   * B. So, we visit B:
   *
   * visited = [A,C,B]
   *
   * B only has one neighbor that we haven't visited, which is E. So,
   * we compute the distance:
   *
   * AB = 4
   * AE = AB + BE = 4 + 3 = 7
   *
   * So, we update the distance table:
   *
   *      | Vertex | Shortest Distance from A |
   *      | A      | 0                        |
   *      | B      | 4                        |
   *      | C      | 2                        |
   *      | D      | 4                        |
   *      | E      | 7                        |
   *      | F      | 6                        |
   *
   * and update the history table:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | A     |
   *  | D      | C     |
   *  | E      | B     |
   *  | F      | C     |
   *
   * Now we have to go through the unvisited nodes. The visited nodes
   * array tells us that we've gone through A, C, and B, so now we just
   * have to go through D, E, and F. From the distance table, D is the
   * smallest, so we start with D.
   *
   * D has two neighbors: E and F. So, there are two edges to compare:
   *
   * {DE, DF}
   *
   *
   * The distance from A-D-E is 7.
   * The distance from A-E, however, is already at 7. So, we don't
   * make any updates.
   *
   * AD is 4. That's not less than its current value in the
   * distance table, which is 4. So, we ignore it.
   *
   * The distance from A-D-F is 5.
   * This is shorter than its current value in the distance table,
   * so we update the distance table:
   *
   *      | Vertex | Shortest Distance from A |
   *      | A      | 0                        |
   *      | B      | 4                        |
   *      | C      | 2                        |
   *      | D      | 4                        |
   *      | E      | 7                        |
   *      | F      | 5                        |
   *
   * and the history table:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | A     |
   *  | D      | C     |
   *  | E      | B     |
   *  | F      | D     |
   *
   * Update the visited array:
   *
   * [A,C,B,D]
   *
   * Now we just have two nodes to visit, E and F. Pick the smallest. Here,
   * it's F. The distance A-F-E is:
   *
   * AC + CD + DF + FE = 2 + 2 + 1 + 1 = 6
   *
   * This is shorter than AE, so we update the distance table:
   *
   *      | Vertex | Shortest Distance from A |
   *      | A      | 0                        |
   *      | B      | 4                        |
   *      | C      | 2                        |
   *      | D      | 4                        |
   *      | E      | 6                        |
   *      | F      | 5                        |
   *
   * and we update the history table:
   *
   *  | Vertex | value |
   *  |--------|-------|
   *  | A      | null  |
   *  | B      | A     |
   *  | C      | A     |
   *  | D      | C     |
   *  | E      | F     |
   *  | F      | D     |
   */
  shortestPath(start: any, end: any) {
    if (!this.vertices.has(start)) return;
    if (!this.vertices.has(end)) return;

    let pq = PriorityQueue();
    let distances: struct = {};
    let previous: struct = {};
    let path: any[] = [];
    for (const k of this.vertices.keys()) {
      if (k === start) {
        distances[k] = 0;
        pq.enqueue(k, 0);
      } else {
        distances[k] = Infinity;
        pq.enqueue(k, Infinity);
      }
      previous[k] = null;
    }
    let smallest: any;
    while (pq.nonempty()) {
      smallest = pq.dequeue()?.value;
      if (smallest === end) {
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (const v of this.vertices.get(smallest).keys()) {
          let candidate = distances[smallest] + v.weight;
          if (candidate < distances[v.node]) {
            distances[v.node] = candidate;
            previous[v.node] = smallest;
            pq.enqueue(v.node, candidate);
          }
        }
      }
    }
    path = path.concat(smallest).reverse();
    return path;
  }
  /**
   * @description
   * Adds an edge to the graph
   * @param v1 - a vertex in the graph
   * @param v2 - a vertex in the graph
   * @param weight - the weight of the edge
   */
  addEdge(v1: any, v2: any, weight: number) {
    this.vertices.get(v1)?.set(nodewg(v2, weight));
    this.vertices.get(v2)?.set(nodewg(v1, weight));
    return this;
  }
  edgeSet() {
    let out: any = [];
    let set = Set();
    for (const [key, val] of this.vertices) {
      for (const [k, v] of val) {
        let obj = { n1: key, n2: k.node, weight: k.weight };
        if (set.has(`${k.node},${key}`)) {
          continue;
        } else {
          out.push(obj);
        }
        set.push(`${key},${k.node}`);
      }
    }
    return out;
  }
  /**
   * Uses Kruskal's algorithm.
   * 1. Sort the edges by ascending edge weight.
   * 2. Walk through the sorted edges and look at the two nodes
   * that the edge belongs to. If the nodes are already unified, we
   * don't include the edge. Otherwise, we include it and unify the nodes.
   * 3. The algorithm terminates when every edge has been processed or all
   * the vertices have been unified.
   *
   */
  sortedEdgeSet(option?: "ascending" | "descending" = "ascending") {
    return mergeSort(
      this.edgeSet(),
      option === "ascending"
        ? (n, m) => n.weight > m.weight
        : (n, m) => n.weight < m.weight
    );
  }
}

export const WeightedGraph = (...edges: edgeset) =>
  new WEIGHTED_SIMPLE_GRAPH(...edges);
