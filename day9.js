const _ = require('lodash');

const part1 = (input, preamble = 25) => {
  for (let i = preamble; i < input.length; i++) {
    const result = input[i];
    const validNumbers = input.slice(i - preamble, i);
    const isValid = validNumbers.some(n1 => validNumbers.some(n2 => n1 + n2 === result));
    if (!isValid) {
      return result;
    }
  }
};

const part2 = (input, preamble = 25) => {
  const numberToReach = part1(input, preamble);
  for (let size = 2; size <= input.length; size++) {
    for (let initialPosition = 0; initialPosition < input.length - size; initialPosition++) {
      const numbersToJoin = input.slice(initialPosition, initialPosition + size);
      let sum = 0;
      for (let i = 0; i < numbersToJoin.length; i++) {
        sum += numbersToJoin[i];
        if (sum === numberToReach && i === numbersToJoin.length - 1) {
          return Math.min(...numbersToJoin) + Math.max(...numbersToJoin);
        }
        if (sum > numberToReach) break;
      }
    }
  }
};

/* TESTS */
const testInput1 = [35, 20, 15, 25, 47, 40, 62, 55, 65, 95, 102, 117, 150, 182, 127, 219, 299, 277, 309, 576];
console.assert(part1(testInput1, 5) === 127, "Code doesn't work");
console.assert(part2(testInput1, 5) === 62, "Code doesn't work");

module.exports = { part1, part2 };
