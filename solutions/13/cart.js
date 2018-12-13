const directions = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 }
};

const turns = {
  LEFT: 'left',
  RIGHT: 'right'
};

function isSameDirection(a, b) {
  return a.x === b.x && a.y === b.y;
}

function turn(currentDirection, turn) {
  if (isSameDirection(currentDirection, directions.UP)) {
    return turn === turns.LEFT ? directions.LEFT : directions.RIGHT;
  } else if (isSameDirection(currentDirection, directions.RIGHT)) {
    return turn === turns.LEFT ? directions.UP : directions.DOWN;
  } else if (isSameDirection(currentDirection, directions.DOWN)) {
    return turn === turns.LEFT ? directions.RIGHT : directions.LEFT;
  } else if (isSameDirection(currentDirection, directions.LEFT)) {
    return turn === turns.LEFT ? directions.DOWN : directions.UP;
  } else {
    console.log('Unable to make a turn using', currentDirection, turn);
  }
}

module.exports = class {
  constructor(map, position, direction) {
    this.map = map;
    this.position = { ...position };
    this.direction = { ...direction };
    this.lastIntersectionChoice = null;
  }

  move() {
    const x = this.position.x + this.direction.x;
    const y = this.position.y + this.direction.y;
    if (!this.map[y] || !this.map[y][x]) {
      console.log(`OOB: ${x},${y}`);
    }
    this.position = { x, y };
    this.changeDirection();
    console.log('=>', this.position, this.direction);
  }

  navigateIntersection() {
    const outs = {
      LEFT: 'left',
      STRAIGHT: 'straight',
      RIGHT: 'right'
    };
    switch (this.lastIntersectionChoice) {
      case outs.LEFT:
        this.lastIntersectionChoice = outs.STRAIGHT;
        break;
      case outs.STRAIGHT:
        this.direction = turn(this.direction, turns.RIGHT);
        this.lastIntersectionChoice = outs.RIGHT;
        break;
      case outs.RIGHT:
      default:
        this.direction = turn(this.direction, turns.LEFT);
        this.lastIntersectionChoice = outs.LEFT;
    }
  }

  changeDirection() {
    const instruction = this.map[this.position.y][this.position.x];
    switch (instruction) {
      case '+':
        this.navigateIntersection();
        break;
      case '\\':
        // either turn left or right, depending on incoming direction
        if (this.direction === directions.LEFT) {
          this.direction = directions.UP;
        } else {
          this.direction = directions.RIGHT;
        }
        break;
      case '/':
        // either turn left or right, depending on incoming direction
        if (this.direction === directions.RIGHT) {
          this.direction = directions.UP;
        } else {
          this.direction = directions.LEFT;
        }
        break;
      default:
        // continue in same direction, handles - and |
        break;
    }
  }
};
