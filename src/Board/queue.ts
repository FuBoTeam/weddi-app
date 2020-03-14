interface QueueInterface<T> {
  enQueue(item: T): void;
  deQueue(): T;
  isEmpty(): boolean;
}

export default class Queue<T> implements QueueInterface<T> {
  private q: T[];
  public constructor(init: T[] = []) {
    this.q = init;
  }

  public enQueue(element: T): void {
    this.q.push(element);
  }

  public deQueue(): T {
    const result = this.q.splice(0, 1)[0];
    return result;
  }

  public isEmpty(): boolean {
    return this.q.length === 0;
  }
}
