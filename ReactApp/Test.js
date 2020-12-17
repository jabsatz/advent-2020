const React = require('react');
const { useState, useEffect } = require('react');
const fs = require('fs/promises');
const { Text, useInput, Box, useStdout, Newline, useStderr } = require('ink');
const jestCli = require('jest-cli');
const spawn = require('cross-spawn');

const TestText = ({ result, error, day }) => {
  if (result) {
    return <Text color="greenBright">All tests passed!</Text>;
  }
  if (error) {
    return <Text color="redBright">{error}</Text>;
  }
  return <Text>Running tests for day {day}...</Text>;
};

const Test = ({ day, onFinish }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fn = async () => {
      try {
        await fs.access(`./src/day${day}.test.js`);
        await jestCli.run([`day${day}`, '--detectOpenHandles']);
        await new Promise(resolve => {
          const jestProcess = spawn('node_modules/.bin/jest', [`day${day}`]);
          let output = '';
          jestProcess.stdout.on('data', data => (output += data));
          jestProcess.stderr.on('data', data => (output += data));
          jestProcess.on('close', code => {
            process.stdout.write('\x1Bc');
            if (code === 0) setResult(output);
            else setError(output);
            resolve();
          });
        });
      } catch (error) {
        if (error.code === 'ENOENT') {
          return setError("Test file doesn't exist.");
        }
        console.error(error);
        return setError('Uncaught error');
      }
    };
    if (!isStarted) {
      setResult(null);
      setError(null);
      setIsStarted(true);
      fn();
    }
  }, [day, isStarted]);

  useInput((input, key) => {
    if (result || error) {
      if (key.return) setIsStarted(false);
      else onFinish();
    }
  });

  return (
    <Box flexDirection="column">
      <Box>
        <TestText day={day} error={error} result={result} />
      </Box>
      {(result || error) && (
        <Box>
          <Text>Press RETURN to run again, or any key to go back.</Text>
        </Box>
      )}
    </Box>
  );
};

module.exports = Test;
