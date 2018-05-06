export default class Queue {
  constructor() {
    this.q = [];
  }

  push(element) {
    this.q.push(element);
  }

  pop() {
    const result = this.q.splice(0, 1)[0];
    return result;
  }

  isEmpty() {
    return this.q.length === 0;
  }
}