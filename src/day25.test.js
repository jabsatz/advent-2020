const { part1, part2 } = require('./day25');
const input = '5764801\n17807724';

test('part1', () => {
  expect(part1(input)).toBe(14897079);
});
