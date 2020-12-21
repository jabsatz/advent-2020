const _ = require('lodash/fp');
const chalk = require('chalk');

const TOP = 'TOP';
const RIGHT = 'RIGHT';
const BOTTOM = 'BOTTOM';
const LEFT = 'LEFT';

const parse = input =>
  input.split('\n\n').map(rawTile => {
    const [rawId, rawChart] = rawTile.split(':\n');
    const id = rawId.split(' ')[1];
    const chart = rawChart.split('\n').map(row => row.split(''));
    return { id, chart };
  });

const reverseStr = str => _.reverse(str.split('')).join('');

const print = (lines, snakes = {}) => {
  process.stdout.write(chalk.red(`    ${lines.map((__, i) => (i % 10 === 0 ? i / 10 : ' ')).join('')}\n`));
  process.stdout.write(chalk.red(`    ${lines.map((__, i) => _.last(`${i}`.split(''))).join('')}\n`));
  lines.forEach((line, i) => {
    process.stdout.write(chalk.red(`${i < 10 ? ' ' : ''}${i}: `));
    line.split('').forEach((char, j) => {
      if (snakes[`${i},${j}`]) process.stdout.write(chalk.bgRed(' '));
      else process.stdout.write(char === '#' ? chalk.bgBlue(' ') : chalk.bgCyan(' '));
    });
    process.stdout.write('\n');
  });
};

const getMatchingTiles = tileSides =>
  _.flow(
    _.flatMap(([fromId, sides]) => {
      const otherTileSides = _.reject({ 0: fromId }, tileSides);

      return otherTileSides.flatMap(([toId, otherSides]) =>
        _.entries(otherSides).flatMap(([toSide, side]) =>
          _.entries(sides).flatMap(([fromSide, _side]) => {
            const isReversed = side === reverseStr(_side);
            return side === _side || isReversed ? [{ fromId, fromSide, toId, toSide, isReversed }] : [];
          }),
        ),
      );
    }),
    _.groupBy('fromId'),
  )(tileSides);

// sort by amount of matches so corners come first, and sides so top-left corner comes first
const sortByLeastMatchesAndTopLeftFirst = _.sortBy(({ matches }) => {
  const matchesKeys = _.keys(matches);
  return (
    matchesKeys.length * 100 +
    _.sum(
      matchesKeys.map(key => {
        switch (key) {
          case TOP:
            return 4;
          case LEFT:
            return 3;
          case BOTTOM:
            return 2;
          case RIGHT:
            return 1;
        }
      }),
    )
  );
});

const processTiles = tiles => {
  const sides = _.flow(
    _.map(({ id, chart }) => [
      id,
      {
        [TOP]: _.head(chart).join(''), // top
        [RIGHT]: chart.map(row => _.last(row)).join(''), // right
        [BOTTOM]: _.last(chart).join(''), // bottom
        [LEFT]: chart.map(row => _.head(row)).join(''), // left
      },
    ]),
    _.fromPairs,
  )(tiles);
  const matches = getMatchingTiles(_.entries(sides));
  return _.flow(
    _.map(({ id, chart }) => ({
      id,
      chart,
      sides: sides[id],
      matches: _.keyBy('fromSide', matches[id]),
    })),
    sortByLeastMatchesAndTopLeftFirst,
  )(tiles);
};

const part1 = input => {
  const tiles = parse(input);
  const processedTiles = processTiles(tiles);

  return _.flow(
    _.slice(0, 4),
    _.map(({ id }) => Number(id)),
    _.reduce((prev, curr) => prev * curr, 1),
  )(processedTiles);
};

const TRANS = {
  NOTHING: 'do nothing',
  R_180: 'rotate 180',
  FLIP_V: 'flip vertical',
  FLIP_H: 'flip horizontal',
  COUNTER: 'rotate counter clockwise',
  CLOCK: 'rotate clockwise',
  FLIP_H_COUNTER: 'flip horizontal then rotate counter clockwise',
  FLIP_H_CLOCK: 'flip horizontal then rotate clockwise',
};

