const Map = require('./22/map.js');
const inputDepth = 10689;
const target = { x: 11, y: 722 };
const start = { x: 0, y: 0 };

const map = new Map(inputDepth, target, start);

console.log('Part 1 not correct: 732');
console.log('[1]:', map.getRiskSum(start, target));
