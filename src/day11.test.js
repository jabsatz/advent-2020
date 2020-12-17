const { part1, part2 } = require('./day11');

const input = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

test('part1', () => {
  expect(part1(input)).toBe(37);
});

test('part2', () => {
  expect(part2(input)).toBe(26);
});
