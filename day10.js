const _ = require('lodash');

class Edge {
  constructor(from, to) {
    this.id = `${from}-${to}`;
    this.from = from;
    this.to = to;
  }
}

class Node {
  constructor(id, edges = []) {
    this.id = id;
    this.edges = edges;
  }

  addEdge(...args) {
    if (args.length === 1 && args[0] instanceof Edge) {
      const [edge] = args;
      this.edges.push(edge);
    } else if (args.length === 2) {
      const [from, to] = args;
      this.edges.push(new Edge(from, to));
    }
  }
}

class Graph {
  constructor() {
    this.nodes = {};
    this.edges = {};
    this.bottleneckCounts = {};
  }

  addNode(id) {
    if (!this.nodes[id]) {
      this.nodes[id] = new Node(id);
    }
  }

  addEdge(from, to) {
    const edge = new Edge(from, to);
    this.edges[edge.id] = edge;
    if (!this.nodes[from]) {
      this.nodes[from] = new Node(from, [edge]);
    } else {
      this.nodes[from].addEdge(edge);
    }

    if (!this.nodes[to]) {
      this.nodes[to] = new Node(to, [edge]);
    } else {
      this.nodes[to].addEdge(edge);
    }
  }

  countPaths({ from, to }, visited = []) {
    if (to === from) return 1;
    const edges = this.nodes[to].edges.filter(edge => !visited.includes(edge.to) && edge.from !== to);
    if (this.bottleneckCounts[to]) return this.bottleneckCounts[to];
    const count = edges.reduce((acc, edge) => acc + this.countPaths({ from, to: edge.from }, [...visited, edge.to]), 0);
    if (edges.length === 1) this.bottleneckCounts[to] = count;
    return count;
  }
}

const part1 = input => {
  const sorted = input.sort((a, b) => (a > b ? 1 : -1));
  const mine = _.last(sorted) + 3;
  const diffs = [...sorted, mine].reduce((acc, n, i, arr) => {
    const diff = n - (arr[i - 1] ?? 0);
    if (acc[diff] === undefined) acc[diff] = 1;
    else acc[diff]++;
    return acc;
  }, {});
  return diffs['1'] * diffs['3'];
};

const part2 = input => {
  const sorted = input.sort((a, b) => (a > b ? 1 : -1));
  const mine = _.last(sorted) + 3;
  const graph = new Graph();
  [0, ...sorted, mine].forEach((n, i, arr) => {
    graph.addNode(`${n}`);
    [i + 1, i + 2, i + 3].forEach(pos => {
      if (arr[pos] && arr[pos] - 3 <= n) {
        graph.addEdge(`${n}`, `${arr[pos]}`);
      }
    });
  });
  const count = graph.countPaths({ from: '0', to: `${mine}` });
  return count;
};

module.exports = { part1, part2 };
