const { part1, part2 } = require('./day12');

const input = 'F10\nN3\nF7\nR90\nF11';

test('part1', () => {
  expect(part1(input)).toBe(25);
});

test('part2', () => {
  expect(part2(input)).toBe(286);
});
