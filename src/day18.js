const { get } = require('lodash');
const _ = require('lodash');

const parse = input => {
  return input.split('\n').map(line => line.replace(/ /g, ''));
};

const getEndOfBlock = (arithmetic, initialIndex) => {
  let levels = 0;
  for (let i = initialIndex; i < arithmetic.length; i++) {
    const char = arithmetic[i];
    if (char === ')') levels--;
    else if (char === '(') levels++;

    if (levels === 0) return i;
  }
  throw new Error(`Can't find end ${arithmetic} ${initialIndex}`);
};

const calculate = arithmetic => {
  let result = 0;
  let operation = null;
  for (let i = 0; i < arithmetic.length; i++) {
    const char = arithmetic[i];
    let n;
    if (['+', '*'].includes(char)) {
      operation = char;
    } else if (char === '(') {
      const endOfBlock = getEndOfBlock(arithmetic, i);
      n = calculate(arithmetic.substring(i + 1, endOfBlock));
      i = endOfBlock;
    } else if (/\d/.test(char)) {
      n = arithmetic.substring(i).match(/^\d+/)[0];
      i += n.length - 1;
      n = Number(n);
    }

    if (n) {
      switch (operation) {
        case '+':
          result += n;
          break;
        case '*':
          result *= n;
          break;
        default:
          result = n;
          break;
      }
      operation = null;
    }
  }

  return result;
};

const part1 = input => {
  const lines = parse(input);

  const result = lines.map(line => calculate(line));

  return _.sum(result);
};

const applyOperation = (a, b, operation) => {
  switch (operation) {
    case '+':
      return a + b;
    case '*':
      return a * b;
  }
};

const calculateWithPrecedence = arithmetic => {
  let arithArr = [];
  for (let i = 0; i < arithmetic.length; i++) {
    const char = arithmetic[i];
    if (char === '(') {
      const endOfBlock = getEndOfBlock(arithmetic, i);
      n = calculateWithPrecedence(arithmetic.substring(i + 1, endOfBlock));
      i = endOfBlock;
      arithArr.push(n);
    } else if (/\d/.test(char)) {
      n = arithmetic.substring(i).match(/^\d+/)[0];
      i += n.length - 1;
      arithArr.push(Number(n));
    } else {
      arithArr.push(char);
    }
  }
  ['+', '*'].forEach(operation => {
    for (let i = arithArr.indexOf(operation); i !== -1; i = arithArr.indexOf(operation)) {
      const resultOfBlock = applyOperation(arithArr[i - 1], arithArr[i + 1], operation);
      arithArr = [...arithArr.slice(0, i - 1), resultOfBlock, ...arithArr.slice(i + 2, arithmetic.length)];
    }
  });

  if (arithArr.length !== 1) throw new Error(`Array didn't reduce correctly: ${arithArr}`);
  return arithArr[0];
};

const part2 = input => {
  const lines = parse(input);

  const result = lines.map(line => calculateWithPrecedence(line));

  return _.sum(result);
};

module.exports = { part1, part2 };
