const fs = require('fs');
const input = fs.readFileSync('data/07-input.txt', 'utf-8').split('\n');
const reLine = /^Step (\w) must be finished before step (\w) can begin.*$/;

const steps = {};

input.forEach((line) => {
  const parts = reLine.exec(line);
  const step = parts[2];
  const req = parts[1];

  steps[step] = steps[step] || new Set();
  steps[req] = steps[req] || new Set();
  steps[step].add(req);
});

const order = resolveExecutionOrder(steps);
console.log('1:', order.length, order.join(''));

function resolveExecutionOrder(steps) {
  let remainingKeys = Object.keys(steps);
  const executed = [];

  while (remainingKeys.length) {
    const steptoExecute = remainingKeys.filter((name) => steps[name].size === 0).sort()[0];

    executed.push(steptoExecute);
    removeRequirement(steps, steptoExecute);
    delete steps[steptoExecute];

    remainingKeys = Object.keys(steps);
  }

  return executed;
}

function removeRequirement(steps, req) {
  Object.keys(steps).forEach((name) => {
    steps[name].delete(req);
  });
}
