const CPU = require('./16/cpu.js');
const fs = require('fs');

const samples = parseSampleInput(fs.readFileSync('data/16-input-p1.txt', 'utf-8').split(/\r?\n/));
const tripleFriends = findTriples(samples);
console.log('[1]:', tripleFriends.length);

const program = fs.readFileSync('data/16-input-p2.txt', 'utf-8');

function findTriples(samples) {
  const cpu = new CPU();
  const found = samples.map(({ before, command, after }) => {
    let matches = 0;
    for (let i = 0; i < cpu.operations.length; i++) {
      cpu.setState(before);
      cpu.execute(i, command[1], command[2], command[3]);

      if (
        cpu.registers.every((val, idx) => {
          return val === after[idx];
        })
      ) {
        matches++;
      }

      if (matches > 2) {
        break;
      }
    }

    return matches > 2;
  });

  return found.filter((found) => !!found);
}

function parseSampleInput(lines) {
  const reArrayValues = /\[(\d),\s(\d),\s(\d),\s(\d)\]/;
  const parsed = [];

  for (let i = 0; i < lines.length; i = i + 4) {
    const before = reArrayValues
      .exec(lines[i])
      .slice(1)
      .map(Number);
    const command = lines[i + 1].split(' ').map(Number);
    const after = reArrayValues
      .exec(lines[i + 2])
      .slice(1)
      .map(Number);

    parsed.push({ before, command, after });
  }

  return parsed;
}
