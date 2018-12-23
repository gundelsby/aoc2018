const { assert, refute } = require('@sinonjs/referee');
const Map = require('./../solutions/22/map.js');

describe('Day 22 Map class', () => {
  const depth = 510;
  const target = { x: 10, y: 10 };
  const start = { x: 0, y: 0 };

  const map = new Map(depth, target, start);

  describe('Geologic index tests', () => {
    // At 0,0, the geologic index is 0. The erosion level is (0 + 510) % 20183 = 510. The type is 510 % 3 = 0, rocky.
    it('should calculate 0 for 0,0', () => {
      const actual = map.calcGeologicIndex(0, 0);

      assert.equals(actual, 0);
    });

    // At 1,0, because the Y coordinate is 0, the geologic index is 1 * 16807 = 16807. The erosion level is (16807 + 510) % 20183 = 17317. The type is 17317 % 3 = 1, wet.
    it('should calculate 16807 for 1,0', () => {
      const actual = map.calcGeologicIndex(1, 0);

      assert.equals(actual, 16807);
    });

    // At 0,1, because the X coordinate is 0, the geologic index is 1 * 48271 = 48271.
    it('should calculate 48271 for 0,1', () => {
      const actual = map.calcGeologicIndex(0, 1);

      assert.equals(actual, 48271);
    });
    // At 1,1, neither coordinate is 0 and it is not the coordinate of the target, so the geologic index is the erosion level of 0,1 (8415) times the erosion level of 1,0 (17317), 8415 * 17317 = 145722555. The erosion level is (145722555 + 510) % 20183 = 1805. The type is 1805 % 3 = 2, narrow.
    it('should calculate 145722555 for 1,1', () => {
      const actual = map.calcGeologicIndex(1, 1);

      assert.equals(actual, 145722555);
    });
  });

  describe('Erosion level calculation', () => {
    // At 1,0, The erosion level is (16807 + 510) % 20183 = 17317
    it('should calculate 17317 for 1,0', () => {
      const actual = map.calcErosionLevel(1, 0);

      assert.equals(actual, 17317);
    });
  });

  describe('Risk level tests', () => {
    it('should choose rocky for 0,0', () => {
      const actual = map.determineRiskLevel(0, 0);

      assert.equals(actual, 0);
    });

    it('should choose wet for 1,0', () => {
      const actual = map.determineRiskLevel(1, 0);

      assert.equals(actual, 1);
    });
    // At 0,1, because the X coordinate is 0, the geologic index is 1 * 48271 = 48271. The erosion level is (48271 + 510) % 20183 = 8415. The type is 8415 % 3 = 0, rocky.
    it('should choose rocky for 0,1', () => {
      const actual = map.determineRiskLevel(0, 1);

      assert.equals(actual, 0);
    });
    // At 1,1, neither coordinate is 0 and it is not the coordinate of the target, so the geologic index is the erosion level of 0,1 (8415) times the erosion level of 1,0 (17317), 8415 * 17317 = 145722555. The erosion level is (145722555 + 510) % 20183 = 1805. The type is 1805 % 3 = 2, narrow.
    it('should choose narrow for 1,1', () => {
      const actual = map.determineRiskLevel(1, 1);

      assert.equals(actual, 2);
    });
  });

  // At 10,10, because they are the target's coordinates, the geologic index is 0. The erosion level is (0 + 510) % 20183 = 510. The type is 510 % 3 = 0, rocky.
  // Drawing this same cave system with rocky as ., wet as =, narrow as |, the mouth as M, the target as T, with 0,0 in the top-left corner, X increasing to the right, and Y increasing downward, the top-left corner of the map looks like this:

  // M=.|=.|.|=.|=|=.
  // .|=|=|||..|.=...
  // .==|....||=..|==
  // =.|....|.==.|==.
  // =|..==...=.|==..
  // =||.=.=||=|=..|=
  // |.=.===|||..=..|
  // |..==||=.|==|===
  // .=..===..=|.|||.
  // .======|||=|=.|=
  // .===|=|===T===||
  // =|||...|==..|=.|
  // =.=|=.=..=.||==|
  // ||=|=...|==.=|==
  // |=.=||===.|||===
  // ||.|==.|.|.||=||
  // Before you go in, you should determine the risk level of the area. For the the rectangle that has a top-left corner of region 0,0 and a bottom-right corner of the region containing the target, add up the risk level of each individual region: 0 for rocky regions, 1 for wet regions, and 2 for narrow regions.

  // In the cave system above, because the mouth is at 0,0 and the target is at 10,10, adding up the risk level of all regions with an X coordinate from 0 to 10 and a Y coordinate from 0 to 10, this total is 114.
});
