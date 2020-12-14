const _ = require('lodash');

const computeMaskValue = (mask, value) => {
  let computedString = '';
  const valueBase2 = value.toString(2);
  for (let i = 0; i < mask.length; i++) {
    const digitFromLeft = valueBase2[valueBase2.length - 1 - i];
    const maskOnValue = mask[mask.length - 1 - i];

    computedString = (maskOnValue === 'X' ? digitFromLeft || '0' : maskOnValue) + computedString;
  }
  return parseInt(computedString, 2);
};

const parse = input =>
  input.split('\n').map(line => {
    const [task, result] = line.split(' = ');
    if (task === 'mask') {
      return { mask: result };
    }
    const position = parseInt(task.match(/\d+/)[0], 10);
    return { position, value: parseInt(result, 10) };
  });

const part1 = input => {
  const instructions = parse(input);

  let mask;
  let memory = {};
  instructions.forEach(instruction => {
    if (instruction.mask) {
      mask = instruction.mask;
      return;
    }
    const value = computeMaskValue(mask, instruction.value);
    memory[instruction.position] = value;
  });
  return _.reduce(memory, (prev, curr) => prev + curr, 0);
};

const computeFloating = address => {
  if (address.length === 0) return '';
  const addressAfter = address.substring(1);
  const next = computeFloating(addressAfter);
  if (address[0] === 'X' && !Array.isArray(next)) {
    return [`1${next}`, `0${next}`];
  } else if (address[0] === 'X' && Array.isArray(next)) {
    return _.flatMap(next, nextAddress => [`1${nextAddress}`, `0${nextAddress}`]);
  } else if (address[0] !== 'X' && !Array.isArray(next)) {
    return `${address[0]}${next}`;
  } else if (address[0] !== 'X' && Array.isArray(next)) {
    return _.flatMap(next, nextAddress => `${address[0]}${nextAddress}`);
  }
};

const computeMaskMemory = (mask, memory) => {
  let computedString = '';
  const memoryBase2 = memory.toString(2);
  for (let i = 0; i < mask.length; i++) {
    const digitFromLeft = memoryBase2[memoryBase2.length - 1 - i];
    const maskOnValue = mask[mask.length - 1 - i];

    computedString = (maskOnValue === '0' ? digitFromLeft || '0' : maskOnValue) + computedString;
  }

  const floatingAddresses = computeFloating(computedString);
  return floatingAddresses.map(address => parseInt(address, 2));
};

const part2 = input => {
  const instructions = parse(input);

  let mask;
  let memory = {};
  instructions.forEach((instruction, i) => {
    if (instruction.mask) {
      mask = instruction.mask;
      return;
    }
    const positions = computeMaskMemory(mask, instruction.position);
    positions.forEach(position => {
      memory[position] = instruction.value;
    });
  });
  return _.reduce(memory, (prev, curr) => prev + curr, 0);
};

/* TESTS */

const testData1 = [
  [
    `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`,
    165,
  ],
];

testData1.forEach(([input, output], i) => {
  const result1 = part1(input);
  const test1Passed = result1 === output;
  if (!test1Passed) {
    console.error(`Test ${i + 1} (part 1) failed`);
    console.error(`Result was ${result1}, expected ${output}`);
    throw 'Test failed';
  }
  console.log(`Test ${i + 1} (part 1) passed`);
});

const testData2 = [
  [
    `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`,
    208,
  ],
];

testData2.forEach(([input, output], i) => {
  const result1 = part2(input);
  const test1Passed = result1 === output;
  if (!test1Passed) {
    console.error(`Test ${i + 1} (part 2) failed`);
    console.error(`Result was ${result1}, expected ${output}`);
    throw 'Test failed';
  }
  console.log(`Test ${i + 1} (part 2) passed`);
});

const input = require('./inputs.json').day14;
console.log(part1(input));
console.log(part2(input));
