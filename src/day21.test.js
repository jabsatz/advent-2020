const { part1, part2 } = require('./day21');
const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

test('part1', () => {
  expect(part1(input)).toBe(5);
});

test('part2', () => {
  expect(part2(input)).toBe('mxmxvkd,sqjhc,fvjkl');
});
