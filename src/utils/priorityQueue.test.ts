import { newHeap }from './priorityQueue';

describe('priorityQueue', () => {
  test('simple min heap', () => {
    const heap = newHeap<number>((a, b) => (a < b));
    const array = [6, 2, 3, 1, 5, 4];
    heap.init(array);
    expect(heap.pop(array)).toBe(1);
    expect(heap.pop(array)).toBe(2);
    expect(heap.pop(array)).toBe(3);
    expect(heap.pop(array)).toBe(4);
    expect(heap.pop(array)).toBe(5);
    expect(heap.pop(array)).toBe(6);
  });

  test('simple min heap', () => {
    const heap = newHeap<number>((a, b) => (a < b));
    const array = [6, 2, 3, 1, 5, 4];
    heap.init(array);
    expect(heap.pop(array)).toBe(1);
    expect(heap.pop(array)).toBe(2);
    heap.push(array, 1);
    expect(heap.pop(array)).toBe(1);
    heap.push(array, 7);
    heap.push(array, 2);
    expect(heap.pop(array)).toBe(2);
    expect(heap.pop(array)).toBe(3);
    expect(heap.pop(array)).toBe(4);
    expect(heap.pop(array)).toBe(5);
    expect(heap.pop(array)).toBe(6);
    expect(heap.pop(array)).toBe(7);
  });

  test('simple min heap', () => {
    const heap = newHeap<number>((a, b) => (a < b));
    const array: number[] = [];
    heap.init(array);
    heap.push(array, 3);
    heap.push(array, 2);
    heap.push(array, 1);
    expect(heap.pop(array)).toBe(1);
    expect(heap.pop(array)).toBe(2);
    expect(heap.pop(array)).toBe(3);
  });
});
