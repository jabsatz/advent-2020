const React = require('react');
const { useState, useEffect } = require('react');
const _ = require('lodash');
const { Text, useInput, Box, Newline } = require('ink');
const inputs = require('../inputs.json');
const { OPTION_TYPE } = require('./constants');
const axios = require('axios');
const fs = require('fs/promises');

const template = `const _ = require('lodash');

const parse = (input) => {

};

const part1 = (input) => {
  parse(input);
};

const part2 = (input) => {
  parse(input);
};

const test = (input) => {

};

module.exports = { part1, part2, test };
`;

const RunText = ({ result, error, day }) => {
  if (result) {
    return (
      <Text color="whiteBright">
        Part 1 result: <Text color="cyan">{result[0]}</Text>
        <Newline />
        Part 2 result: <Text color="cyan">{result[1]}</Text>
      </Text>
    );
  }
  if (error) {
    console.error(error);
    return <Text>Error while running code.</Text>;
  }
  return <Text>Running day {day}...</Text>;
};

const NewText = ({ result, error, day }) => {
  if (result) {
    return (
      <Text color="whiteBright">
        Input fetched for day {day} and created the new file. Redacted Input:
        <Newline />
        <Text color="cyan">
          {result.split('\n').slice(0, 15).join('\n')}
          <Newline />
          ...
        </Text>
      </Text>
    );
  }
  if (error) {
    console.error(error);
    return <Text>Error while fetching.</Text>;
  }
  return <Text>Fetching input and creating file for day {day}...</Text>;
};

const TestText = ({ result, error, day }) => {
  if (result) {
    return (
      <Text color="whiteBright">
        All tests for day {day} passed.
        <Newline />
        <Text color="cyan">{result}</Text>
      </Text>
    );
  }
  if (error) {
    console.error(error);
    return <Text>Error on tests or test export doesn't exist.</Text>;
  }
  return <Text>Running tests for day {day}...</Text>;
};

const Progress = ({ option, day, onFinish }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = async () => {
      if (option === OPTION_TYPE.RUN) {
        const { part1, part2 } = require(`../day${day}`);
        try {
          const result1 = await part1(inputs[`day${day}`]);
          const result2 = await part2(inputs[`day${day}`]);
          setResult([result1, result2]);
        } catch (err) {
          setError(err);
        }
      } else if (option === OPTION_TYPE.NEW) {
        const response = await axios({
          url: `https://adventofcode.com/${process.env.ADVENT_YEAR}/day/${day}/input`,
          headers: {
            cookie: `session=${process.env.SESSION_TOKEN}`,
          },
        });
        const newInputs = { ...inputs };
        newInputs[`day${day}`] = response.data.substring(0, response.data.length - 1); // remove trailing newline
        await fs.writeFile('./inputs.json', JSON.stringify(newInputs), 'utf-8');
        try {
          await fs.access(`./day${day}.js`);
        } catch (error) {
          await fs.writeFile(`./day${day}.js`, template, 'utf-8');
        }
        setResult(response.data);
      } else if (option === OPTION_TYPE.TEST) {
        const { test } = require(`../day${day}`);
        try {
          const result = await test();
          setResult(result);
        } catch (err) {
          setError(err);
        }
      }
    };
    if (!isStarted) {
      setIsStarted(true);
      setTimeout(fn, 50);
    }
  }, [day, option, isStarted]);

  useInput(() => {
    if (result) onFinish();
  });

  return (
    <Box flexDirection="column">
      <Box>
        {option === OPTION_TYPE.RUN && <RunText day={day} error={error} result={result} />}
        {option === OPTION_TYPE.NEW && <NewText day={day} error={error} result={result} />}
        {option === OPTION_TYPE.TEST && <TestText day={day} error={error} result={result} />}
      </Box>
      {result && (
        <Box>
          <Text>Press any key to continue</Text>
        </Box>
      )}
    </Box>
  );
};

module.exports = Progress;
