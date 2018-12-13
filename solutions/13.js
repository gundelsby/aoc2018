const Cart = require('./13/cart.js');
const input = require('fs').readFileSync('data/13-input.txt', 'utf-8');
const map = input
  .split(/\r?\n/g)
  .filter((line) => line.trim() !== '')
  .map((line) => {
    return line.split('');
  });

const carts = createCarts(map);
console.log(carts);

function createCarts(map) {
  const cartDirections = {
    '^': { x: 0, y: -1 },
    v: { x: 0, y: 1 },
    '<': { x: -1, y: 0 },
    '>': { x: 1, y: 0 }
  };
  const carts = [];

  map.forEach((row, x) => {
    row.forEach((col, y) => {
      if (cartDirections[col]) {
        carts.push(new Cart(map, { x, y }, cartDirections[col]));
      }
    });
  });

  return carts;
}
