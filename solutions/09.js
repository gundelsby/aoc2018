const playerCount = 411;
const highestValue = 72059;

console.log(
  `Winning score for ${playerCount} players with highest marble ${highestValue}: ${findWinningScore(
    playerCount,
    highestValue
  )}`
);

console.log(
  `Winning score for ${playerCount} players with highest marble ${highestValue *
    100}: ${findWinningScore(playerCount, highestValue * 100)}`
);

function findWinningScore(playerCount, highestValue) {
  const scores = new Array(playerCount);
  scores.fill(0);

  let currentValue = 0;
  let currentPlayer = 0;
  let currentMarble = { value: currentValue };
  currentMarble.prev = currentMarble.next = currentMarble;
  const firstMarble = currentMarble;

  while (currentValue < highestValue) {
    currentValue++;

    if (currentValue % 23 === 0) {
      const removed = currentMarble.prev.prev.prev.prev.prev.prev.prev;
      removed.next.prev = removed.prev;
      removed.prev.next = removed.next;
      scores[currentPlayer] =
        (scores[currentPlayer] ? scores[currentPlayer] : 0) + currentValue + removed.value;
      currentMarble = removed.next;
    } else {
      // Then, each Elf takes a turn placing the lowest-numbered remaining marble into the circle between the marbles that are 1 and 2 marbles clockwise of the current marble. (When the circle is large enough, this means that there is one marble between the marble that was just placed and the current marble.) The marble that was just placed then becomes the current marble.
      const before = currentMarble.next;
      const after = currentMarble.next.next;
      currentMarble = { value: currentValue, prev: before, next: after };
      before.next = currentMarble;
      after.prev = currentMarble;
    }

    currentPlayer = currentPlayer + 1 < playerCount ? currentPlayer + 1 : 0;
  }

  return scores.reduce((highest, current) => {
    return current > highest ? current : highest;
  }, 0);
}
