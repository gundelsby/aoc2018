const fs = require('fs');
const input = fs.readFileSync('data/04-input.txt', 'utf-8').split('\n');

const actionMap = {
  BEGINS_SHIFT: 'begins shift',
  FALLS_ASLEEP: 'falls asleep',
  WAKES_UP: 'wakes up'
};

const log = parseInput();
log.sort((a, b) => a.timestamp - b.timestamp);

const guards = {};

let guardOnDuty;
let lastAction;
let delta;

log.forEach((logItem) => {
  if (logItem.action === actionMap.BEGINS_SHIFT) {
    guardOnDuty = logItem.guard;
  }
});

function parseInput() {
  const reLogLine = /^\[(\d+-\d+-\d+ \d+:\d+)\]\s(.*)$/;
  const reGuardId = /#(\d+)/;

  return input
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
      if (logItem.action === actionMap.BEGINS_SHIFT) {
        logItem.timestamp.setUTCMinutes(0);

        if (logItem.timestamp.getUTCHours() === 23) {
          logItem.timestamp.setUTCHours(24);
        }
      }

      return logItem;
    });
}
