export default class Queue<T> {
  private q: T[];
  public constructor() {
    this.q = [];
  }

  public push(element: T): void {
    this.q.push(element);
  }

  public pop(): T {
    const result = this.q.splice(0, 1)[0];
    return result;
  }

  public isEmpty(): boolean {
    return this.q.length === 0;
  }
}
