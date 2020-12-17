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

module.exports = { part1, part2 };
