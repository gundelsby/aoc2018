const fs = require("fs");
const input = fs.readFileSync("data/01-input-1.txt", "utf-8").split("\n");
let firstRepeated;

const frequency = input.reduce((freq, current) => {
  return freq + Number(current);
}, 0);

console.log(`frequency: ${frequency}`);
