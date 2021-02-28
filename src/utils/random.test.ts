import { combinationList, permutationList } from './random';

describe('random', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
  describe('combinationList', () => {
    describe('when given a list with length n = 10', () => {
      const n = 10;
      const list = Array.from({length: n}, (_, i) => i);
      describe.each([
        [1],
        [2],
        [5],
        [9],
        [10],
      ])('and given a valid k = %d', (k) => {
        it('should return a list with length k', () => {
          expect(combinationList(list, k)).toHaveLength(k);
        });
        it('should match the snapshot', () => {
          expect(combinationList(list, k)).toMatchSnapshot();
        });
      });
    });
  });
  describe('permutationList', () => {
    describe('when given a list with length n = 10', () => {
      const n = 10;
      const list = Array.from({length: n}, (_, i) => i);
      it('should return a list with length n', () => {
        expect(permutationList(list)).toHaveLength(n);
      });
      it('should match the snapshot', () => {
        expect(permutationList(list)).toMatchSnapshot();
      });
    });
  });
});
