const gridSerial = 2568;
const gridDimension = 300; // grid is quadratic

const cells = preCalcCells(gridSerial, gridDimension);

console.log('Most powerful 3x3:', findMostPowerfulFixedSquare(gridSerial, gridDimension, 3, cells));
console.log('Most powerful, any size:', findMostPowerfulSquare(gridSerial, gridDimension, cells));

function findMostPowerfulSquare(serial, gridDimension, cells) {
  let largestSquare;

  for (let i = gridDimension; i > 0; i--) {
    const square = findMostPowerfulFixedSquare(serial, gridDimension, i, cells);
    if (!largestSquare || square.powerLevel > largestSquare.powerLevel) {
      largestSquare = { ...square, size: i };
    }
  }

  return largestSquare;
}

function findMostPowerfulFixedSquare(serial, gridDimension, squareDimension, cells) {
  const bound = gridDimension - squareDimension + 1;
  let largestSquare;

  for (let x = 1; x <= bound; x++) {
    for (let y = 1; y <= bound; y++) {
      const powerLevel = calcSquarePowerLevel(x, y, squareDimension, cells);
      if (!largestSquare || powerLevel > largestSquare.powerLevel) {
        largestSquare = { x, y, powerLevel };
      }
    }
  }

  return largestSquare;
}

function calcSquarePowerLevel(x, y, size, cells) {
  let powerLevel = 0;

  for (let i = x; i < x + size; i++) {
    for (let j = y; j < y + size; j++) {
      powerLevel += cells[i][j];
    }
  }

  return powerLevel;
}

function preCalcCells(gridSerial, gridDimension) {
  const powerLevels = {};

  for (let x = 1; x <= gridDimension; x++) {
    powerLevels[x] = {};
    for (let y = 1; y <= gridDimension; y++) {
      powerLevels[x][y] = calcCellPowerLevel(x, y, gridSerial);
    }
  }

  return powerLevels;
}

function calcCellPowerLevel(x, y, serial) {
  const rackId = x + 10;
  let powerLevel = rackId * y;

  powerLevel += serial;
  powerLevel *= rackId;
  powerLevel = powerLevel > 99 ? Number(powerLevel.toString(10).slice(-3, -2)) : 0;

  return powerLevel - 5;
}
