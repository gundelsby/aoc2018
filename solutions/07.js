const fs = require('fs');
const input = fs.readFileSync('data/07-input.txt', 'utf-8').split('\n');
const reLine = /^Step (\w) must be finished before step (\w) can begin.*$/;

console.log('1:', resolveExecutionOrder(parseSteps(input)).join(''));
console.log('2:', calcProductionTime(parseSteps(input)));

function createJob(name, callback) {
  let remainingCost = name.charCodeAt(0) - 4; // cost = ASCII value - 4
  return {
    tick: () => {
      remainingCost--;
      if (remainingCost === 0) {
        callback();
      }
    }
  };
}

function calcProductionTime(steps) {
  let remainingSteps = Object.keys(steps);
  let secondsElapsed = 0;
  const runningJobs = {};

  while (remainingSteps.length || runningJobs.length > 0) {
    const stepstoExecute = remainingSteps
      .filter((name) => !runningJobs[name])
      .filter((name) => steps[name].size === 0)
      .sort()
      .forEach((step) => {
        runningJobs[step] = createJob(step, () => {
          removeRequirement(steps, step);
          delete runningJobs[step];
          delete steps[step];
        });
      });

    Object.keys(runningJobs).forEach((job) => runningJobs[job].tick());
    secondsElapsed++;

    remainingSteps = Object.keys(steps);
  }

  return secondsElapsed;
}

function parseSteps(input) {
  const steps = {};

  input.forEach((line) => {
    const parts = reLine.exec(line);
    const step = parts[2];
    const req = parts[1];

    steps[step] = steps[step] || new Set();
    steps[req] = steps[req] || new Set();
    steps[step].add(req);
  });

  return steps;
}

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
