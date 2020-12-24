const _ = require('lodash/fp');

const getAdjacents = (key, colors) => {
  const [x, y] = key.split(',').map(Number);
  const offset = y % 2 === 0 ? 0 : 1;

  return [
    [x - 1, y],
    [x + 1, y],
    [x + offset - 1, y - 1],
    [x + offset, y - 1],
    [x + offset - 1, y + 1],
    [x + offset, y + 1],
  ].map(([x, y]) => {
    const key = `${x},${y}`;
    return colors[key] ?? { key, color: 'w' };
  });
};

const calculateRound = colors => {
  const grownColors = { ...colors };

  _.forEach(color => {
    const colorsToCheck = getAdjacents(color.key, colors);
    colorsToCheck.forEach(_color => {
      if (!colors[_color.key]) {
        grownColors[_color.key] = _color;
      }
    });
  }, colors);

  const newColors = { ...grownColors };

  _.forEach(({ key, color }) => {
    const colorsToCheck = getAdjacents(key, grownColors);
    const blackNeighbours = colorsToCheck.filter(({ color }) => color === 'b').length;
    if (color === 'w' && blackNeighbours === 2) {
      newColors[key] = { key, color: 'b' };
    } else if (color === 'b' && (blackNeighbours > 2 || blackNeighbours === 0)) {
      newColors[key] = { key, color: 'w' };
    }
  }, grownColors);

  return newColors;
};

const parse = input => {
  return input.split('\n').map(line => {
    let result = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if ('sn'.includes(char)) {
        result.push(char + line[i + 1]);
        i++;
      } else {
        result.push(char);
      }
    }
    return result;
  });
};

const calculateNewPos = ([x, y], dir) => {
  const offset = y % 2 === 0 ? 0 : 1;

  switch (dir) {
    case 'e':
      return [x - 1, y];
    case 'w':
      return [x + 1, y];
    case 'ne':
      return [x + offset - 1, y - 1];
    case 'nw':
      return [x + offset, y - 1];
    case 'se':
      return [x + offset - 1, y + 1];
    case 'sw':
      return [x + offset, y + 1];
  }
};

const getFlipped = input => {
  const tileMoves = parse(input);
  return tileMoves.map(moves => {
    const finalTile = moves.reduce(calculateNewPos, [0, 0]);
    return finalTile;
  });
};

const getColors = input => {
  const flippedTiles = getFlipped(input);
  const colors = {};
  flippedTiles.forEach(([x, y]) => {
    const key = `${x},${y}`;
    if (colors[key]?.color === 'b') {
      colors[key] = { key, color: 'w' };
    } else {
      colors[key] = { key, color: 'b' };
    }
  });
  return colors;
};

const part1 = input => {
  const colors = getColors(input);
  return _.values(colors).filter(({ color }) => color === 'b').length;
};

const part2 = input => {
  let colors = getColors(input);

  for (let i = 0; i < 100; i++) {
    const newColors = calculateRound(colors);
    colors = newColors;
  }

  return _.values(colors).filter(({ color }) => color === 'b').length;
};

module.exports = { part1, part2, getFlipped };
