const Cart = require('./13/cart.js');
// const input = require('fs').readFileSync('data/13-example-01.txt', 'utf-8');
// const input = require('fs').readFileSync('data/13-example-02.txt', 'utf-8');
const input = require('fs').readFileSync('data/13-input.txt', 'utf-8');
const map = input
  .split(/\r?\n/g)
  .filter((line) => line.trim() !== '')
  .map((line) => {
    return line.split('');
  });

let carts = createCarts(map);
let moves = 0;

do {
  carts.sort(cmpCartPositions);
  carts.forEach((cart) => cart.move());

  const collisionPositions = checkCollisions(carts);
  if (collisionPositions.length) {
    console.log(`Move #${moves++}`);
    console.log(
      'Collision(s) at',
      collisionPositions.map((position) => `${position.x},${position.y}`).join(', ')
    );
    carts = carts.filter((cart) => {
      if (
        collisionPositions.find((position) => {
          return cmpCartPositions({ position }, cart) === 0;
        })
      ) {
        console.log(`=> Removing cart #${cart.id}`);
        return false;
      }

      return true;
    });
  }
} while (carts.length > 1);

console.log(`Last cart remaining is #${carts[0].id}, at`, carts[0].position);

function cmpCartPositions(a, b) {
  const yCmp = a.position.y - b.position.y;

  return yCmp !== 0 ? yCmp : a.position.x - b.position.x;
}

function checkCollisions(carts) {
  const positions = [];

  carts
    .slice()
    .sort(cmpCartPositions)
    .forEach((cart, idx, arr) => {
      if (idx < 1) {
        return;
      }

      const lastCart = arr[idx - 1];
      if (cmpCartPositions(cart, lastCart) === 0) {
        positions.push(cart.position);
      }
    }, false);

  return positions;
}

function createCarts(map) {
  const cartDirections = {
    '^': { x: 0, y: -1 },
    v: { x: 0, y: 1 },
    '<': { x: -1, y: 0 },
    '>': { x: 1, y: 0 }
  };
  const carts = [];
  let cartId = 0;

  map.forEach((col, y) => {
    col.forEach((row, x) => {
      if (cartDirections[row]) {
        console.log(`\nNew cart: ${row} ${cartDirections[row]} at ${x},${y}`);
        carts.push(new Cart(cartId++, map, { x, y }, cartDirections[row]));
      }
    });
  });

  return carts;
}
