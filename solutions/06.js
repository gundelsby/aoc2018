const fs = require("fs");
const input = fs.readFileSync("data/06-input.txt", "utf-8").split("\n").filter(line => !!line.trim());
const coordinates = input.map(line => {
  const parts = /^(\d+),\s(\d+)$/.exec(line);
  
  return {
    x: Number(parts[1]),
    y: Number(parts[2])
  }
})

console.log(coordinates.length)
const finite = coordinates.filter(isFinite)
console.log(finite.length)

function isFinite (coordinate, idx, arr) {
  return arr.reduce((blocked, {y}) => {
    return blocked ? blocked : coordinate.y > y;
  }, false) && arr.reduce((blocked, {y}) => {
    return blocked ? blocked : coordinate.y < y;
  }, false) && arr.reduce((blocked, {x}) => {
    return blocked ? blocked : coordinate.x > x;
  }, false) && arr.reduce((blocked, {x}) => {
    return blocked ? blocked : coordinate.x < x;
  }, false);
}

function calcDistance (a, b) {
  const sorted = [a, b].sort()

  return Math.abs(sorted[1] - sorted[0])
}

function calcManhattanDistance (a, b) {
  return calcDistance(a.x, b.x) + calcDistance(a.y, b.y);
}
