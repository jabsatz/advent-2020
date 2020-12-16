const _ = require('lodash/fp');

const parse = input => {
  const [rawFields, rawOwnTicket, rawOtherTickets] = input.split('\n\n');

  const fields = _.flow(
    _.split('\n'),
    _.map(rawField => {
      const [name, rawRanges] = rawField.split(': ');
      const ranges = rawRanges.split(' or ').map(rawRange => {
        const [from, to] = rawRange.split('-');
        return { from, to };
      });
      return { name, ranges };
    }),
  )(rawFields);

  const ownTicket = rawOwnTicket.replace('your ticket:\n', '').split(',').map(Number);
  const otherTickets = rawOtherTickets
    .replace('nearby tickets:\n', '')
    .split('\n')
    .map(line => line.split(',').map(Number));

  return { fields, ownTicket, otherTickets };
};

const getValidFieldsForValue = (fields, value) =>
  fields.filter(field => field.ranges.some(({ from, to }) => value >= from && value <= to)).map(field => field.name);

const getInvalidFields = (fields, ticket) => ticket.filter(value => getValidFieldsForValue(fields, value).length === 0);

const part1 = input => {
  const { fields, otherTickets } = parse(input);

  const invalidValues = _.flatMap(ticket => getInvalidFields(fields, ticket), otherTickets);

  return _.sum(invalidValues);
};

const part2 = input => {
  const { fields, ownTicket, otherTickets } = parse(input);

  const validTickets = _.filter(ticket => getInvalidFields(fields, ticket).length === 0, otherTickets);

  const orderedFields = ownTicket.map(() => false);
  while (orderedFields.some(value => !value)) {
    for (let i = 0; i < ownTicket.length; i++) {
      if (orderedFields[i]) continue;
      let stillValidFields = fields.filter(field => !orderedFields.includes(field.name));
      for (let j = 0; stillValidFields.length > 1 && j < validTickets.length; j++) {
        const ticket = validTickets[j];
        const invalidFields = getValidFieldsForValue(stillValidFields, ticket[i]);

        stillValidFields = stillValidFields.filter(field => invalidFields.includes(field.name));
      }

      if (stillValidFields.length === 1) {
        orderedFields[i] = stillValidFields[0].name;
      }
    }
  }

  return orderedFields
    .map((name, i) => [name, ownTicket[i]])
    .filter(([name]) => name.startsWith('departure'))
    .reduce((prev, [_, value]) => prev * value, 1);
};

/* TESTS */

const testData1 = [
  [
    `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`,
    71,
  ],
];

testData1.forEach(([input, output], i) => {
  const result = part1(input);
  const testPassed = result === output;
  if (!testPassed) {
    console.error(`Test ${i + 1} (part 1) failed`);
    console.error(`Result was ${result}, expected ${output}`);
    throw 'Test failed';
  }
  console.log(`Test ${i + 1} (part 1) passed`);
});

const testData2 = [
  [
    `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`,
    { row: 11, class: 12, seat: 13 },
  ],
];

// testData2.forEach(([input, output], i) => {
//   const result = part2(input);
//   const testPassed = _.every((value, key) => value === output[key], output);
//   if (!testPassed) {
//     console.error(`Test ${i + 1} (part 2) failed`);
//     console.error(`Result was ${JSON.stringify(result)}, expected ${JSON.stringify(output)}`);
//     throw 'Test failed';
//   }
//   console.log(`Test ${i + 1} (part 2) passed`);
// });

const input = require('./inputs.json').day16;
console.log(part1(input));
console.log(part2(input));
