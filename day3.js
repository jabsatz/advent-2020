const checkSlope = (rows, right, down) => {
  const positions = rows.filter((_, i) => i % down === 0).map((row, i) => (i * right) % row.length);
  const positionsWithTrees = positions.filter((j, i) => rows[i * down][j] === '#');
  return positionsWithTrees.length;
};

const part1 = plan => {
  const rows = plan.split('\n');
  return checkSlope(rows, 3, 1);
};

const part2 = plan => {
  const rows = plan.split('\n');
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];
  const treesInSlopes = slopes.map(([right, down]) => checkSlope(rows, right, down));
  return treesInSlopes.reduce((prev, curr) => prev * curr, 1);
};

module.exports = { part1, part2 };
