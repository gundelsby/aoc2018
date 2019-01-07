const TYPE = {
  ROCKY: 0,
  WET: 1,
  NARROW: 2
};

const VALUETYPE = {
  GEOINDEX: 'geoIndex',
  ER_LEVEL: 'erosionLevel',
  RISK_LEVEL: 'riskLevel'
};

module.exports = class Map {
  constructor(depth, target, start) {
    this.depth = depth;
    this.target = target;
    this.start = start;
    this.regions = {};

    this.buildMap();
  }

  buildMap() {
    for (let x = 0; x <= this.target.x; x++) {
      this.regions[x] = {};
      for (let y = 0; y <= this.target.y; y++) {
        this.setValue(x, y, VALUETYPE.RISK_LEVEL, this.determineRiskLevel(x, y));
      }
    }
  }

  getValue(x, y, valueType) {
    if (this.regions[x] && this.regions[x][y]) {
      return this.regions[x][y][valueType] || null;
    }

    return null;
  }

  setValue(x, y, valueType, value) {
    this.regions[x] = this.regions[x] || {};
    this.regions[x][y] = this.regions[x][y] || {};
    this.regions[x][y][valueType] = value;
  }

  getRiskSum() {
    return Object.values(this.regions).reduce((sum, currentX) => {
      return (
        sum + Object.values(currentX).reduce((sum, region) => sum + region[VALUETYPE.RISK_LEVEL], 0)
      );
    }, 0);
  }

  // The geologic index can be determined using the first rule that applies from the list below:
  calcGeologicIndex(x, y) {
    const stored = this.getValue(x, y, VALUETYPE.GEOINDEX);
    if (stored) {
      return stored;
    }

    // The region at 0,0 (the mouth of the cave) has a geologic index of 0.
    if (x === 0 && y === 0) {
      return 0;
    }

    // The region at the coordinates of the target has a geologic index of 0.
    if (x === this.target.x && y === this.target.y) {
      return 0;
    }

    // If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
    if (y === 0) {
      return x * 16807;
    }
    // If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
    if (x === 0) {
      return y * 48271;
    }

    // geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.
    const calculatedValue = this.calcErosionLevel(x - 1, y) * this.calcErosionLevel(x, y - 1);
    this.setValue(x, y, VALUETYPE.GEOINDEX, calculatedValue);
    return calculatedValue;
  }

  // A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183. Then:
  calcErosionLevel(x, y) {
    const geoIndex = this.calcGeologicIndex(x, y);
    return (geoIndex + this.depth) % 20183;
  }

  determineRiskLevel(x, y) {
    const types = [TYPE.ROCKY, TYPE.WET, TYPE.NARROW];
    const erosionLevel = this.calcErosionLevel(x, y);

    return types[erosionLevel % 3];
  }
};
