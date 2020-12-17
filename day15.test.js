const { part1, part2 } = require('./day15');

const testData = [
  ['0,3,6', 436, 175594],
  ['1,3,2', 1, 2578],
  ['2,1,3', 10, 3544142],
  ['1,2,3', 27, 261214],
  ['2,3,1', 78, 6895259],
  ['3,2,1', 438, 18],
  ['3,1,2', 1836, 362],
];

test('part1', () => {
  testData.forEach(([input, output]) => {
    expect(part1(input)).toBe(output);
  });
});

test('part2', () => {
  testData.forEach(([input, _, output]) => {
    expect(part2(input)).toBe(output);
  });
});
