const fs = require("fs");
const input = fs.readFileSync("data/04-input.txt", "utf-8").split("\n");

const guards = {};

parseInput();

function parseInput() {
  const reLogLine = /^\[(\d+-\d+-\d+ \d+:\d+)\]\s(.*)$/;
  // [1518-07-12 00:49] falls asleep
  // [1518-10-27 00:45] falls asleep
  // [1518-07-04 23:59] Guard #1171 begins shift
  // [1518-09-21 00:56] wakes up
  // [1518-08-16 00:41] falls asleep
  // Timestamps are written using year-month-day hour:minute format.
  // The guard falling asleep or waking up is always the one whose shift most recently started.
  // Because all asleep/awake times are during the midnight hour (00:00 - 00:59),
  // only the minute portion (00 - 59) is relevant for those events.
  input
    .map((logLine) => {
      const parts = reLogLine.exec(logLine);

      return {
        timestamp: new Date(parts[1]),
        entry: parts[2]
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(console.log);
}
