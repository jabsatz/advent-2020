const part1 = numbers => {
  let secondNumber;
  const number = numbers.find((n1, i, arr) => {
    secondNumber = arr.slice(i + 1).find(n2 => n1 + n2 === 2020);
    return !!secondNumber;
  });
  return number * secondNumber;
};

const part2 = numbers => {
  let secondNumber;
  let thirdNumber;
  const number = numbers.find((n1, i, arr) => {
    secondNumber = arr.slice(i + 1).find((n2, i, arr) => {
      thirdNumber = arr.slice(i + 1).find(n3 => n1 + n2 + n3 === 2020);
      return !!thirdNumber;
    });
    return !!secondNumber;
  });
  return number * secondNumber * thirdNumber;
};

module.exports = { part1, part2 };
