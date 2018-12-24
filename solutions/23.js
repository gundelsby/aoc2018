const fs = require('fs');
const input = fs.readFileSync('data/23-input.txt', 'utf-8').split(/\r?\n/);

const bots = parseInput(input);

console.log('[1]:', solveP1(bots));

function solveP1(bots) {
  const biggest = bots.sort((a, b) => b.radius - a.radius)[0]; // want biggest, so order is biggest -> smallest
  return bots.filter((bot) => {
    return calcManhattanDistance(biggest.position, bot.position) <= biggest.radius;
  }).length;
}

function calcDistance(a, b) {
  const sorted = [a, b].sort();

  return Math.abs(sorted[1] - sorted[0]);
}

function calcManhattanDistance(a, b) {
  return calcDistance(a.x, b.x) + calcDistance(a.y, b.y) + calcDistance(a.z, b.z);
}

function parseInput(input) {
  const reLine = /^pos=<([-]?\d+),([-]?\d+),([-]?\d+)>, r=(\d+)/;
  return input.map((line) => {
    const parts = reLine.exec(line);
    return {
      radius: parts[4],
      position: {
        x: parts[1],
        y: parts[2],
        z: parts[3]
      }
    };
  });
}
