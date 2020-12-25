const _ = require('lodash');

const parse = input => {
  const [card, door] = input.split('\n').map(Number);
  return { card, door };
};

const loopSubjectNumber = (loopSize, subjectNumber) => {
  let n = 1;
  for (let i = 0; i < loopSize; i++) {
    n *= subjectNumber;
    n %= 20201227;
  }
  return n;
};

const calculateLoopSize = publicKeys => {
  let currentLoopSize = 1;
  let prevN = 1;
  while (true) {
    let n = (prevN * 7) % 20201227;
    if (n === publicKeys.card) {
      return { id: 'card', number: currentLoopSize };
    }
    if (n === publicKeys.door) {
      return { id: 'door', number: currentLoopSize };
    }

    prevN = n;
    currentLoopSize++;
  }
};

const part1 = input => {
  const publicKeys = parse(input);
  const loopSize = calculateLoopSize(publicKeys);
  const encryptionKey = loopSubjectNumber(loopSize.number, publicKeys[loopSize.id === 'card' ? 'door' : 'card']);

  return encryptionKey;
};

const part2 = () => 'YEA BOI WE DID IT';

module.exports = { part1, part2 };
