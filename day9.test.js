const { part1, part2 } = require('./day9');

const input = [35, 20, 15, 25, 47, 40, 62, 55, 65, 95, 102, 117, 150, 182, 127, 219, 299, 277, 309, 576];

test('part1', () => {
  expect(part1(input, 5)).toBe(127);
});

test('part2', () => {
  expect(part2(input, 5)).toBe(62);
});
