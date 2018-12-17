const CPU = require('./16/cpu.js');
const fs = require('fs');

const samples = parseSampleInput(fs.readFileSync('data/16-input-p1.txt', 'utf-8').split(/\r?\n/));
const sampleResults = testSamples(samples);
console.log('[1]:', sampleResults.filter(({ matches }) => matches.length > 2).length);

// build test case for each function by adding all samples with the registered id to a list, and then
// test each opcode. The opcode for which all samples has a correctly verified result is the right one.
const opMap = {};
sampleResults.forEach(({ matches, sampleId }) => {
  matches.forEach((opId) => {
    opMap[opId] = opMap[opId] || { tests: [] };
    opMap[opId].tests.push(sampleId);
  });
});

Object.keys(opMap).forEach((opId) => {
  const cpu = new CPU();
  for (let i = 0; cpu.operations.length; i++) {
    const allPassed = opMap[opId].tests.reduce((passed, sampleId) => {
      const test = samples[sampleId];
      return passed ? testSample(test, cpu, i) : false;
    }, true);

    if (allPassed) {
      opMap[opId].realOpId = i;
      break;
    }
  }
});

console.log(opMap);

const program = fs.readFileSync('data/16-input-p2.txt', 'utf-8');

function testSample({ before, command, after }, cpu, opIndex) {
  cpu.setState(before);
  cpu.execute(opIndex, command[1], command[2], command[3]);

  return cpu.registers.every((val, idx) => {
    return val === after[idx];
  });
}

function testSamples(samples) {
  const cpu = new CPU();
  const results = samples.map((sample, sampleId) => {
    let matches = [];
    for (let i = 0; i < cpu.operations.length; i++) {
      if (testSample(sample, cpu, i)) {
        matches.push(i);
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
