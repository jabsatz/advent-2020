const _ = require('lodash');

const parse = input => {
  const [target, buses] = input.split('\n');
  return { target: Number(target), buses: buses.split(',').map(bus => (bus === 'x' ? null : Number(bus))) };
};

const part1 = input => {
  const { target, buses } = parse(input);

  const timesToNext = _.compact(buses).map(bus => ({ id: bus, timeToNext: bus - (target % bus) }));

  const busToTake = _.minBy(timesToNext, 'timeToNext');
  return busToTake.id * busToTake.timeToNext;
};

const part2 = input => {
  const { buses } = parse(input);

  let result = 1;
  let multiplier = 1;
  buses.forEach((bus, i) => {
    if (!bus) return;

    while (true) {
      const multiplierIsCorrect = (result + i) % bus === 0;
      if (multiplierIsCorrect) {
        multiplier *= bus;
        return;
      }
      result += multiplier;
    }
  });
  return result;
};

/* TESTS */

const testInput1 = '939\n7,13,x,x,59,x,31,19';
const testsPart2 = [
  ['1\n17,x,13,19', 3417],
  ['1\n67,7,59,61', 754018],
  ['1\n67,x,7,59,61', 779210],
  ['1\n67,7,x,59,61', 1261476],
  ['1\n1789,37,47,1889', 1202161486],
];
console.assert(part1(testInput1) === 295, "Code doesn't work");
console.assert(part2(testInput1) === 1068781, "Code doesn't work");

testsPart2.forEach(([input, output], i) => {
  const result = part2(input);
  const test1Passed = result === output;
  if (!test1Passed) {
    console.error(`Test ${i + 1} (part 2) failed`);
    console.error(`Result was ${result}, expected ${output}`);
    throw 'Test failed';
  }
  console.log(`Test ${i + 1} passed`);
});

const input = require('./inputs.json').day13;

console.log(part1(input));
console.log(part2(input));
