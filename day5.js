const _ = require('lodash');

const createSeat = (row, column) => ({ row, column, id: row * 8 + column });

const decodeSeat = seatCode => {
  const rowCode = seatCode.slice(0, 7);
  const columnCode = seatCode.slice(7);
  /* codes are basically binaries with letters instead of digits, just parse them in base 2 */
  const row = parseInt(rowCode.replace(/F/g, '0').replace(/B/g, '1'), 2);
  const column = parseInt(columnCode.replace(/L/g, '0').replace(/R/g, '1'), 2);
  return createSeat(row, column);
};

const part1 = seatCodes => {
  const decodedSeats = seatCodes.map(seatCode => decodeSeat(seatCode));
  return Math.max(...decodedSeats.map(seat => seat.id));
};

const part2 = seatCodes => {
  const decodedSeats = seatCodes.map(seatCode => decodeSeat(seatCode));
  const seatGroups = _.groupBy(decodedSeats, 'row');
  const openGroupSeatIds = Object.values(seatGroups)
    .find(seats => seats.length === 7)
    .map(seat => seat.id)
    .sort();
  for (let i = openGroupSeatIds[0]; i < _.last(openGroupSeatIds); i++) {
    if (!openGroupSeatIds.includes(i)) return i;
  }
};

module.exports = { part1, part2 };
