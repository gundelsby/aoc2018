module.exports = class CPU {
  // According to the manual, the device has four registers (numbered 0 through 3) that can be manipulated by instructions containing one of 16 opcodes. The registers start with the value 0.
  constructor(instructionPointerRegister) {
    this.registers = [0, 0, 0, 0, 0, 0];
    this.instructionPointer = 0;
    this.operations = [
      this.addr.bind(this),
      this.addi.bind(this),
      this.mulr.bind(this),
      this.muli.bind(this),
      this.banr.bind(this),
      this.bani.bind(this),
      this.borr.bind(this),
      this.bori.bind(this),
      this.setr.bind(this),
      this.seti.bind(this),
      this.gtir.bind(this),
      this.gtri.bind(this),
      this.gtrr.bind(this),
      this.eqir.bind(this),
      this.eqri.bind(this),
      this.eqrr.bind(this)
    ];
  }

  // Every instruction consists of four values: an opcode, two inputs (named A and B), and an output (named C), in that order. The opcode specifies the behavior of the instruction and how the inputs are interpreted. The output, C, is always treated as a register.

  // addr (add register) stores into register C the result of adding register A and register B.
  addr(inA, inB, out) {
    this.registers[out] = this.registers[inA] + this.registers[inB];
  }

  // addi (add immediate) stores into register C the result of adding register A and value B.
  addi(inA, inB, out) {
    this.registers[out] = this.registers[inA] + inB;
  }

  // mulr (multiply register) stores into register C the result of multiplying register A and register B.
  mulr(inA, inB, out) {
    this.registers[out] = this.registers[inA] * this.registers[inB];
  }

  // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
  muli(inA, inB, out) {
    this.registers[out] = this.registers[inA] * inB;
  }

  // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
  banr(inA, inB, out) {
    this.registers[out] = this.registers[inA] & this.registers[inB];
  }

  // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
  bani(inA, inB, out) {
    this.registers[out] = this.registers[inA] & inB;
  }

  // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
  borr(inA, inB, out) {
    this.registers[out] = this.registers[inA] | this.registers[inB];
  }
  // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
  bori(inA, inB, out) {
    this.registers[out] = this.registers[inA] | inB;
  }

  // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
  setr(inA, inB, out) {
    this.registers[out] = this.registers[inA];
  }
  // seti (set immediate) stores value A into register C. (Input B is ignored.)
  seti(inA, inB, out) {
    this.registers[out] = inA;
  }

  // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
  gtir(inA, inB, out) {
    this.registers[out] = inA > this.registers[inB] ? 1 : 0;
  }
  // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
  gtri(inA, inB, out) {
    this.registers[out] = this.registers[inA] > inB ? 1 : 0;
  }
  // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
  gtrr(inA, inB, out) {
    this.registers[out] = this.registers[inA] > this.registers[inB] ? 1 : 0;
  }

  // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
  eqir(inA, inB, out) {
    this.registers[out] = inA === this.registers[inB] ? 1 : 0;
  }
  // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
  eqri(inA, inB, out) {
    this.registers[out] = this.registers[inA] === inB ? 1 : 0;
  }
  // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
  eqrr(inA, inB, out) {
    this.registers[out] = this.registers[inA] === this.registers[inB] ? 1 : 0;
  }

  setState(registers) {
    this.registers = registers.slice(0, 6);
  }

  getState() {
    return this.registers.slice();
  }

  sipr(register) {
    this.instructionPointer = register;
  }

  execute(name, inA, inB, out) {
    this[name](inA, inB, out);
    return this.registers[this.instructionPointer]++;
  }
};
