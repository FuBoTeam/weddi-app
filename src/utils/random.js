import random from 'lodash/random';
import range from 'lodash/range';

export const combination = (n, k) => {
  return range(n - k, n).reduce((ans, j) => {
    const t = random(j);
    if (ans.includes(t)) {
      return [...ans, j];
    }
    return [...ans, t];
  }, []);
}
