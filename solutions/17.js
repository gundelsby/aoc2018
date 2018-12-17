const fs = require('fs');
const input = fs
  .readFileSync('data/17-input.txt', 'utf-8')
  .split(/\r?\n/)
  .sort();

// ignore tiles with a y coordinate smaller than the smallest y coordinate in your scan data or larger than the largest one
const yMin = Number(input[0].match(/y=(\d+)/));
const yMax = Number(input[input.length - 1].match(/y=(\d+)/));
console.log(yMin, yMax);
const clayMap = buildClayMap(input);

// There is also a spring of water near the surface at x=500, y=0
const springPos = { x: 500, y: 0 };

function buildClayMap(input) {
  return {};
}
