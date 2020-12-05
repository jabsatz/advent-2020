const applyPolicy = (policy, policyFn) => {
  const [range, letter, password] = policy.replace(":", "").split(" ");
  const [lower, upper] = range.split("-").map((n) => parseInt(n));
  return policyFn({ lower, upper, letter, password });
};

const part1 = (policies) => {
  const validPasswords = policies.filter((policy) =>
    applyPolicy(policy, ({ lower, upper, letter, password }) => {
      const count = password.split("").filter((l) => l === letter).length;
      return count >= lower && count <= upper;
    })
  );
  return validPasswords.length;
};

const part2 = (policies) => {
  const validPasswords = policies.filter((policy) =>
    applyPolicy(policy, ({ lower, upper, letter, password }) => {
      const [letterInPos1, letterInPos2] = [lower, upper].map(
        (pos) => password[pos - 1] === letter
      );
      return (letterInPos1 || letterInPos2) && letterInPos1 !== letterInPos2;
    })
  );
  return validPasswords.length;
};

const input = require("./inputs.json").day2;

console.log(part1(input));
console.log(part2(input));
