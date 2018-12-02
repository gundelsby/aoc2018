const fs = require("fs");
const input = fs.readFileSync("data/02-input.txt", "utf-8").split("\r\n");

function calcChecksum(boxIds) {
  let dupesFound = 0;
  let tripsFound = 0;

  boxIds.forEach((boxId) => {
    const charCounts = {};
    let dupeFound = false;
    Array.from(boxId).forEach((char) => {
      charCounts[char] = charCounts[char] ? charCounts[char] + 1 : 1;
    });
    if (Object.values(charCounts).includes(2)) {
      dupesFound++;
    }
    if (Object.values(charCounts).includes(3)) {
      tripsFound++;
    }
  });

  return dupesFound * tripsFound;
}

function isAdjacent(a, b) {
  let diffCount = 0;
  for (let i = 0; i < a.length && diffCount < 2; i++) {
    if (a[i] !== b[i]) {
      diffCount++;
    }
  }

  return diffCount < 2;
}

function findAdjacentBoxes(boxIds) {
  boxIds.sort();
  for (let i = 0; i < boxIds.length - 1; i++) {
    if (isAdjacent(boxIds[i], boxIds[i + 1])) {
      return Array.from(boxIds[i])
        .filter((char, index) => {
          return char === boxIds[i + 1][index];
        })
        .join("");
    }
  }

  return "not found";
}

console.log("checksum", calcChecksum(input));
console.log("undiffed", findAdjacentBoxes(input));