const clockwiseDict = { [TOP]: RIGHT, [RIGHT]: BOTTOM, [BOTTOM]: LEFT, [LEFT]: TOP };
const oppositeDict = { [TOP]: BOTTOM, [RIGHT]: LEFT, [BOTTOM]: TOP, [LEFT]: RIGHT };
const counterClockwiseDict = { [TOP]: LEFT, [RIGHT]: TOP, [BOTTOM]: RIGHT, [LEFT]: BOTTOM };

const is = _.curry((directions, dir) => directions.includes(dir));
const isHorizontal = is([RIGHT, LEFT]);
const isVertical = is([TOP, BOTTOM]);

const getTransformation = ({ fromSide, toSide, isReversed }) => {
  if (fromSide === toSide) {
    return isReversed ? TRANS.R_180 : isHorizontal(toSide) ? TRANS.FLIP_H : TRANS.FLIP_V;
  }
  if (fromSide === clockwiseDict[toSide]) {
    return (isReversed && isVertical(toSide)) || (!isReversed && isHorizontal(toSide))
      ? TRANS.COUNTER
      : isHorizontal(toSide)
      ? TRANS.FLIP_H_CLOCK
      : TRANS.FLIP_H_COUNTER;
  }
  if (fromSide === oppositeDict[toSide]) {
    return !isReversed ? TRANS.NOTHING : isHorizontal(toSide) ? TRANS.FLIP_V : TRANS.FLIP_H;
  }
  if (fromSide === counterClockwiseDict[toSide]) {
    return (!isReversed && isVertical(toSide)) || (isReversed && isHorizontal(toSide))
      ? TRANS.CLOCK
      : isHorizontal(toSide)
      ? TRANS.FLIP_H_COUNTER
      : TRANS.FLIP_H_CLOCK;
  }
  throw 'aaaaaaaaaaaa muerte';
};

const rotateClockwise = ([dir, reversed]) => [clockwiseDict[dir], isHorizontal(dir) ? !reversed : reversed];
const rotateCounterClockwise = ([dir, reversed]) => [counterClockwiseDict[dir], isVertical(dir) ? !reversed : reversed];
const flipVertical = ([dir, reversed]) => (isVertical(dir) ? [oppositeDict[dir], reversed] : [dir, !reversed]);
const flipHorizontal = ([dir, reversed]) => (isHorizontal(dir) ? [oppositeDict[dir], reversed] : [dir, !reversed]);

const transFunctions = {
  [TRANS.NOTHING]: _.identity,
  [TRANS.R_180]: _.flow(rotateClockwise, rotateClockwise),
  [TRANS.FLIP_V]: flipVertical,
  [TRANS.FLIP_H]: flipHorizontal,
  [TRANS.COUNTER]: rotateCounterClockwise,
  [TRANS.CLOCK]: rotateClockwise,
  [TRANS.FLIP_H_COUNTER]: _.flow(flipHorizontal, rotateCounterClockwise),
  [TRANS.FLIP_H_CLOCK]: _.flow(flipHorizontal, rotateClockwise),
};

const applyTransform = (matches, transform) =>
  _.flow(
    _.values,
    _.map(match => {
      const [fromSide, isReversed] = transFunctions[transform]([match.fromSide, match.isReversed]);
      return { ...match, fromSide, isReversed };
    }),
    _.keyBy('fromSide'),
  )(matches);

const rotateClockwiseChart = chart => chart.map((row, i) => row.map((_, j) => chart[chart.length - j - 1][i]));
const rotateCounterClockwiseChart = chart => chart.map((row, i) => row.map((_, j) => chart[j][row.length - i - 1]));
const flipVerticalChart = chart => _.reverse(chart);
const flipHorizontalChart = chart => chart.map(row => _.reverse(row));

