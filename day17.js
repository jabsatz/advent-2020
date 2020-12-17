const _ = require('lodash/fp');

const TYPES = { ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' };

const getAdjacents = (key, cubes) => {
  const [x, y, z, w] = key.split(',').map(Number);
  return _.flow(
    _.flatMap(x => [
      [x, y - 1],
      [x, y],
      [x, y + 1],
    ]),
    _.flatMap(([x, y]) => [
      [x, y, z - 1],
      [x, y, z],
      [x, y, z + 1],
    ]),
    w !== undefined
      ? _.flatMap(([x, y, z]) => [
          [x, y, z, w - 1],
          [x, y, z, w],
          [x, y, z, w + 1],
        ])
      : _.identity,
    _.filter(([_x, _y, _z, _w]) => !(_x === x && _y === y && _z === z && _w === w)),
    _.map(([x, y, z, w]) => {
      let key = `${x},${y},${z}`;
      if (w !== undefined) key += `,${w}`;
      return cubes[key] ?? { key, type: TYPES.INACTIVE };
    }),
    _.compact,
  )([x - 1, x, x + 1]);
};

const calculateRound = cubes => {
  const grownCubes = { ...cubes };

  _.forEach(cube => {
    const cubesToCheck = getAdjacents(cube.key, cubes);
    cubesToCheck.forEach(_cube => {
      if (!cubes[_cube.key]) {
        grownCubes[_cube.key] = _cube;
      }
    });
  }, cubes);

  const newCubes = { ...grownCubes };

  _.forEach(cube => {
    const cubesToCheck = getAdjacents(cube.key, cubes);
    const activeCubes = cubesToCheck.filter(cube => cube.type === TYPES.ACTIVE).length;
    if (cube.type === TYPES.INACTIVE && activeCubes === 3) {
      newCubes[cube.key] = { ...cube, type: TYPES.ACTIVE };
    } else if (cube.type === TYPES.ACTIVE && ![2, 3].includes(activeCubes)) {
      newCubes[cube.key] = { ...cube, type: TYPES.INACTIVE };
    }
  }, grownCubes);

  return newCubes;
};

const parse = (input, fourDimensional) => {
  const cubes = {};
  input.split('\n').forEach((row, y) =>
    row.split('').forEach((tile, x) => {
      let key = `${x},${y},0`;
      if (fourDimensional) key += ',0';
      cubes[key] = { key, type: tile === '.' ? TYPES.INACTIVE : TYPES.ACTIVE };
    }),
  );
  return cubes;
};

const part1 = input => {
  let cubes = parse(input);

  for (let i = 0; i < 6; i++) {
    const newCubes = calculateRound(cubes);
    cubes = newCubes;
  }

  return _.filter(cube => cube.type === TYPES.ACTIVE, cubes).length;
};

const part2 = input => {
  let cubes = parse(input, true);

  for (let i = 0; i < 6; i++) {
    const newCubes = calculateRound(cubes);
    cubes = newCubes;
  }

  return _.filter(cube => cube.type === TYPES.ACTIVE, cubes).length;
};

module.exports = { part1, part2 };
