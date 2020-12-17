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

module.exports = { part1, part2 };
