const fs = require("fs");
const input = fs.readFileSync("data/03-input.txt", "utf-8").split("\r\n");

// #1280 @ 916,11: 4x19
const reCmd = /^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+).*$/;

console.log(countDoubleBooked(input));

function countDoubleBooked(commands) {
  const cmdMap = createCommandMap(commands);
  const grid = [];

  Object.keys(cmdMap).forEach((id) => {
    const { pos, dim } = cmdMap[id];
    const xBound = pos.x + dim.width;
    const yBound = pos.y + dim.height;
    for (let x = pos.x; x < xBound; x++) {
      for (let y = pos.y; y < yBound; y++) {
        if (!grid[x]) {
          grid[x] = [];
        }
        grid[x][y] = grid[x] && grid[x][y] ? grid[x][y] + 1 : 1;
      }
    }
  });

  return grid.reduce((count, x) => {
    return (
      count +
      x.reduce((doubleCount, y) => {
        return doubleCount + (y > 1 ? 1 : 0);
      }, 0)
    );
  }, 0);
}

function createCommandMap(commands) {
  const cmdMap = {};

  commands
    .map(parseCommandString)
    .filter((obj) => obj !== null)
    .forEach(({ id, x, y, width, height }) => {
      cmdMap[id] = {
        pos: { x, y },
        dim: { width, height }
      };
    });

  return cmdMap;
}

function parseCommandString(cmdString) {
  const parts = reCmd.exec(cmdString);

  return parts
    ? {
        id: parts[1],
        x: Number(parts[2]),
        y: Number(parts[3]),
        width: Number(parts[4]),
        height: Number(parts[5])
      }
    : null;
}
