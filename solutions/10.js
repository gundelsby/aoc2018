const fs = require('fs');
const points = fs
  .readFileSync('data/10-input.txt', 'utf-8')
  .split('\n')
  .map((line) => line.trim())
  .map(parseLine);

const result = findMessage(points);
console.log(result.seconds);
drawGrid(result.points);

function drawGrid(points) {
  const { maxX, minX, maxY, minY } = getGridBounds(points);
  const gridWidth = Math.abs(maxX) + Math.abs(minX);
  const gridHeight = Math.abs(maxY) + Math.abs(minY);
  const grid = new Array(gridWidth).fill(new Array(gridHeight).fill('.'));

  console.log(`Drawing grid with dimensions: ${gridWidth}x${gridHeight}`);

  result.points.forEach(({ pos }) => {
    const x = pos.x + Math.abs(minX) - 1;
    const y = pos.y + Math.abs(minY) - 1;
    if (!grid[x] || !grid[x][y]) {
      console.log('OOB', x, y);
    }
    grid[x][y] = '#';
  });

  grid.forEach((row) => {
    console.log(row.join(''));
  });
}

function findMessage(points) {
  let gridSize;
  let oldGridSize;
  let oldPoints;
  let seconds = 0;

  do {
    oldGridSize = calcGridSize(points);
    oldPoints = points.map(({ pos, vel }) => {
      return { pos: Object.assign({}, pos), vel: Object.assign({}, vel) };
    });

    seconds++;
    points = points.map(({ pos, vel }) => {
      return {
        pos: {
          x: pos.x + vel.x,
          y: pos.y + vel.y
        },
        vel
      };
    });
    gridSize = calcGridSize(points);
  } while (gridSize < oldGridSize);

  return {
    points: oldPoints,
    seconds: seconds - 1
  };
}

function calcGridSize(points) {
  const { maxX, minX, maxY, minY } = getGridBounds(points);

  return (maxX - minX) * (maxY - minY);
}

function getGridBounds(points) {
  return points.reduce(
    (result, { pos }) => {
      return {
        maxX: Math.max(result.maxX, pos.x),
        minX: Math.min(result.minX, pos.x),
        maxY: Math.max(result.maxY, pos.y),
        minY: Math.min(result.minY, pos.y)
      };
    },
    {
      maxX: Number.MIN_SAFE_INTEGER,
      minX: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER
    }
  );
}

function parseLine(line) {
  const reLine = /^position=<\s?(-?\d+),\s+(-?\d+)> velocity=<\s?(-?\d+),\s+(-?\d+)>/;
  const parts = reLine.exec(line);

  return {
    pos: {
      x: Number(parts[1]),
      y: Number(parts[2])
    },
    vel: {
      x: Number(parts[3]),
      y: Number(parts[4])
    }
  };
}
