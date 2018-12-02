const fs = require("fs");
const input = fs.readFileSync("data/02-input.txt", "utf-8").split("\n");

function calcChecksum() {
  let dupesFound = 0;
  let tripsFound = 0;

  input.forEach((boxId) => {
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
console.log(calcChecksum());
