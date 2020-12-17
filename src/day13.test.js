const { part1, part2 } = require('./day13');

test('part1', () => {
  const input = '939\n7,13,x,x,59,x,31,19';
  const output = 295;

  expect(part1(input)).toBe(output);
});

test('part2', () => {
  const testsPart2 = [
    ['939\n7,13,x,x,59,x,31,19', 1068781],
    ['1\n17,x,13,19', 3417],
    ['1\n67,7,59,61', 754018],
    ['1\n67,x,7,59,61', 779210],
    ['1\n67,7,x,59,61', 1261476],
    ['1\n1789,37,47,1889', 1202161486],
  ];

  testsPart2.forEach(([input, output]) => {
    expect(part2(input)).toBe(output);
  });
});
