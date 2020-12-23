const { part1, part2 } = require('./day23');
const input = '389125467';

test('part1', () => {
  expect(part1(input)).toBe('67384529');
});

test('part2', () => {
  expect(part2(input)).toBe(149245887792);
});
