const fs = require('fs');
const input = fs
  .readFileSync('data/12-input.txt', 'utf-8')
  // .readFileSync('data/12-example.txt', 'utf-8')
  .split('\n')
  .map((line) => line.trim());

const initialState = parseInitialState(input[0]);
const ruleSet = createRuleSet(input.slice(2));

console.log(`[1]:`, calcPotSum(runSimulation(initialState, ruleSet, 20)[20]));

const diffs = runSimulation(initialState, ruleSet, 170)
  .map(calcPotSum)
  .map((score, index, arr) => {
    if (!arr[index - 1]) {
      return score;
    }

    return Math.abs(score - arr[index - 1]);
  });

console.log(diffs.map((diff, index) => `${index}: ${diff}`).slice(-5));

// all generations after 168 increases with 75 plants;

const calcTarget = 50000000000; // number of generations to calculate for
const lastUnique = 168;

const score =
  calcPotSum(runSimulation(initialState, ruleSet, lastUnique)[lastUnique]) +
  75 * (calcTarget - lastUnique);

console.log('[2]:', score);

function calcPotSum({ state, addedLeft }) {
  return state.split('').reduce((sum, pot, index) => {
    const value = pot === '#' ? index - addedLeft : 0;
    return sum + value;
  }, 0);
}

function runSimulation(state, ruleSet, generationCount) {
  const states = [{ state, addedLeft: 0 }];
  const padPots = '....';

  for (let i = 0; i < generationCount; i++) {
    let addedLeft = states[i].addedLeft;

    const padSize = 4 - state.indexOf('#');
    if (padSize > 0) {
      state = padPots.slice(-padSize) + state;
      addedLeft += padSize;
    }
    state = state.padEnd(state.lastIndexOf('#') + 4, '.');

    state = applyRules(state, ruleSet);
    states.push({
      state,
      addedLeft
    });
  }

  return states;
}

function applyRules(state, ruleSet) {
  const newState = ['.', '.'];

  for (let i = 2; i < state.length - 2; i++) {
    const sequence = state.substring(i - 2, i + 3);
    const newValue = ruleSet.reduce((value, current) => {
      return current.pattern === sequence ? current.value : value;
    }, '.');
    newState.push(newValue);
  }

  return newState.join('');
}

function parseInitialState(input) {
  return input.replace('initial state: ', '').trim();
}

function createRuleSet(rules) {
  const reRule = /^([.#]{5}).{4}(\.|#)/;
  return rules
    .filter((rule) => !!rule)
    .map((rule) => {
      const parts = reRule.exec(rule);

      return {
        pattern: parts[1],
        value: parts[2]
      };
    });
}
