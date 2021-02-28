const random = (a = 1, b = 0): number => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const combinationList = <T>(list: T[] , k: number): T[] => {
  const result: T[] = [];
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

export const permutationList = <T>(list: T[]): T[] => {
  for (let i = 0; i <= list.length - 2; i++) {
    /* A random integer such that i <= j < n */
    const j = random(i, list.length - 1);
    /* Swap the randomly picked element with list[i] */
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};
