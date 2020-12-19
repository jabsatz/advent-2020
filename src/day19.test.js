const { part1, part2 } = require('./day19');

test('part1', () => {
  const input = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;
  expect(part1(input)).toBe(2);
});

const rules = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1`;

const messages = [
  'abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa',
  'bbabbbbaabaabba',
  'babbbbaabbbbbabbbbbbaabaaabaaa',
  'aaabbbbbbaaaabaababaabababbabaaabbababababaaa',
  'bbbbbbbaaaabbbbaaabbabaaa',
  'bbbababbbbaaaaaaaabbababaaababaabab',
  'ababaaaaaabaaab',
  'ababaaaaabbbaba',
  'baabbaaaabbaaaababbaababb',
  'abbbbabbbbaaaababbbbbbaaaababb',
  'aaaaabbaabaaaaababaa',
  'aaaabbaaaabbaaa',
  'aaaabbaabbaaaaaaabbbabbbaaabbaabaaa',
  'babaaabbbaaabaababbaabababaaab',
  'aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba',
];
test('part2 one by one', () => {
  const inputs = messages.map(message => `${rules}\n\n${message}`);

  expect(part2(inputs[0])).toBe(0);
  expect(part2(inputs[1])).toBe(1);
  expect(part2(inputs[2])).toBe(1);
  expect(part2(inputs[3])).toBe(1);
  expect(part2(inputs[4])).toBe(1);
  expect(part2(inputs[5])).toBe(1);
  expect(part2(inputs[6])).toBe(1);
  expect(part2(inputs[7])).toBe(1);
  expect(part2(inputs[8])).toBe(1);
  expect(part2(inputs[9])).toBe(1);
  expect(part2(inputs[10])).toBe(1);
  expect(part2(inputs[11])).toBe(0);
  expect(part2(inputs[12])).toBe(1);
  expect(part2(inputs[13])).toBe(0);
  expect(part2(inputs[14])).toBe(1);
});

test('part2', () => {
  const input = `${rules}\n\n${messages.join('\n')}`;
  expect(part1(input)).toBe(3);
  expect(part2(input)).toBe(12);
});
