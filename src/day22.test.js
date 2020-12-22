const { part1, part2 } = require('./day22');
const input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

test('part1', () => {
  expect(part1(input)).toBe(306);
});

test('part2', () => {
  expect(part2(input)).toBe(291);
});

test('should not loop', () => {
  const recursiveInput = `Player 1:
43
19

Player 2:
2
29
14`;
  expect(part2(recursiveInput)).toBe(105);
}, 500);
