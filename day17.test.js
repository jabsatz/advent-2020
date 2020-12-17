const { part1, part2 } = require('./day17');

test('part1', () => {
  const input = '.#.\n..#\n###';
  const output = 112;

  expect(part1(input)).toBe(output);
});

test('part2', () => {
  const input = '.#.\n..#\n###';
  const output = 848;

  expect(part2(input)).toBe(output);
});
