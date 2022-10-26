function adjacencyList(edges) {
  const L = edges.length;
  let hashtable = {};
  for (let i = 0; i < L; i++) {
    let A = edges[i][0];
    let B = edges[i][1];
    if (A in hashtable) {
      hashtable[A].push(B);
    } else {
      hashtable[A] = [B];
    }
    if (B in hashtable) {
      hashtable[B].push(A);
    } else {
      hashtable[B] = [A];
    }
  }
  return hashtable;
}

function buildGraph(edges) {
  const graph = {};
  for (let edge of edges) {
    const [a, b] = edge;
    if (!(a in graph)) graph[a] = [];
    if (!(b in graph)) graph[b] = [];
    graph[a].push(b);
    graph[b].push(a);
  }
  return graph;
}

function undirectedPath(edges, nodeA, nodeB) {
  const graph = buildGraph(edges);
  const visited = new Set()
  const f = (graph, src, dst) => {
    if (src === dst) return true;
    if (visited.has(src)) return false;
    visited.add(src);
    for (let neighbor of graph[src]) {
      if (f(graph, neighbor, dst)) {
        return true;
      }
    }
    return false;
  }
  return f(graph, nodeA, nodeB);
}

// console.log(undirectedPath(edges, 'j', 'm')); // -> true
// console.log(buildGraph(edges)); // -> true
 


// const cc = {
//   0: [8, 1, 5],
//   1: [0],
//   5: [0, 8],
//   8: [0, 5],
//   2: [3, 4],
//   3: [2, 4],
//   4: [3, 2]
// };

// function connectedComponentsCount(graph) {
//   const visited = new Set();
//   const f = (G,x) => {
//     if (visited.has(String(x))) { return false; }
//     visited.add(String(x));
//     for (let y of G[x]) {
//       f(G,y);
//     }
//     return true;
//   }
//   let count = 0;
//   for (let n in graph) {
//     if (f(graph,n)) count += 1;
//   }
//   return count;
// }

// console.log(connectedComponentsCount(cc));
// 


// const edges = [
//   ['W', 'L', 'W', 'W', 'W'],
//   ['W', 'L', 'W', 'W', 'W'],
//   ['W', 'W', 'W', 'L', 'W'],
//   ['W', 'W', 'L', 'L', 'W'],
//   ['L', 'W', 'W', 'L', 'L'],
//   ['L', 'L', 'W', 'W', 'W'],
// ];


function largestComponent(graph) {
  const visited = new Set();
  const exploreSize = (node) => {
    if (visited.has(node)) return 0;
    visited.add(node);
    let size = 1;
    for (let neighbor of graph[node]) {
      size += exploreSize(neighbor);
    }
    return size;
  }
  let largest = 0;
  for (let node in graph) {
    let size = exploreSize(node);
    largest = size > largest ? size : largest;
  }
  return largest;
}

function shortestPath(edges, nodeA, nodeB) {
  const graph = buildGraph(edges);
  const visited = new Set([nodeA]);
  const queue = [[nodeA, 0]];
  while (queue.length > 0) {
    const [node, distance] = queue.shift();
    if (node === nodeB) return distance;
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
  }
  return -1;
}

const grid = [
  ['W', 'L', 'W', 'W', 'W'],
  ['W', 'L', 'W', 'W', 'W'],
  ['W', 'W', 'W', 'L', 'W'],
  ['W', 'W', 'L', 'L', 'W'],
  ['L', 'W', 'W', 'L', 'L'],
  ['L', 'L', 'W', 'W', 'W'],
];

function islandCount(grid) {
  const visited = new Set();
  const explore = (row, col) => {
    const rowinbound = 0 <= row && row < grid.length;
    const colinbound = 0 <= col && col < grid[0].length;
    if (!rowinbound || !colinbound) return false;
    if (grid[row][col] === 'W') return false;
    const position = row + ',' + col;
    if (visited.has(position)) return false;
    visited.add(position);
    explore(row - 1, col);
    explore(row + 1, col);
    explore(row, col - 1);
    explore(row, col + 1);
    return true;
  }
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (explore(r, c) === true) {
        count += 1;
      }
    }
  }
  return count;
}

console.log(islandCount(grid);

