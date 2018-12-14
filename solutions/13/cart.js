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
  constructor(id, map, position, direction) {
    this.id = id;
    this.map = map;
    this.position = { ...position };
    this.direction = { ...direction };
    this.history = [];
    this.lastIntersectionChoice = null;
  }

  move() {
    this.history.push({ position: { ...this.position }, direction: { ...this.direction } });
    const x = this.position.x + this.direction.x;
    const y = this.position.y + this.direction.y;
    if (!this.map[y] || !this.map[y][x]) {
      console.log(`Cart #${this.id}`);
      console.log(`OOB: ${x},${y}`);
      console.log(this.history);
    }
    this.position = { x, y };
    this.changeDirection();
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
        if (isSameDirection(this.direction, directions.LEFT)) {
          this.direction = directions.UP;
        } else if (isSameDirection(this.direction, directions.UP)) {
          this.direction = directions.LEFT;
        } else if (isSameDirection(this.direction, directions.DOWN)) {
          this.direction = directions.RIGHT;
        } else {
          this.direction = directions.DOWN;
        }
        break;
      case '/':
        if (isSameDirection(this.direction, directions.LEFT)) {
          this.direction = directions.DOWN;
        } else if (isSameDirection(this.direction, directions.UP)) {
          this.direction = directions.RIGHT;
        } else if (isSameDirection(this.direction, directions.DOWN)) {
          this.direction = directions.LEFT;
        } else {
          this.direction = directions.UP;
        }
        break;
      default:
        // continue in same direction, handles -, | and leftover starting positions
        break;
    }
  }
};
