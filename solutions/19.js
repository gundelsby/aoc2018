const fs = require('fs');
const CPU = require('./19/cpu.js');

// const input = fs.readFileSync('data/19-input.txt', 'utf-8').split(/\r?\n/);
const input = fs.readFileSync('data/19-example.txt', 'utf-8').split(/\r?\n/);
const program = parseProgram(input);

console.log(`[1]: ${solveP1(program)}`);

function solveP1(program) {
  const cpu = new CPU(program.ipreg);
  let nextLine = 0;

  while (program.instructions[nextLine]) {
    const line = program.instructions[nextLine];
    nextLine = cpu.execute(line.command, ...line.args);
  }

  return cpu.getState()[0];
}

function parseProgram(lines) {
  const reIPAssign = /^#ip\s(\d)/;
  const reInstruction = /^([a-z]+)\s(\d)\s(\d)\s(\d)/;
  return {
    ipreg: reIPAssign.exec(lines[0]),
    instructions: lines.slice(1).map((line) => {
    const parts = reInstruction.exec(line);
    return {
      command: parts[1],
      args: parts.slice(2).map(Number)
    };
  });
}
