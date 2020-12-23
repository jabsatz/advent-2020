const _ = require('lodash');

const parse = input => input.split('').map(Number);

const findTarget = (current, exclude, highest) => {
  let target = current - 1 || highest;
  const sorted = _.sortBy(exclude, cup => (current > cup ? current - cup : highest + current - cup));
  sorted.forEach(toExclude => {
    if (target === toExclude) {
      if (target === 1) target = highest;
      else target--;
    }
  });
  return target;
};

const getNextCup = (nextCups, nextOf) => nextCups[nextOf] ?? nextOf + 1;

const play = (initialCups, times = 10_000_000, highest = 1_000_000) => {
  let nextCups = {
    [highest]: initialCups[0],
  };

  initialCups.forEach((cup, i, arr) => {
    if (i < arr.length - 1) {
      nextCups[cup] = arr[i + 1];
    } else if (highest > 10) {
      nextCups[cup] = 10;
    } else {
      nextCups[cup] = arr[0];
    }
  });

  let currentCup = initialCups[0];
  for (let i = 0; i < times; i++) {
    let cupsToMove = [];
    cupsToMove.push(getNextCup(nextCups, currentCup));
    cupsToMove.push(getNextCup(nextCups, _.last(cupsToMove)));
    cupsToMove.push(getNextCup(nextCups, _.last(cupsToMove)));

    const nextToMoved = getNextCup(nextCups, _.last(cupsToMove));
    const target = findTarget(currentCup, cupsToMove, highest);
    const nextToTarget = getNextCup(nextCups, target);

    nextCups[currentCup] = nextToMoved;
    nextCups[target] = cupsToMove[0];
    nextCups[cupsToMove[0]] = cupsToMove[1];
    nextCups[cupsToMove[1]] = cupsToMove[2];
    nextCups[cupsToMove[2]] = nextToTarget;

    currentCup = nextToMoved;
  }

  return nextCups;
};

const part1 = input => {
  const cups = parse(input);

  const finalCups = play(cups, 100, 9);

  let result = '';
  let cup = finalCups[1];
  while (cup !== 1) {
    result += cup;
    cup = finalCups[cup];
  }
  return result;
};

const part2 = input => {
  const initialCups = parse(input);

  const finalCups = play(initialCups);

  const nextTo1 = getNextCup(finalCups, 1);
  const other = getNextCup(finalCups, nextTo1);

  return nextTo1 * other;
};

module.exports = { part1, part2 };
