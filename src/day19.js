const _ = require('lodash');

const parse = input => {
  const [rawRules, messages] = input.split('\n\n').map(group => group.split('\n'));

  const rules = _.fromPairs(
    rawRules.map(line => {
      const [key, rawRule] = line.split(': ');
      const rule = rawRule.startsWith('"') ? rawRule.replace(/\"/g, '') : rawRule.split(' ');
      return [key, rule];
    }),
  );

  return { rules, messages };
};

class MonsterRegex {
  constructor(rules, options) {
    this.rules = rules;
    this.shouldLog = options.log;
    this.potentialChecks = [];
  }

  log(message) {
    if (this.shouldLog) {
      process.stdout.write(`\n${message}`);
    }
  }

  test(message) {
    this.log(`new message: ${message}`);
    const messagesLeft = this.testAgainst(message, ['0']);
    const isValid = messagesLeft.some(message => message.length === 0);
    this.log(`${message} is ${isValid ? 'valid' : 'invalid'}!`);
    this.log('\n\n');
    return isValid;
  }

  testAgainst(initialMessage, keys) {
    const key = _.last(keys);
    const currentRule = this.rules[key];

    if (initialMessage.length === 0) return [];

    if (typeof currentRule === 'string') {
      return initialMessage.startsWith(currentRule) ? [initialMessage.substring(currentRule.length)] : [];
    }

    this.log(`testing against rule ${key} (${currentRule.join(' ')}), path [${keys}]`);

    let messagesToCheck = [initialMessage];
    let messagesPassed = [];
    for (let i = 0; i < currentRule.length; i++) {
      const char = currentRule[i];

      const newMessagesLeft = [];

      if (char === '|') {
        messagesPassed = messagesToCheck;
        messagesToCheck = [initialMessage];
      } else {
        messagesToCheck.forEach(message => {
          const validMessages = this.testAgainst(message, [...keys, char]);

          validMessages.forEach(validMessage => {
            newMessagesLeft.push(validMessage);
          });
        });
        messagesToCheck = newMessagesLeft;
      }
    }
    messagesPassed = [...messagesPassed, ...messagesToCheck];
    this.log(`testing against rule ${key} finished, new possible messages: [${messagesPassed}]`);

    return messagesPassed;
  }
}

const part1 = input => {
  const { rules, messages } = parse(input);

  const regexTester = new MonsterRegex(rules, { log: false });

  return messages.filter(message => regexTester.test(message)).length;
};

const part2 = input => {
  const { rules, messages } = parse(input);

  rules['8'] = ['42', '|', '42', '8'];
  rules['11'] = ['42', '31', '|', '42', '11', '31'];

  const regexTester = new MonsterRegex(rules, { log: false });

  return messages.filter(message => regexTester.test(message)).length;
};

module.exports = { part1, part2 };
