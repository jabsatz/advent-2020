const { part1, part2 } = require('./day5');

const testData = [
  [['BFFFBBFRRR'], 567],
  [['FFFBBBFRRR'], 119],
  [['BBFFBBFRLL'], 820],
];

test('part1', () => {
  testData.forEach(([input, output]) => {
    expect(part1(input)).toBe(output);
  });
});
