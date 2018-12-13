const Cart = require('./13/cart.js');
const input = require('fs').readFileSync('data/13-input.txt', 'utf-8');
const map = input
  .split(/\r?\n/g)
  .filter((line) => line.trim() !== '')
  .map((line) => {
    return line.split('');
  });

const carts = createCarts(map);
let collisionPosition;
let moves = 0;

while (!collisionPosition) {
  console.log(`Move #${moves++}`);
  collisionPosition = checkCollisions(carts);
  carts.sort(cmpCartPositions);
  carts.forEach((cart) => cart.move());
}

console.log(collisionPosition);

function cmpCartPositions(a, b) {
  const yCmp = a.position.y - b.position.y;

  return yCmp !== 0 ? yCmp : a.position.x - b.position.x;
}

function checkCollisions(carts) {
  return carts
    .slice()
    .sort(cmpCartPositions)
    .reduce((collisionFound, cart, idx, arr) => {
      if (collisionFound || idx < 1) {
        return collisionFound;
      }

      const lastCart = arr[idx - 1];
      return cmpCartPositions(cart, lastCart) !== 0 ? false : cart.position;
    }, false);
}

function createCarts(map) {
  const cartDirections = {
    '^': { x: 0, y: -1 },
    v: { x: 0, y: 1 },
    '<': { x: -1, y: 0 },
    '>': { x: 1, y: 0 }
  };
  const carts = [];

  map.forEach((col, y) => {
    col.forEach((row, x) => {
      if (cartDirections[row]) {
        console.log(`\nNew cart: ${row} ${cartDirections[row]} at ${x},${y}`);
        carts.push(new Cart(map, { x, y }, cartDirections[row]));
      }
    });
  });

  return carts;
}
