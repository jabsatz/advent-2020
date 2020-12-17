const { part1, part2 } = require('./day14');

test('part1', () => {
  const input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;
  const output = 165;

  expect(part1(input)).toBe(output);
});

test('part2', () => {
  const input = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;
  const output = 208;

  expect(part2(input)).toBe(output);
});
