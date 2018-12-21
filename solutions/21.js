const fs = require('fs');
const CPU = require('./19/cpu.js');

const input = fs.readFileSync('data/21-input.txt', 'utf-8').split(/\r?\n/);
// const input = fs.readFileSync('data/19-example.txt', 'utf-8').split(/\r?\n/);
const program = parseProgram(input);

console.log('[1]:', solveP1(program));
// console.log(`[2]: ${solveP2(program)}`);

function solveP1(program) {
  const maxCycles = 10000;
  let i = 0;
  let lowest;
  for (; i < 100; i++) {
    console.log(`\nRunning program with register 0 initialized to ${i}...`);
    const cpu = new CPU(program.ipreg);
    cpu.setState([i, 0, 0, 0, 0, 0]);
    const cyclesToHalt = runProgram(cpu, program.instructions, maxCycles).cycles;
    console.log(
      `Program exited after ${cyclesToHalt} ${cyclesToHalt === maxCycles ? '(max)' : ''}`,
      'cpu state:',
      cpu.getState()
    );
    if (!lowest || cyclesToHalt < lowest.cyclesToHalt) {
      lowest = { cyclesToHalt, regValue: i };
    }
  }

  return lowest;
}

function runProgram(cpu, instructions, maxRunningTime) {
  let nextLine = 0;
  let cycles = 0;
  let highestLineExecuted = 0;

  while (instructions[nextLine] && cycles < maxRunningTime) {
    const line = instructions[nextLine];
    nextLine = cpu.execute(line.command, ...line.args);
    if (nextLine > highestLineExecuted) highestLineExecuted = nextLine;
    cycles++;
  }

  console.log(`Highest line number executed: ${highestLineExecuted}`);

  return {
    cycles,
    cpuState: cpu.getState()
  };
}

function parseProgram(lines) {
  const reIPAssign = /^#ip\s(\d)/;
  const reInstruction = /^([a-z]+)\s(\d+)\s(\d+)\s(\d+)/;
  return {
    ipreg: reIPAssign.exec(lines[0])[1],
    instructions: lines.slice(1).map((line) => {
      const parts = reInstruction.exec(line);
      return {
        command: parts[1],
        args: parts.slice(2).map(Number)
      };
    })
  };
}
