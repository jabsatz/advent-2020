const React = require('react');
const { useState } = require('react');
const { render, Text, Static, Box } = require('ink');
const { OPTION_TYPE, PHASE_TYPE } = require('./constants');
const importJsx = require('import-jsx');
const figlet = require('figlet');

const Options = importJsx('./Options');
const Day = importJsx('./Day');
const Progress = importJsx('./Progress');

const Advent = ({ title }) => {
  const [phase, setPhase] = useState(PHASE_TYPE.OPTIONS);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { name: 'Run day', key: OPTION_TYPE.RUN },
    { name: 'Test day', key: OPTION_TYPE.TEST },
    { name: 'New day', key: OPTION_TYPE.NEW },
  ];
  const [selectedDay, setSelectedDay] = useState(null);

  const onSelectOption = selectedOption => {
    setSelectedOption(selectedOption);
    setPhase(PHASE_TYPE.DAY);
  };

  const onSelectDay = selectedDay => {
    setSelectedDay(selectedDay);
    setPhase(PHASE_TYPE.IN_PROGRESS);
  };

  const onFinish = () => {
    setSelectedOption(null);
    setSelectedDay(null);
    setPhase(PHASE_TYPE.OPTIONS);
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="green">{title}</Text>
      </Box>
      {phase === PHASE_TYPE.OPTIONS && <Options onSelect={onSelectOption} options={options} />}
      {phase === PHASE_TYPE.DAY && <Day onSelect={onSelectDay} />}
      {phase === PHASE_TYPE.IN_PROGRESS && <Progress option={selectedOption} day={selectedDay} onFinish={onFinish} />}
    </Box>
  );
};

process.stdout.write('\x1Bc');

figlet('Advent of code', { font: 'Big Money-nw' }, (err, data) => {
  render(<Advent title={data} />);
});
