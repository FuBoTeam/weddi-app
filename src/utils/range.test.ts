import { range } from "./range";

describe('range', () => {
  describe.each([
    [1],
    [2],
    [5],
    [10]
  ])('given a number n = %d', (n) => {
    describe('when return', () => {
      const list = range(n);
      it('should be a list contains n elements', () => {
        expect(list).toHaveLength(n);
      });
      describe('each elements in the list', () => {
        it('should be as same as its key', () => {
          list.forEach((value, key) => {
            expect(value).toEqual(key);
          });
        });
      });
    });
  });
});
