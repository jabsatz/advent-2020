const { part1, part2 } = require('./day8');

const input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

test('part1', () => {
  expect(part1(input)).toBe(5);
});

test('part2', () => {
  expect(part2(input)).toBe(8);
});
