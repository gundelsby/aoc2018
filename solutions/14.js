const input = '084601';

let elves = [0, 1];
const scoreboard = '37';

console.log('[1]:', calcPart1(elves.slice(), scoreboard, Number.parseInt(input, 10), 10));
console.log('[2]:', calcPart2(elves.slice(), scoreboard, input));
// console.log('[2]:', calcPart2(elves.slice(), scoreboard, '51589'));
// console.log('[2]:', calcPart2(elves.slice(), scoreboard, '01245'));
// console.log('[2]:', calcPart2(elves.slice(), scoreboard, '92510'));
// console.log('[2]:', calcPart2(elves.slice(), scoreboard, '59414'));

function calcPart1(elves, scoreboard, practiceRecipesCount, wantedRecipes) {
  while (scoreboard.length < practiceRecipesCount + wantedRecipes) {
    const newScore = elves.reduce((sum, position) => {
      return sum + Number(scoreboard[position]);
    }, 0);

    scoreboard = scoreboard.concat(newScore);

    elves = elves.map((elf) => (1 + Number(scoreboard[elf]) + elf) % scoreboard.length);
  }

  return scoreboard.slice(-wantedRecipes);
}

function calcPart2(elves, scoreboard, targetSequence) {
  while (scoreboard.length < 21000000) {
    const newScore = elves.reduce((sum, position) => {
      return sum + Number(scoreboard[position]);
    }, 0);
    scoreboard = scoreboard.concat(newScore);
    elves = elves.map((elf) => (1 + Number(scoreboard[elf]) + elf) % scoreboard.length);
  }

  const targetAt = scoreboard.indexOf(targetSequence);
  if (targetAt) {
    return scoreboard.slice(0, targetAt).length;
  }

  return `Unable to find ${targetSequence} in ${scoreboard}`;
}
