const { assert, refute } = require('@sinonjs/referee');

describe('Test framework self test', () => {
  describe('Referee.assert', () => {
    it('should work', () => {
      assert(true);
    });
  });

  describe('Referee.refute', () => {
    it('should work', () => {
      refute(false);
    });
  });
});
