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

module.exports = { part1, part2 };
