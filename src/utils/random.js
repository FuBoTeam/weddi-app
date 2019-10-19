import random from 'lodash/random';

export const combinationList = (list, k) => {
  const result = [];
  /* select k elements n-k <= i < n */
  for (let i = list.length - k; i < list.length; i++) {
    /* A random integer such that 0 <= j < i */
    const j = random(i);
    /* Select element j if element j is not selected yet */
    /* Otherwise select element i */
    if (result.includes(list[j])) {
      result.push(list[i]);
    } else {
      result.push(list[j]);
    }
  }
  return result;
};

export const permutationList = list => {
  for (let i = 0; i <= list.length - 2; i++) {
    /* A random integer such that i <= j < n */
    const j = random(i, list.length - 1);
    /* Swap the randomly picked element with list[i] */
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};
