const _ = require('lodash/fp');

const TYPES = { OPEN: 'OPEN', OCCUPIED: 'OCCUPIED' };

const getAdjacents = seats => ([x, y]) => {
  return _.flow(
    _.flatMap(x => [
      [x, y - 1],
      [x, y],
      [x, y + 1],
    ]),
    _.filter(([_x, _y]) => !(_x === x && _y === y)),
    _.map(([x, y]) => seats[`${x}-${y}`]),
    _.compact,
  )([x - 1, x, x + 1]);
};

const calculateRound = (seats, seatsToCheckFn, treshold = 4) => {
  const newSeats = {};

  let changed = false;
  _.forEach(seat => {
    const seatsToCheck = seatsToCheckFn(seat.pos);
    const occupiedSeats = seatsToCheck.filter(seat => seat.type === TYPES.OCCUPIED).length;
    if (seat.type === TYPES.OPEN && occupiedSeats === 0) {
      newSeats[seat.key] = { ...seat, type: TYPES.OCCUPIED };
      changed = true;
    } else if (seat.type === TYPES.OCCUPIED && occupiedSeats >= treshold) {
      newSeats[seat.key] = { ...seat, type: TYPES.OPEN };
      changed = true;
    } else {
      newSeats[seat.key] = seat;
    }
  }, seats);

  return [newSeats, changed];
};

const parse = input => {
  let seats = {};
  let size = {};
  input.split('\n').forEach((row, y, arr) => {
    size.width = row.length;
    size.height = arr.length;
    row.split('').forEach((spot, x) => {
      const key = `${x}-${y}`;
      if (spot === '.') return;
      if (spot === 'L') seats[key] = { pos: [x, y], key, type: TYPES.OPEN };
    });
  });
  return [seats, size];
};

const logSeats = ({ width, height }, seats) => {
  let log = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const seat = seats[`${x}-${y}`];
      if (seat) log += seat.type === TYPES.OCCUPIED ? '#' : 'L';
      else log += '.';
    }
    log += '\n';
  }
  console.log(log);
};

const part1 = input => {
  let [seats, size] = parse(input);

  let changed = true;
  while (changed) {
    [seats, changed] = calculateRound(seats, getAdjacents(seats));
    // logSeats(size, seats);
  }
  const occupiedSeats = _.filter(seat => seat.type === TYPES.OCCUPIED, seats);
  return occupiedSeats.length;
};

const buildDiag = (fnx, fny) => steps => {
  const x = fnx(steps)?.[0];
  const y = fny(steps)?.[1];
  return !Number.isInteger(x) || !Number.isInteger(y) ? null : [x, y];
};

const getInLineOfSight = (seats, { width, height }) => ([x, y]) => {
  const moveRight = steps => (x + steps > width ? null : [x + steps, y]);
  const moveLeft = steps => (x - steps < 0 ? null : [x - steps, y]);
  const moveUp = steps => (y - steps < 0 ? null : [x, y - steps]);
  const moveDown = steps => (y + steps > height ? null : [x, y + steps]);
  const moveDiag1 = buildDiag(moveRight, moveUp);
  const moveDiag2 = buildDiag(moveRight, moveDown);
  const moveDiag3 = buildDiag(moveLeft, moveUp);
  const moveDiag4 = buildDiag(moveLeft, moveDown);

  const inLineOfSight = [];
  [moveRight, moveLeft, moveUp, moveDown, moveDiag1, moveDiag2, moveDiag3, moveDiag4].forEach(move => {
    for (let steps = 1; !!move(steps); steps++) {
      const [x, y] = move(steps);
      const seat = seats[`${x}-${y}`];
      if (seat) {
        inLineOfSight.push(seat);
        break;
      }
    }
  });
  return inLineOfSight;
};

const part2 = input => {
  let [seats, size] = parse(input);

  let changed = true;
  while (changed) {
    [seats, changed] = calculateRound(seats, getInLineOfSight(seats, size), 5);
    // logSeats(size, seats);
  }
  const occupiedSeats = _.filter(seat => seat.type === TYPES.OCCUPIED, seats);
  return occupiedSeats.length;
};

module.exports = { part1, part2 };
