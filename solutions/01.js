const fs = require("fs");
const input = fs.readFileSync("data/01-input-1.txt", "utf-8").split("\n");
const freqHistory = new Set();
let foundDuplicate = false;
let frequency = 0;

// Part 1
// const frequency = input.reduce((freq, current) => {
//   return freq + Number(current);
// }, 0);

while (!foundDuplicate) {
  for (let i = 0; i < input.length; i++) {
    frequency += Number(input[i]);

    if (freqHistory.has(frequency)) {
      foundDuplicate = true;
      break;
    } else {
      freqHistory.add(frequency);
    }
  }
}

console.log(`frequency: ${frequency}`);
