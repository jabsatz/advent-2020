const _ = require('lodash');

const parse = input => input.split('\n').map(action => ({ type: action[0], value: Number(action.substring(1)) }));

const calculate = (actions, state, reducer) => {
  const action = _.head(actions);
  if (!action) return state;
  const newState = reducer(action, state);
  console.log(newState);
  return calculate(_.tail(actions), newState, reducer);
};

const part1Reducer = ({ type, value }, state) => {
  switch (type) {
    case 'N':
      return { ...state, y: state.y - value };
    case 'S':
      return { ...state, y: state.y + value };
    case 'E':
      return { ...state, x: state.x + value };
    case 'W':
      return { ...state, x: state.x - value };
    case 'L':
      return { ...state, rotation: state.rotation + value / 180 };
    case 'R':
      return { ...state, rotation: state.rotation - value / 180 };
    case 'F':
      // x+ right, x- left, y+ down, y- up
      const x = state.x + Math.round(Math.cos(state.rotation * Math.PI) * value);
      const y = state.y - Math.round(Math.sin(state.rotation * Math.PI) * value);
      return { ...state, x, y };
  }
};

const part1 = input => {
  const actions = parse(input);
  const initialState = { x: 0, y: 0, rotation: 0 };

  const finalState = calculate(actions, initialState, part1Reducer);
  return Math.abs(finalState.x) + Math.abs(finalState.y);
};

// esto superó mis ganas de hacer trigonometría, vamos con el hard-code
const moveToRotation = ({ x, y }, rotation) => {
  if (rotation === 0) return { x, y };
  if (rotation === 1) return { x: y, y: -x };
  if (rotation === 2) return { x: -x, y: -y };
  if (rotation === 3) return { x: -y, y: x };
};

const part2Reducer = ({ type, value }, state) => {
  const { waypoint, ship } = state;
  switch (type) {
    case 'N':
      return { ship, waypoint: { ...waypoint, y: waypoint.y - value } };
    case 'S':
      return { ship, waypoint: { ...waypoint, y: waypoint.y + value } };
    case 'E':
      return { ship, waypoint: { ...waypoint, x: waypoint.x + value } };
    case 'W':
      return { ship, waypoint: { ...waypoint, x: waypoint.x - value } };
    case 'L':
      return { ship, waypoint: moveToRotation(waypoint, (value / 90) % 4) };
    case 'R':
      return { ship, waypoint: moveToRotation(waypoint, 4 - ((value / 90) % 4)) };
    case 'F':
      return {
        ship: {
          x: ship.x + waypoint.x * value,
          y: ship.y + waypoint.y * value,
        },
        waypoint,
      };
  }
};

const part2 = input => {
  const actions = parse(input);
  const initialState = { waypoint: { x: 10, y: -1 }, ship: { x: 0, y: 0 } };

  const finalState = calculate(actions, initialState, part2Reducer);
  return Math.abs(finalState.ship.x) + Math.abs(finalState.ship.y);
};

/* TESTS */

const testInput1 = 'F10\nN3\nF7\nR90\nF11';
// console.assert(part1(testInput1) === 25, "Code doesn't work");
console.assert(part2(testInput1) === 286, "Code doesn't work");

const input = require('./inputs.json').day12;

// console.log(part1(input));
console.log(part2(input));
