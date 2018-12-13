const directions = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

module.exports = class {
  constructor(map, position, direction) {
    this.map = map;
    this.position = position;
    this.direction = direction;
  }

  decideNewDirection(position, lastPosition) {
    return directions.find((dir) => {
      const newPos = { x: position.x + dir.x, y: position.y + dir.y };
      return (
        newPos.x !== lastPosition.x &&
        newPos.y !== lastPosition.y &&
        this.map.data[newPos.y][newPos.x] !== ''
      );
    });
  }

  track() {
    const foundLetters = [];
    let stepsMade = 1; // first square counts
    let position = this.map.getStart();
    let direction = { x: 0, y: 1 }; // initial move is down
    let canMove = true;
    while (canMove) {
      let lastPosition = position;
      position = { x: position.x + direction.x, y: position.y + direction.y };
      const square = this.map.data[position.y][position.x];
      switch (square) {
        case '+':
          direction = this.decideNewDirection(position, lastPosition);
          break;
        default:
          if (square.match(/[A-Z]/i)) {
            foundLetters.push(square);
          }
      }
      stepsMade++;
      canMove = this.map.data[position.y + direction.y][position.x + direction.x] !== '';
    }

    return { foundLetters: foundLetters.join(''), stepsMade };
  }
};
