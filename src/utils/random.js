import random from 'lodash/random';
import range from 'lodash/range';

export const combinationList = (list, k) =>
  range(list.length - k, list.length).reduce((result, j) => {
    const t = random(j);
    if (result.includes(list[t])) {
      return [...result, list[j]];
    }
    return [...result, list[t]];
  }, []);

export const permutationList = list => {
  for (let i = 0; i <= list.length - 2; i++) {
    /* A random integer such that i <= j < n */
    const j = random(i, list.length - 1);
    /* Swap the randomly picked element with list[i] */
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};
