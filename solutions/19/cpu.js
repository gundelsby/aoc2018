module.exports = class CPU {
  constructor(instructionPointerRegister) {
    this.registers = [0, 0, 0, 0, 0, 0];
    this.instructionPointer = 0;
    this.instructionPointerRegister = instructionPointerRegister;
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

  addr(inA, inB, out) {
    this.registers[out] = this.registers[inA] + this.registers[inB];
  }

  addi(inA, inB, out) {
    this.registers[out] = this.registers[inA] + inB;
  }

  mulr(inA, inB, out) {
    this.registers[out] = this.registers[inA] * this.registers[inB];
  }

  muli(inA, inB, out) {
    this.registers[out] = this.registers[inA] * inB;
  }

  banr(inA, inB, out) {
    this.registers[out] = this.registers[inA] & this.registers[inB];
  }

  bani(inA, inB, out) {
    this.registers[out] = this.registers[inA] & inB;
  }

  borr(inA, inB, out) {
    this.registers[out] = this.registers[inA] | this.registers[inB];
  }

  bori(inA, inB, out) {
    this.registers[out] = this.registers[inA] | inB;
  }

  setr(inA, inB, out) {
    this.registers[out] = this.registers[inA];
  }

  seti(inA, inB, out) {
    this.registers[out] = inA;
  }

  gtir(inA, inB, out) {
    this.registers[out] = inA > this.registers[inB] ? 1 : 0;
  }

  gtri(inA, inB, out) {
    this.registers[out] = this.registers[inA] > inB ? 1 : 0;
  }

  gtrr(inA, inB, out) {
    this.registers[out] = this.registers[inA] > this.registers[inB] ? 1 : 0;
  }

  eqir(inA, inB, out) {
    this.registers[out] = inA === this.registers[inB] ? 1 : 0;
  }
  eqri(inA, inB, out) {
    this.registers[out] = this.registers[inA] === inB ? 1 : 0;
  }

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
    this.registers[this.instructionPointerRegister] = this.instructionPointer;
    this[name](inA, inB, out);
    this.instructionPointer = this.registers[this.instructionPointerRegister];

    return ++this.instructionPointer;
  }
};
