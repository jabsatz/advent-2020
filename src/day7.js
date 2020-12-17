const _ = require('lodash');
const Graph = require('digraphe');

const parseRules = input => {
  const lines = input.split('\n');
  return _.fromPairs(
    lines.map(line => {
      const [key, content] = line.replace(/\.$/, '').split(' bags contain ');
      const parsedKey = key.replace(/ bag(s?)$/, '');
      const parsedContent = content
        .split(', ')
        .filter(item => item !== 'no other bags')
        .map(item => {
          const amount = parseInt(item.match(/^\d+/)[0]);
          const bag = item.replace(/^\d+ /, '').replace(/ bag(s?)$/, '');
          return { amount, bag };
        });
      return [parsedKey, parsedContent];
    }),
  );
};

const part1 = input => {
  const rules = parseRules(input);
  const graph = new Graph();

  Object.keys(rules).forEach(key => {
    graph.addNode(key);
  });

  Object.entries(rules).forEach(([key, contents]) => {
    contents.forEach(({ amount, bag }) => {
      graph.addEdge(bag, key, { weight: amount });
    });
  });

  const bagToLook = 'shiny gold';

  const routes = graph.routes({ from: bagToLook });
  const routesStarters = routes.map(route => _.last(route.path).id).filter((bag, i, arr) => arr.indexOf(bag) === i);

  return routesStarters.length;
};

const part2 = input => {
  const rules = parseRules(input);
  const graph = new Graph();

  Object.keys(rules).forEach(key => {
    graph.addNode(key);
  });

  Object.entries(rules).forEach(([key, contents]) => {
    contents.forEach(({ amount, bag }) => {
      graph.addEdge(key, bag, { weight: amount });
    });
  });

  const bagToLook = 'shiny gold';

  const routes = graph.routes({ from: bagToLook });

  const bagNumber = routes.reduce((acc, route) => {
    const weights = route.path.map((node, i, arr) => {
      if (i === 0) return 1;
      const upperEdge = node.edges.find(edge => edge.target.id === node.id && edge.source.id === arr[i - 1].id);
      return upperEdge.weight;
    });
    const weightTotal = weights.reduce((acc, weight) => acc * weight, 1);
    return acc + weightTotal;
  }, 0);

  return bagNumber;
};

module.exports = { part1, part2 };
