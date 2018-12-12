const fs = require('fs');
const input = fs
  .readFileSync('data/12-input.txt', 'utf-8')
  .split('\n')
  .map((line) => line.trim());

console.log(buildInitialState(input[0]));
console.log(parseRuleSet(input.slice(2)));

// initial state: #......##...#.#.###.#.##..##.#.....##....#.#.##.##.#..#.##........####.###.###.##..#....#...###.##
function buildInitialState(input) {
  input = input.replace('initial state: ', '');
}

function parseRuleSet(rules) {
  return rules
    .filter((line) => !!line)
    .map((line) => {
      return line;
    });
}
