const { part1, part2 } = require('./day6');

const input = 'abc\n\na\nb\nc\n\nab\nac\n\na\na\na\na\n\nb';

test('part1', () => {
  expect(part1(input)).toBe(11);
});

test('part2', () => {
  expect(part2(input)).toBe(6);
});
