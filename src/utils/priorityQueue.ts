/**
 * Min heap creator
 *
 * @param lessFn
 * @returns
 */
export const newHeap = <T>(lessFn: (node1: T, node2: T) => boolean) => {
  const half = (n: number): number => Math.floor(n / 2);
  const parent = (id: number): number => Math.floor((id - 1) / 2);
  const children = (id: number): [number, number] => [2 * id + 1, 2 * id + 2];
  const less = (array: T[], idx1: number, idx2: number): boolean => lessFn(array[idx1], array[idx2]);
  const swap = (array: T[], idx1: number, idx2: number): void => {
    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
  };
  const heapify = (array: T[], idx: number): void => {
    let currentIdx = idx;
    while (currentIdx < half(array.length)) {
      // left child id is 2i+1 and right child id is 2i+2. We claim left child is always in heap but right child is not.
      // Reason: index i is less than half size of the heap (i.e. i <= [n/2]-1) so left child 2i+1 <= 2[n/2] - 1 <= n-1 < n
      // However, right child of index is 2i+2 <= 2[n/2] <= n. It is not in the heap when equal holds.
      const [leftChildIdx, rightChildIdx] = children(currentIdx);
      // find the smallest child
      let childIdx = leftChildIdx;
      if (rightChildIdx < array.length && less(array, rightChildIdx, childIdx)) {
        childIdx = rightChildIdx;
      }
      // if current node is less than smallest child, stop downward swapping
      if (less(array, currentIdx, childIdx)) {
        break;
      }
      swap(array, currentIdx, childIdx);
      currentIdx = childIdx;
    }
  };
  return {
    init: (array: T[]): void => {
      for (let i = half(array.length) - 1; i >= 0; i--) {
        heapify(array, i);
      }
    },
    push: (array: T[], element: T): void => {
      array.push(element);
      let currentIdx = array.length - 1;
      // current index is not root
      while (currentIdx !== 0) {
        const parentIdx = parent(currentIdx);
        // if parent node is less than current node. stop upward swapping
        if (less(array, parentIdx, currentIdx)) {
          break;
        }
        swap(array, parentIdx, currentIdx);
        currentIdx = parentIdx;
      }
    },
    pop: (array: T[]): T | undefined => {
      if (array.length === 0) {
        return undefined;
      }
      swap(array, 0, array.length - 1);
      const result = array.pop();
      heapify(array, 0);
      return result;
    }
  };
};
