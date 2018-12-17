const CPU = require('./16/cpu.js');
const fs = require('fs');

const samples = parseSampleInput(fs.readFileSync('data/16-input-p1.txt', 'utf-8').split(/\r?\n/));
const sampleResults = testSamples(samples);
console.log('[1]:', sampleResults.filter(({ matches }) => matches.length > 2).length);
console.log(sampleResults[0].matches);

// build test case for each function by adding all samples with the registered name to a list, and then
// test each opcode. The opcode for which all samples has a correctly verified result is the right one.

const program = fs.readFileSync('data/16-input-p2.txt', 'utf-8');

function testSamples(samples) {
  const cpu = new CPU();
  const results = samples.map(({ before, command, after }, sampleId) => {
    let matches = [];
    for (let i = 0; i < cpu.operations.length; i++) {
      cpu.setState(before);
      cpu.execute(i, command[1], command[2], command[3]);

      if (
        cpu.registers.every((val, idx) => {
          return val === after[idx];
        })
      ) {
        matches.push(cpu.operations[i].name.replace('bound ', ''));
      }

      if (matches > 2) {
        break;
      }
    }

    return { sampleId, matches };
  });

  return results;
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
