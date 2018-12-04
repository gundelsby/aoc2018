const fs = require("fs");
const input = fs.readFileSync("data/03-input.txt", "utf-8").split("\r\n");

// #1280 @ 916,11: 4x19
const reCmd = /^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+).*$/;
const claimMap = buildClaimMap(input);
const grid = createGrid(claimMap);

console.log(countDoubleBooked());
console.log(findUniqueClaim());

function findUniqueClaim() {
  const unique = Object.keys(claimMap).filter((id) => {
    const { pos, dim } = claimMap[id];
    const xBound = pos.x + dim.width;
    const yBound = pos.y + dim.height;

    for (let x = pos.x; x < xBound; x++) {
      for (let y = pos.y; y < yBound; y++) {
        if (grid[x][y] > 1) {
          return false;
        }
      }
    }

    return true;
  })[0];

  return unique;
}

function countDoubleBooked() {
  return grid.reduce((count, x) => {
    return (
      count +
      x.reduce((doubleCount, y) => {
        return doubleCount + (y > 1 ? 1 : 0);
      }, 0)
    );
  }, 0);
}

function createGrid(claimMap) {
  const grid = [];

  Object.keys(claimMap).forEach((id) => {
    const { pos, dim } = claimMap[id];
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

  return grid;
}

function buildClaimMap(claims) {
  const cmdMap = {};

  claims
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
