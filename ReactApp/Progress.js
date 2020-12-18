const React = require('react');
const { useState, useEffect } = require('react');
const _ = require('lodash');
const { Text, useInput, Box, Newline } = require('ink');
const inputs = require('../src/inputs.json');
const { OPTION_TYPE } = require('./constants');
const axios = require('axios');
const fs = require('fs/promises');
const importJsx = require('import-jsx');
const Test = importJsx('./Test');

const createTestTemplate = day => `const { part1, part2 } = require('./day${day}')
const input = "";

test('part1', () => {
  expect(part1(input)).toBe(output);
});

test('part2', () => {
  expect(part2(input)).toBe(output);
});
`;

const codeTemplate = `const _ = require('lodash');

const parse = (input) => {

};

const part1 = (input) => {
  parse(input);
};

const part2 = (input) => {
  parse(input);
};

module.exports = { part1, part2 };
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
    return (
      <Text color="whiteBright">
        Error: <Text color="redBright">{error}</Text>
      </Text>
    );
  }
  return <Text>Fetching input and creating file for day {day}...</Text>;
};

const Progress = ({ option, day, onFinish }) => {
  if (option === OPTION_TYPE.TEST) return <Test day={day} onFinish={onFinish} />;
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = async () => {
      if (option === OPTION_TYPE.RUN) {
        const { part1, part2 } = require(`../src/day${day}`);
        try {
          const result1 = await part1(inputs[`day${day}`]);
          const result2 = await part2(inputs[`day${day}`]);
          setResult([result1, result2]);
        } catch (err) {
          setError(err);
        }
      } else if (option === OPTION_TYPE.NEW) {
        try {
          await fs.access(`./src/day${day}.js`);
          setError('Code file already exists');
        } catch (error) {
          try {
            const response = await axios({
              url: `https://adventofcode.com/${process.env.ADVENT_YEAR}/day/${day}/input`,
              headers: {
                cookie: `session=${process.env.SESSION_TOKEN}`,
              },
            });
            const newInputs = { ...inputs };
            newInputs[`day${day}`] = response.data.substring(0, response.data.length - 1); // remove trailing newline
            await fs.writeFile('./src/inputs.json', JSON.stringify(newInputs), 'utf-8');
            await fs.writeFile(`./src/day${day}.js`, codeTemplate, 'utf-8');
            await fs.writeFile(`./src/day${day}.test.js`, createTestTemplate(day), 'utf-8');
            setResult(response.data);
          } catch (error) {
            if (error?.response?.status === 404) {
              return setError('Day is not yet available.');
            }
            if (error?.response?.status === 401) {
              return setError('Unauthorized. Did you remember to set the SESSION_TOKEN env variable?');
            }
            console.error(error);
            return setError('Unhandled error');
          }
        }
      }
    };
    if (!isStarted) {
      setIsStarted(true);
      setTimeout(fn, 50);
    }
  }, [day, option, isStarted]);

  useInput(() => {
    if (result || error) onFinish();
  });

  return (
    <Box flexDirection="column">
      <Box>
        {option === OPTION_TYPE.RUN && <RunText day={day} error={error} result={result} />}
        {option === OPTION_TYPE.NEW && <NewText day={day} error={error} result={result} />}
        {option === OPTION_TYPE.TEST && <TestText day={day} error={error} result={result} />}
      </Box>
      {(result || error) && (
        <Box>
          <Text>Press any key to continue</Text>
        </Box>
      )}
    </Box>
  );
};

module.exports = Progress;
