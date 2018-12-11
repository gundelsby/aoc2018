const fs = require('fs');
const points = fs
  .readFileSync('data/10-input.txt', 'utf-8')
  // .readFileSync('data/10-example.txt', 'utf-8')
  .split('\n')
  .map((line) => line.trim())
  .map(parseLine);

const startTime = 10459;
const endTime = 10459;
const snapshots = createSnapshots(points, startTime, endTime);

snapshots.forEach((snapshot) => {
  console.log(`\n\n@${snapshot.seconds} seconds:`);
  drawGrid(snapshot.points);
});

function drawGrid(points) {
  const { maxX, minX, maxY, minY } = getGridBounds(points);
  const gridWidth = Math.abs(maxX - minX) + 1;
  const gridHeight = Math.abs(maxY - minY) + 1;
  const grid = createGrid(gridWidth, gridHeight);

  if (gridHeight > 10) {
    return;
  }

  console.log(
    `Drawing grid with dimensions: ${gridWidth}x${gridHeight} (${gridWidth * gridHeight} points)`
  );

  points.forEach(({ pos }) => {
    const x = pos.x - minX;
    const y = pos.y - minY;
    if (!grid[y] || !grid[y][x]) {
      console.log('OOB', x, y);
    }
    grid[y][x] = '#';
  });

  console.log(grid.join('\n'));
}

function createGrid(width, height) {
  const grid = [];
  for (let i = 0; i < height; i++) {
    grid.push(new Array(width).fill('.'));
  }

  return grid;
}

function calcSnapshot(points, runTime) {
  return points.map(({ pos, vel }) => {
    return {
      pos: {
        x: pos.x + vel.x * runTime,
        y: pos.y + vel.y * runTime
      }
    };
  });
}

function createSnapshots(points, startTime, endTime) {
  const snapshots = [];

  for (let i = startTime; i <= endTime; i++) {
    snapshots.push({
      points: calcSnapshot(points, i),
      seconds: i
    });
  }

  return snapshots;
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
