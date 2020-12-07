const _ = require("lodash");
const Graph = require("digraphe");

const parseRules = (input) => {
  const lines = input.split("\n");
  return _.fromPairs(
    lines.map((line) => {
      const [key, content] = line.replace(/\.$/, "").split(" bags contain ");
      const parsedKey = key.replace(/ bag(s?)$/, "");
      const parsedContent = content
        .split(", ")
        .filter((item) => item !== "no other bags")
        .map((item) => {
          const amount = parseInt(item.match(/^\d+/)[0]);
          const bag = item.replace(/^\d+ /, "").replace(/ bag(s?)$/, "");
          return { amount, bag };
        });
      return [parsedKey, parsedContent];
    })
  );
};

const part1 = (input) => {
  const rules = parseRules(input);
  const graph = new Graph();

  Object.keys(rules).forEach((key) => {
    graph.addNode(key);
  });

  Object.entries(rules).forEach(([key, contents]) => {
    contents.forEach(({ amount, bag }) => {
      graph.addEdge(bag, key, { weight: amount });
    });
  });

  const bagToLook = "shiny gold";

  const routes = graph.routes({ from: bagToLook });
  const routesStarters = routes
    .map((route) => _.last(route.path).id)
    .filter((bag, i, arr) => arr.indexOf(bag) === i);

  return routesStarters.length;
};

const part2 = (input) => {
  const rules = parseRules(input);
  const graph = new Graph();

  Object.keys(rules).forEach((key) => {
    graph.addNode(key);
  });

  Object.entries(rules).forEach(([key, contents]) => {
    contents.forEach(({ amount, bag }) => {
      graph.addEdge(key, bag, { weight: amount });
    });
  });

  const bagToLook = "shiny gold";

  const routes = graph.routes({ from: bagToLook });

  const bagNumber = routes.reduce((acc, route) => {
    const weights = route.path.map((node, i, arr) => {
      if (i === 0) return 1;
      const upperEdge = node.edges.find(
        (edge) => edge.target.id === node.id && edge.source.id === arr[i - 1].id
      );
      return upperEdge.weight;
    });
    const weightTotal = weights.reduce((acc, weight) => acc * weight, 1);
    return acc + weightTotal;
  }, 0);

  return bagNumber;
};

/* TESTS */
const testInput1 = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;
console.assert(part1(testInput1) === 4, "Code doesn't work");

const testInput2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;
console.assert(part2(testInput2) === 126, "Code doesn't work");

const input = require("./inputs.json").day7;

console.log(part1(input));
console.log(part2(input));
