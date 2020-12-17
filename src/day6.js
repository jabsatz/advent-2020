const _ = require('lodash');

const part1 = input => {
  const allAnswers = input.split('\n\n').map(str => str.split('\n'));

  const answersPerGroup = allAnswers.map(groupAnswers => {
    const dedupedLetters = groupAnswers
      .join('')
      .split('')
      .filter((letter, i, arr) => arr.indexOf(letter) === i);
    return dedupedLetters.length;
  });
  return answersPerGroup.reduce((prev, curr) => prev + curr, 0);
};

const part2 = input => {
  const allAnswers = input.split('\n\n').map(str => str.split('\n'));

  const answersPerGroup = allAnswers.map(groupAnswers => {
    const possibleAnswers = groupAnswers[0].split('');
    const othersInGroup = _.tail(groupAnswers);
    const matchedAnswers = possibleAnswers.filter(letter =>
      othersInGroup.every(answer => answer.indexOf(letter) !== -1),
    );
    return matchedAnswers.length;
  });

  return answersPerGroup.reduce((prev, curr) => prev + curr, 0);
};

module.exports = { part1, part2 };
