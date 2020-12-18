const { part1, part2 } = require('./day18');

test('part1', () => {
  const testData = [
    ['2 * 3 + (4 * 5)', 26],
    ['5 + (8 * 3 + 9 + 3 * 4 * 3)', 437],
    ['5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', 12240],
    ['((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', 13632],
  ];

  testData.forEach(([input, output]) => {
    expect(part1(input)).toBe(output);
  });
});

test('part2', () => {
  const testData = [
    ['1 + (2 * 3) + (4 * (5 + 6))', 51],
    ['2 * 3 + (4 * 5)', 46],
    ['5 + (8 * 3 + 9 + 3 * 4 * 3)', 1445],
    ['5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', 669060],
    ['((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', 23340],
  ];

  testData.forEach(([input, output]) => {
    expect(part2(input)).toBe(output);
  });
});
