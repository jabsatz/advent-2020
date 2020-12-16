const _ = require('lodash');

// better performance, still slow (3 seconds for 30_000_000, 0.08ms for 2020)
const calculateMap = (input, amount) => {
  const initialNumbers = input.split(',').map(Number);
  const indexes = new Map();
  _.initial(initialNumbers).forEach((n, i) => {
    indexes.set(n, i);
  });
  let lastNumber = _.last(initialNumbers);
  for (let i = initialNumbers.length - 1; i < amount - 1; i++) {
    const newNumber = indexes.has(lastNumber) ? i - indexes.get(lastNumber) : 0;
    indexes.set(lastNumber, i);
    lastNumber = newNumber;
  }
  return lastNumber;
};

// horrible performance (way too long for 30_000_000, 1.18ms for 2020)
const calculateArray = (input, amount) => {
  const initialNumbers = input.split(',').map(Number);
  let prevNumbers = _.initial(initialNumbers);
  let lastNumber = _.last(initialNumbers);
  for (let i = prevNumbers.length; i < amount - 1; i++) {
    const lastNumberPreviousIndex = prevNumbers.lastIndexOf(lastNumber);
    prevNumbers.push(lastNumber);
    lastNumber = lastNumberPreviousIndex === -1 ? 0 : i - lastNumberPreviousIndex;
  }
  return lastNumber;
};

const part2 = input => calculateMap(input, 30_000_000);

const part1 = input => calculateMap(input, 2020);

/* TESTS */

const testData1 = [
  ['0,3,6', 436, 175594],
  ['1,3,2', 1, 2578],
  ['2,1,3', 10, 3544142],
  ['1,2,3', 27, 261214],
  ['2,3,1', 78, 6895259],
  ['3,2,1', 438, 18],
  ['3,1,2', 1836, 362],
];

testData1.forEach(([input, output1, output2], i) => {
  const result1 = part1(input);
  const test1Passed = result1 === output1;
  if (!test1Passed) {
    console.error(`Test ${i + 1} (part 1) failed`);
    console.error(`Result was ${result1}, expected ${output1}`);
    throw 'Test failed';
  }
  console.log(`Test ${i + 1} (part 1) passed`);

  const result2 = part2(input);
  const test2Passed = result2 === output2;
  if (!test2Passed) {
    console.error(`Test ${i + 1} (part 2) failed`);
    console.error(`Result was ${result2}, expected ${output2}`);
    throw 'Test failed';
  }
  console.log(`Test ${i + 1} (part 2) passed`);
});

const input = require('./inputs.json').day15;
console.log(part1(input));
console.log(part2(input));
