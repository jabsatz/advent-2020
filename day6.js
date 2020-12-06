const _ = require("lodash");

const part1 = (input) => {
  const allAnswers = input.split("\n\n").map((str) => str.split("\n"));

  const answersPerGroup = allAnswers.map((groupAnswers) => {
    const dedupedLetters = groupAnswers
      .join("")
      .split("")
      .filter((letter, i, arr) => arr.indexOf(letter) === i);
    return dedupedLetters.length;
  });
  return answersPerGroup.reduce((prev, curr) => prev + curr, 0);
};

const part2 = (input) => {
  const allAnswers = input.split("\n\n").map((str) => str.split("\n"));

  const answersPerGroup = allAnswers.map((groupAnswers) => {
    const possibleAnswers = groupAnswers[0].split("");
    const othersInGroup = _.tail(groupAnswers);
    const matchedAnswers = possibleAnswers.filter((letter) =>
      othersInGroup.every((answer) => answer.indexOf(letter) !== -1)
    );
    return matchedAnswers.length;
  });

  return answersPerGroup.reduce((prev, curr) => prev + curr, 0);
};

/* TESTS */
console.assert(
  part1("abc\n\na\nb\nc\n\nab\nac\n\na\na\na\na\n\nb") === 11,
  "Code doesn't work"
);
console.assert(
  part2("abc\n\na\nb\nc\n\nab\nac\n\na\na\na\na\n\nb") === 6,
  "Code doesn't work"
);

const input = require("./inputs.json").day6;

console.log(part1(input));
console.log(part2(input));
