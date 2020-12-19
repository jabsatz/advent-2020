const _ = require('lodash');

const parse = input => {
  const [rawRules, messages] = input.split('\n\n').map(group => group.split('\n'));

  const rules = _.fromPairs(
    rawRules.map(line => {
      const [key, rawRule] = line.split(': ');
      const rule = rawRule.startsWith('"')
        ? rawRule.replace(/\"/g, '')
        : rawRule.split(' | ').map(rules => rules.split(' '));
      return [key, rule];
    }),
  );

  return { rules, messages };
};

class MonsterRegex {
  constructor(rules) {
    this.rules = rules;
  }

  test = message => {
    const messagesLeft = this.testAgainst(message, ['0']);
    const isValid = messagesLeft.some(message => message.length === 0);
    return isValid;
  };

  testAgainst = (initialMessage, key) => {
    const currentRule = this.rules[key];

    if (initialMessage.length === 0) return []; // nothing can match an empty message
    if (typeof currentRule === 'string')
      return initialMessage.startsWith(currentRule) ? [initialMessage.substring(currentRule.length)] : [];

    const messagesValid = currentRule.flatMap(ruleSet => {
      return ruleSet.reduce(
        (messagesToCheck, char) => {
          return messagesToCheck.flatMap(message => this.testAgainst(message, char));
        },
        [initialMessage],
      );
    });

    return messagesValid;
  };
}

const part1 = input => {
  const { rules, messages } = parse(input);

  const regexTester = new MonsterRegex(rules);

  return messages.filter(message => regexTester.test(message)).length;
};

const part2 = input => {
  const { rules, messages } = parse(
    input.replace('8: 42', '8: 42 | 42 8').replace('11: 42 31', '11: 42 31 | 42 11 31'),
  );

  const regexTester = new MonsterRegex(rules);

  return messages.filter(message => regexTester.test(message)).length;
};

module.exports = { part1, part2 };
