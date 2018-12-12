const fs = require('fs');
const input = fs
  .readFileSync('data/12-input.txt', 'utf-8')
  // .readFileSync('data/12-example.txt', 'utf-8')
  .split('\n')
  .map((line) => line.trim());

const initialState = parseInitialState(input[0]);
const ruleSet = createRuleSet(input.slice(2));

console.log(`[1]:`, calcPotSum(runSimulation(initialState, ruleSet, 20)));
// console.log(`[2]:`, calcPotSum(runSimulation(initialState, ruleSet, 50000000000)));

function calcPotSum ({state, addedLeft}) {
  return state.split('').reduce((sum, pot, index) => {
    const value = pot === '#' ? index - addedLeft : 0;
    return sum + value;
  }, 0)
}

function runSimulation (state, ruleSet, generationCount) {
  const padPots = '....';
  
  for (let i = 0; i < generationCount; i++) {
    state = padPots + state + padPots; // add empty pots to the sides for proper rule eval
    state = applyRules(state, ruleSet);
  }

  return {
    state,
    addedLeft: padPots.length * generationCount
  };
}

function applyRules (state, ruleSet) {
  const newState = ['.','.']; // just to not fuck up the padding calc

  for (let i = 2; i < state.length - 2; i++) {
    const sequence = state.substring(i-2, i+3);
    const newValue = ruleSet.reduce((value, current) => {
      return current.pattern === sequence ? current.value : value
    }, '.')
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
