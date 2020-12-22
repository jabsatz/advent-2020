const _ = require('lodash');

const parse = input =>
  input
    .split('\n\n')
    .map(player => player.split('\n').flatMap(line => (line.startsWith('Player') ? [] : [Number(line)])));

const play = decks => {
  const [p1Card, p2Card] = decks.map(_.head);

  let newDecks = decks.map(_.tail);
  if (p1Card > p2Card) newDecks[0] = [...newDecks[0], p1Card, p2Card];
  else if (p2Card > p1Card) newDecks[1] = [...newDecks[1], p2Card, p1Card];

  if (newDecks.some(deck => deck.length === 0)) return newDecks;

  return play(newDecks);
};

const part1 = input => {
  const decks = parse(input);
  const finalDecks = play(decks);
  return finalDecks.find(deck => deck.length > 0).reduce((prev, card, pos, arr) => prev + card * (arr.length - pos), 0);
};

const playRecursive = (_decks, previousConfigurations = new Set()) => {
  let decks = [..._decks];

  while (!decks.some(deck => deck.length === 0)) {
    const configKey = decks.map(deck => deck.join(',')).join('#');
    if (previousConfigurations.has(configKey)) {
      return { decks, winner: 0 };
    }
    previousConfigurations.add(configKey);
    const playedCards = decks.map(_.head);
    let newDecks = decks.map(_.tail);
    let winner;
    if (playedCards.every((card, i) => card <= newDecks[i].length)) {
      const recursiveDecks = newDecks.map((deck, i) => deck.slice(0, playedCards[i]));
      const subGameResult = playRecursive(recursiveDecks);
      winner = subGameResult.winner;
    } else {
      winner = playedCards[0] > playedCards[1] ? 0 : 1;
    }
    const loser = winner === 1 ? 0 : 1;
    newDecks[winner] = [...newDecks[winner], playedCards[winner], playedCards[loser]];

    decks = newDecks;
  }

  const winner = decks.findIndex(d => d.length > 0);
  return { winner, decks };
};

const part2 = input => {
  const decks = parse(input);
  const { winner, decks: finalDecks } = playRecursive(decks);
  return finalDecks[winner].reduce((prev, card, pos, arr) => prev + card * (arr.length - pos), 0);
};

module.exports = { part1, part2 };
