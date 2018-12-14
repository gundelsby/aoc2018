const input = '084601';

let elves = [0, 1];
const scoreboard = [3, 7];

console.log('[1]:', calcPart1(elves.slice(), scoreboard.slice(), Number.parseInt(input, 10)));
console.log('[2]:', calcPart2(elves.slice(), scoreboard.slice(), input));

function calcPart1(elves, scoreboard, practiceRecipesCount) {
  while (scoreboard.length < practiceRecipesCount + 10) {
    const newScore = elves.reduce((sum, position) => {
      return sum + scoreboard[position];
    }, 0);

    new String(newScore)
      .split('')
      .map(Number)
      .forEach((digit) => scoreboard.push(digit));

    elves = elves.map((elf) => (1 + scoreboard[elf] + elf) % scoreboard.length);
  }

  return scoreboard.slice(-10).join('');
}

function calcPart2(elves, scoreboard, targetSequence) {
  while (
    scoreboard.length < targetSequence.length ||
    scoreboard.slice(-targetSequence.length).join('') !== targetSequence
  ) {
    const newScore = elves.reduce((sum, position) => {
      return sum + scoreboard[position];
    }, 0);

    new String(newScore)
      .split('')
      .map(Number)
      .forEach((digit) => scoreboard.push(digit));

    elves = elves.map((elf) => (1 + scoreboard[elf] + elf) % scoreboard.length);
  }

  return scoreboard.slice(0, -targetSequence.length).length;
}
