const fs = require('fs');
const input = fs.readFileSync('data/18-input.txt', 'utf-8').split(/\r?\n/);
// const input = fs.readFileSync('data/18-example.txt', 'utf-8').split(/\r?\n/);
const SQUARE = {
  TREE: '|',
  OPEN: '.',
  LUMBERYARD: '#'
};

const map = buildMap(input);
const result = runSimulation(map, 10);
const counts = countTypes(result);
console.log(counts);
console.log(`[1]: ${counts[SQUARE.TREE] * counts[SQUARE.LUMBERYARD]}`);

part2(map);

// cycles are 28 ticks long
// array.shift removes first item, array.push adds to back
// when diff === array.shift && i > 400 assume repeat cycle and calculate remaining steps rather than simulate
function part2(map) {
  let score;
  for (let i = 0; i < 449; i++) {
    map = runSimulation(map, 1);
    const counts = countTypes(map);
    const newScore = counts[SQUARE.TREE] * counts[SQUARE.LUMBERYARD];
    const diff = newScore - score;
    console.log(i, diff);
    score = newScore;
  }
}

function countTypes(map) {
  const acres = [];
  map.forEach((arr) => acres.push(...arr));
  return acres.reduce((r, acre) => {
    switch (acre) {
      case SQUARE.TREE:
        r[SQUARE.TREE] = r[SQUARE.TREE] ? r[SQUARE.TREE] + 1 : 1;
        return r;
      case SQUARE.LUMBERYARD:
        r[SQUARE.LUMBERYARD] = r[SQUARE.LUMBERYARD] ? r[SQUARE.LUMBERYARD] + 1 : 1;
        return r;
      case SQUARE.OPEN:
        r[SQUARE.OPEN] = r[SQUARE.OPEN] ? r[SQUARE.OPEN] + 1 : 1;
        return r;
    }
  }, {});
}

function runSimulation(map, ticks) {
  let result = createEmptyMap(map.length, map[0].length);

  for (let i = 0; i < ticks; i++) {
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        const value = map[x][y];
        const neighbors = countNeighbors(map, x, y);
        switch (value) {
          case SQUARE.OPEN:
            // An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.
            result[x][y] = neighbors[SQUARE.TREE] > 2 ? SQUARE.TREE : value;
            break;
          case SQUARE.TREE:
            // An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards. Otherwise, nothing happens.
            result[x][y] = neighbors[SQUARE.LUMBERYARD] > 2 ? SQUARE.LUMBERYARD : value;
            break;
          case '#':
            // An acre containing a lumberyard will remain a lumberyard if it was adjacent to at least one other lumberyard and at least one acre containing trees. Otherwise, it becomes open.
            result[x][y] =
              neighbors[SQUARE.LUMBERYARD] && neighbors[SQUARE.TREE]
                ? SQUARE.LUMBERYARD
                : SQUARE.OPEN;
            break;
        }
      }
    }
    map = result.map((arr) => arr.slice());
  }

  return result;
}

function countNeighbors(map, targetX, targetY) {
  const count = {};
  const xBound = map.length - 1;
  const yBound = map[0].length - 1;

  for (let x = targetX - 1; x < targetX + 2; x++) {
    for (let y = targetY - 1; y < targetY + 2; y++) {
      if ((x !== targetX || y !== targetY) && inRange(x, 0, xBound) && inRange(y, 0, yBound)) {
        const value = map[x][y];
        count[value] = count[value] ? count[value] + 1 : 1;
      }
    }
  }

  return count;
}

function inRange(value, min, max) {
  return value >= min && value <= max;
}

function createEmptyMap(width, height) {
  const map = new Array(width);
  for (let i = 0; i < map.length; i++) {
    map[i] = new Array(height);
  }

  return map;
}

function buildMap(data) {
  const map = createEmptyMap(data[0].length, data.length);

  data.forEach((row, y) => {
    row.split('').forEach((acre, x) => {
      map[x][y] = acre;
    });
  });

  return map;
}
