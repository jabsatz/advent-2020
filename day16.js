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

const getWholeTicket = input => {
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

  return _.fromPairs(orderedFields.map((name, i) => [name, ownTicket[i]]));
};

const part2 = input => {
  return Object.entries(getWholeTicket(input))
    .filter(([name]) => name.startsWith('departure'))
    .reduce((prev, [_, value]) => prev * value, 1);
};

module.exports = { part1, part2, getWholeTicket };
