const fs = require('fs');
const input = fs.readFileSync('data/04-input.txt', 'utf-8').split('\n');

const actionMap = {
  BEGINS_SHIFT: 'begins shift',
  FALLS_ASLEEP: 'falls asleep',
  WAKES_UP: 'wakes up'
};

const log = parseInput();

const guards = analyzeLog(log);

const lazy = findLazy(guards);
const laziestMinute = guards[lazy].indexOf(Math.max(...guards[lazy]));

console.log(
  `Biggest sleeper is ${lazy}, most frequently asleep at 00:${laziestMinute}. Result: ${lazy *
    laziestMinute}`
);

const predictable = findPredictable(guards);
const mostFrequentMinute = guards[predictable].indexOf(Math.max(...guards[predictable]));

console.log(
  `Most predictable sleeper is ${predictable}, most frequently asleep at 00:${mostFrequentMinute}. Result: ${predictable *
    mostFrequentMinute}`
);

function findPredictable(guards) {
  return Object.keys(guards).reduce((predictable, current) => {
    return Math.max(...guards[current]) > Math.max(...guards[predictable]) ? current : predictable;
  });
}

function findLazy(guards) {
  return Object.keys(guards).reduce((laziest, current) => {
    return guards[current].reduce((sum, current) => sum + current) >
      guards[laziest].reduce((sum, current) => sum + current)
      ? current
      : laziest;
  });
}

function analyzeLog(log) {
  const guards = {};

  let guardOnDuty;
  let lastAction;
  let delta;

  log.forEach((logItem, idx) => {
    switch (logItem.action) {
      case actionMap.BEGINS_SHIFT:
        if (lastAction === actionMap.FALLS_ASLEEP) {
          guards[guardOnDuty] = recordSleep(
            guards[guardOnDuty],
            lastAction.timestamp.getMinutes(),
            60
          );
        }
        guardOnDuty = logItem.guard;
        break;
      case actionMap.WAKES_UP:
        if (!guardOnDuty) {
          console.log(`[${idx}] Wake up with no guard on duty:`, logItem);
          break;
        }
        guards[guardOnDuty] = recordSleep(
          guards[guardOnDuty],
          lastAction.timestamp.getMinutes(),
          logItem.timestamp.getMinutes()
        );
        break;
    }
    lastAction = logItem;
  });

  return guards;
}

function recordSleep(record, start, end) {
  record = record || new Array(60).fill(0);
  for (let i = start; i < end; i++) {
    record[i] += 1;
  }

  return record;
}

function parseInput() {
  const reLogLine = /^\[(\d+-\d+-\d+ \d+:\d+)\]\s(.*)$/;
  const reGuardId = /#(\d+)/;

  return input
    .sort()
    .map((logLine) => {
      const parts = reLogLine.exec(logLine);

      return {
        timestamp: new Date(parts[1]),
        entry: parts[2]
      };
    })
    .map((logItem) => {
      const parts = reGuardId.exec(logItem.entry);
      if (parts) {
        logItem.guard = parts[1];
      }
      Object.keys(actionMap).forEach((action) => {
        if (logItem.entry.indexOf(actionMap[action]) > -1) {
          logItem.action = actionMap[action];
        }
      });

      return logItem;
    })
    .map((logItem) => {
      if (logItem.timestamp.getHours() === 23) {
        logItem.timestamp.setMinutes(0);
        logItem.timestamp.setHours(24);
      }

      return logItem;
    });
}
