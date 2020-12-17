const OPTION_TYPE = {
  RUN: 'run',
  TEST: 'test',
  NEW: 'new',
};

const PHASE_TYPE = {
  OPTIONS: 'options',
  DAY: 'day',
  IN_PROGRESS: 'in-progress',
};

const options = [
  { name: 'Run day', key: OPTION_TYPE.RUN },
  { name: 'Test day', key: OPTION_TYPE.TEST },
  { name: 'New day', key: OPTION_TYPE.NEW },
];

module.exports = { OPTION_TYPE, PHASE_TYPE, options };
