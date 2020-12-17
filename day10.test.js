const { part1, part2 } = require('./day10');

const testInput1 = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];
/* prettier-ignore */
const testInput2 = [28,33,18,42,31,14,46,20,48,47,24,23,49,45,19,38,39,11,1,32,25,35,8,17,7,9,4,2,34,10,3];

const testData = [
  [testInput1, 35, 8],
  [testInput2, 220, 19208],
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
