const CPU = require('./16/cpu.js');
const fs = require('fs');

const samples = parseSampleInput(fs.readFileSync('data/16-input-p1.txt', 'utf-8').split(/\r?\n/));
const results = analyzeSamples(samples);
console.log('[1]:', results.filter((sampleResult) => sampleResult.length > 2).length);

const program = fs
  .readFileSync('data/16-input-p2.txt', 'utf-8')
  .split(/\r?\n/)
  .map((line) => line.split(' ').map(Number));

const opCodeMap = mapOperations(samples, results);
console.log('[2]:', runProgram(program, opCodeMap));

function mapOperations(samples, results) {
  const sampleOpCodeTests = buildSampleOpCodeTestsMap(samples);
  const sampleOpCodePassingTests = findSampleOpCodesPassingTests(sampleOpCodeTests, results);
  const passedOpCodes = Object.keys(sampleOpCodePassingTests);
  const opCodeMap = {};

  while (passedOpCodes.filter((opCode) => sampleOpCodePassingTests[opCode].length > 1).length) {
    const singles = passedOpCodes
      .filter((opCode) => sampleOpCodePassingTests[opCode].length === 1)
      .map((opCode) => sampleOpCodePassingTests[opCode][0]);

    singles.forEach((cpuOpCodeToRemove) => {
      passedOpCodes
        .filter((opCode) => sampleOpCodePassingTests[opCode].length > 1)
        .forEach((opCode) => {
          sampleOpCodePassingTests[opCode] = sampleOpCodePassingTests[opCode].filter(
            (passedOpCode) => passedOpCode !== cpuOpCodeToRemove
          );
        });
    });
  }

  passedOpCodes.forEach((sampleOpCode) => {
    opCodeMap[sampleOpCode] = sampleOpCodePassingTests[sampleOpCode][0];
  });

  return opCodeMap;
}

function findSampleOpCodesPassingTests(sampleOpCodeTests, sampleResults) {
  const sampleOpCodePassingTests = {};

  Object.keys(sampleOpCodeTests).forEach((opCode) => {
    const passingCpuOpCodes = sampleOpCodeTests[opCode].reduce((passingOpCodes, current) => {
      if (!passingOpCodes) {
        return sampleResults[current];
      }

      if (passingOpCodes.length === 0) {
        return [];
      }

      return passingOpCodes.filter((opCode) => {
        return sampleResults[current].indexOf(opCode) > -1;
      });
    }, null);

    sampleOpCodePassingTests[opCode] = passingCpuOpCodes;
  });

  return sampleOpCodePassingTests;
}

function buildSampleOpCodeTestsMap(samples) {
  const opCodeMap = {};

  samples.forEach((sample, idx) => {
    const sampleOpCode = sample.command[0];
    opCodeMap[sampleOpCode] = opCodeMap[sampleOpCode] || [];

    opCodeMap[sampleOpCode].push(idx);
  });

  return opCodeMap;
}

function runProgram(program, opsMap) {
  const cpu = new CPU();

  program.forEach((command) => {
    command[0] = opsMap[command[0]];
    cpu.execute(...command);
  });

  return cpu.getState()[0];
}

function analyzeSamples(samples) {
  const cpu = new CPU();
  const validOperations = samples.map((sample) => {
    let matches = [];
    for (let i = 0; i < cpu.operations.length; i++) {
      if (testSample(cpu, sample, i)) {
        matches.push(i);
      }
    }

    return matches;
  });

  return validOperations;
}

function testSample(cpu, { before, command, after }, opId) {
  cpu.setState(before);
  cpu.execute(opId, command[1], command[2], command[3]);

  return cpu.getState().every((val, idx) => val === after[idx]);
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
