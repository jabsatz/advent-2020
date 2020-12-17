const _ = require('lodash');

const cleanPassports = passportsData =>
  passportsData.split('\n\n').map(data => {
    const normalized = data.replace(/\n/g, ' ');
    const obj = _.fromPairs(normalized.split(' ').map(attr => attr.split(':')));
    return obj;
  });

const part1 = passportsData => {
  const individualPassports = cleanPassports(passportsData);
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  const validPassports = individualPassports.filter(passport => requiredFields.every(field => !!passport[field]));
  return validPassports.length;
};

const part2 = passportsData => {
  const individualPassports = cleanPassports(passportsData);
  const validations = {
    byr: data => {
      const n = parseInt(data);
      return n <= 2002 && n >= 1920;
    },
    iyr: data => {
      const n = parseInt(data);
      return n <= 2020 && n >= 2010;
    },
    eyr: data => {
      const n = parseInt(data);
      return n <= 2030 && n >= 2020;
    },
    hgt: data => {
      const validFormat = /^\d{2,3}(cm|in)$/.test(data);
      if (!validFormat) return false;
      const height = parseInt(data.match(/^\d{2,3}/)[0]);
      if (data.endsWith('cm')) {
        return height >= 150 && height <= 193;
      }
      if (data.endsWith('in')) {
        return height >= 59 && height <= 76;
      }
    },
    hcl: data => /^#([0-9a-f]{6})$/.test(data),
    ecl: data => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(data),
    pid: data => /^\d{9}$/.test(data),
  };
  const validPassports = individualPassports.filter(passport =>
    Object.entries(validations).every(([field, validation]) => validation(passport[field])),
  );
  return validPassports.length;
};

module.exports = { part1, part2 };
