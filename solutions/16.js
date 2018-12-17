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
// console.log(opCodeMap[15]);
// console.log('[2:', runProgram(program, opsMap));

function mapOperations(samples, results) {
  const opCodeMap = {};

  samples.forEach((sample, idx) => {
    const sampleOpCode = sample.command[0];
    opCodeMap[sampleOpCode] = opCodeMap[sampleOpCode] || { testCases: [] };

    opCodeMap[sampleOpCode].testCases.push(idx);
  });

  Object.keys(opCodeMap).forEach((opCode) => {
    console.log(
      `\n\nFinding cpu opcode for sample opcode ${opCode} (${
        opCodeMap[opCode].testCases.length
      } test cases)`
    );
    const passingCpuOpCodes = opCodeMap[opCode].testCases.reduce((passingOpCodes, current) => {
      // console.log(`\nChecking test case #${current}`);
      if (!passingOpCodes) {
        // console.log(`Passed for ${current}:`, results[current]);
        return results[current];
      }

      if (passingOpCodes.length === 0) {
        // console.log('No opcodes to test, returning empty array');
        return [];
      }

      // console.log('Previously passed:', passingOpCodes);
      // console.log(`Passed for ${current}:`, results[current]);
      return passingOpCodes.filter((opCode) => {
        // console.log(`Checking opcode ${opCode}`, results[current].indexOf(opCode) > -1);
        return results[current].indexOf(opCode) > -1;
      });
    }, null);

    console.log('=> using', passingCpuOpCodes);
    opCodeMap[opCode].cpuOpCode = passingCpuOpCodes;
  });

  while (
    Object.keys(opCodeMap).filter((opCode) => {
      return opCodeMap[opCode].cpuOpCode.length > 1;
    }).length
  ) {
    const singles = Object.keys(opCodeMap)
      .filter((opCode) => opCodeMap[opCode].cpuOpCode.length === 1)
      .map((opCode) => opCodeMap[opCode].cpuOpCode[0]);

    // remove singles from opcode lists with more than one entry
  }

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