const transChartFunctions = {
  [TRANS.NOTHING]: _.identity,
  [TRANS.R_180]: _.flow(rotateClockwiseChart, rotateClockwiseChart),
  [TRANS.FLIP_V]: flipVerticalChart,
  [TRANS.FLIP_H]: flipHorizontalChart,
  [TRANS.COUNTER]: rotateCounterClockwiseChart,
  [TRANS.CLOCK]: rotateClockwiseChart,
  [TRANS.FLIP_H_COUNTER]: _.flow(flipHorizontalChart, rotateCounterClockwiseChart),
  [TRANS.FLIP_H_CLOCK]: _.flow(flipHorizontalChart, rotateClockwiseChart),
};

const applyTransformChart = (originalChart, transform) => transChartFunctions[transform](originalChart);

const takeEdgesOffChart = chart =>
  _.flow(
    _.tail,
    _.initial,
    _.map(row => _.tail(_.initial(row))),
  )(chart);

const buildFullChart = processedTiles => {
  let transformations = { [processedTiles[0].id]: TRANS.NOTHING };
  let nextTile = { id: processedTiles[0].id, x: 0, y: 0 };
  let nextRow = null;
  let fullChart = [];

  while (nextTile) {
    const { id, x, y } = nextTile;
    const transformation = transformations[id];
    const tile = _.find({ id }, processedTiles);
    const matches = applyTransform(tile.matches, transformation);

    if (x === 0) {
      fullChart[y] = [];
      if (matches[BOTTOM]) {
        const match = matches[BOTTOM];
        transformations[match.toId] = getTransformation(match);
        nextRow = { id: match.toId, x: 0, y: y + 1 };
      }
    }

    fullChart[y].push(applyTransformChart(takeEdgesOffChart(tile.chart), transformation));

    if (matches[RIGHT]) {
      const match = matches[RIGHT];
      transformations[match.toId] = getTransformation(match);
      nextTile = { id: match.toId, x: x + 1, y };
    } else {
      nextTile = nextRow;
      nextRow = null;
    }
  }

  const chart = fullChart.flatMap(tileRow => {
    let rows = [];
    for (let i = 0; i < tileRow[0].length; i++) {
      rows.push(tileRow.flatMap(tile => tile[i]));
    }
    return rows;
  });

  return chart;
};

const seaMonsterHead = /^.{18}#/;
const seaMonsterBody = /#.{4}##.{4}##.{4}###/g;
const seaMonsterLegs = /^.#..#..#..#..#..#/;

const part2 = input => {
  const tiles = parse(input);
  const processedTiles = processTiles(tiles);
  const chart = buildFullChart(processedTiles);

  for (let transformation of _.values(TRANS)) {
    const chartToCheck = applyTransformChart(chart, transformation);
    const lines = chartToCheck.map(row => row.join(''));
    let snakes = {};
    lines.forEach((line, i, arr) => {
      if (i >= 1 && i < arr.length - 1) {
        const matches = [];
        for (let j = 0; j < line.length - 20; j++) {
          const toCheck = line.substring(j, j + 20);
          const match = toCheck.match(seaMonsterBody);
          if (match) matches.push(j);
        }
        matches.forEach(index => {
          const hasSeaMonsterHead = seaMonsterHead.test(arr[i - 1].substring(index));
          const hasSeaMonsterLegs = seaMonsterLegs.test(arr[i + 1].substring(index));

          if (hasSeaMonsterHead && hasSeaMonsterLegs) {
            const legs = [1, 4, 7, 10, 13, 16].map(x => `${i + 1},${x + index}`);
            const body = [0, 5, 6, 11, 12, 17, 18, 19].map(x => `${i},${x + index}`);
            const head = `${i - 1},${index + 18}`;
            [...legs, ...body, head].forEach(snakePos => {
              snakes[snakePos] = true;
            });
          }
        });
      }
      return false;
    });

    if (_.values(snakes).length > 0) {
      // print(lines, snakes);
      return (
        lines
          .join('')
          .split('')
          .filter(char => char === '#').length - _.compact(_.values(snakes)).length
      );
    }
  }
};

module.exports = { part1, part2 };
