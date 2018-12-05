const fs = require("fs");
const input = fs.readFileSync("data/05-input.txt", "utf-8").trim();

console.log('p1:', reducePolymer(Array.from(input)).length);
console.log('p2:', minimizePolymer(input).length);

function minimizePolymer (polymerString) {
  const sequence = Array.from(polymerString);
  const charsUsed = new Set(Array.from(polymerString.toUpperCase()));
  let smallest;

  charsUsed.forEach((charToRemove) => {
    const filtered = sequence.filter(char => char.toUpperCase() !== charToRemove);
    const reduced = reducePolymer(filtered);

    if (!smallest || smallest.length > reduced.length) {
      smallest = reduced;
    }
  })

  return smallest;
}

function reducePolymer (sequence) {
  let seqLength;
  do {
    seqLength = sequence.length;
    sequence = removeFirstOpposites(sequence);
  } while (seqLength !== sequence.length)

  return sequence;
}

function removeFirstOpposites (sequence) {
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i + 1] && sequence[i] !== sequence[i + 1] && sequence[i].toLowerCase() === sequence[i+1].toLowerCase()) {
      sequence.splice(i, 2);
      i--;
    }
  }

  return sequence;
} 
