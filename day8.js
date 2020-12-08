const _ = require('lodash');
const Graph = require('digraphe');

const parseInstructions = input =>
  input.split('\n').map(line => {
    const [opCode, amount] = line.split(' ');
    return { opCode, amount: Number(amount) };
  });

const runInstructions = (rawInstructions, untilLoop = true) => {
  const instructions = [...rawInstructions];
  let accumulator = 0;
  let pointer = 0;

  while (instructions[pointer] && !instructions[pointer].ran) {
    const instruction = instructions[pointer];
    instructions[pointer].ran = true;
    switch (instruction.opCode) {
      case 'acc':
        accumulator += instruction.amount;
        pointer++;
        break;
      case 'jmp':
        pointer += instruction.amount;
        break;
      case 'nop':
        pointer++;
        break;
    }
  }

  return accumulator;
};

const part1 = input => {
  const instructions = parseInstructions(input);

  return runInstructions(instructions);
};

const part2 = input => {
  const instructions = parseInstructions(input);

  const graph = new Graph();

  instructions.forEach((instruction, i) => {
    graph.addNode(`${i}`, instruction);
  });
  instructions.forEach((instruction, i) => {
    const { opCode, amount } = instruction;
    if (opCode === 'acc' || opCode === 'nop') graph.addEdge(`${i}`, `${i + 1}`);
    if (opCode === 'jmp') graph.addEdge(`${i}`, `${i + amount}`);
  });

  const routes = graph.routes({ from: '0' });
  let instructionToChange;

  routes.forEach(route => {
    const lastNode = _.last(route.path);
    if (lastNode.object.opCode === 'acc') return;

    const { id, object, edges } = lastNode;
    const newOpCode = object.opCode === 'jmp' ? 'nop' : 'jmp';
    graph.removeNode(id);

    graph.addNode(id, { ...object, opCode: newOpCode });
    edges
      .filter(edge => edge.source.id !== id)
      .forEach(edge => {
        graph.addEdge(edge.source.id, edge.target.id);
      });
    if (newOpCode === 'nop') {
      graph.addEdge(id, `${Number(id) + 1}`);
    } else {
      graph.addEdge(id, `${Number(id) + object.amount}`);
    }

    const changedRoutes = graph.routes({ from: '0', to: `${instructions.length - 1}` });
    if (changedRoutes.length > 0) {
      instructionToChange = { id, opCode: newOpCode };
    }

    graph.removeNode(id);
    graph.addNode(id, object);
    edges.forEach(edge => {
      graph.addEdge(edge.source.id, edge.target.id);
    });
  });

  instructions[instructionToChange.id].opCode = instructionToChange.opCode;

  return runInstructions(instructions, false);
};

/* TESTS */
const testInput1 = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;
console.assert(part1(testInput1) === 5, "Code doesn't work");
console.assert(part2(testInput1) === 8, "Code doesn't work");

const input = require('./inputs.json').day8;

console.log(part1(input));
console.log(part2(input));
