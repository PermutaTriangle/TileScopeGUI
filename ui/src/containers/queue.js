/**
 * LIFO container.
 */
class Queue {
  /**
   * Construct a queue.
   *
   * @param {number} initSize
   */
  constructor(initSize = 128) {
    this.arr = new Array(initSize);
    this.front = 0;
    this.back = 0;
    this.size = 0;
  }

  /**
   * Check if queue is empty.
   *
   * @returns {boolean} true if empty
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Add an item to the back of the queue.
   *
   * @param {any} item
   */
  enqueue(item) {
    this.#sizeCheck();
    this.arr[this.back] = item;
    this.back = (this.back + 1) % this.arr.length;
    this.size += 1;
  }

  /**
   * Get the item in front of the queue.
   *
   * @returns {any|undefined} item or undefined if emtpy
   */
  dequeue() {
    if (this.isEmpty()) return undefined;
    this.size -= 1;
    const val = this.arr[this.front];
    this.front = (this.front + 1) % this.arr.length;

    return val;
  }

  /**
   * Check if we need to resize underlying array before adding more.
   */
  #sizeCheck() {
    if (this.size === this.arr.length) {
      this.arr.unshift(...this.arr.splice(this.front));
      this.arr.length *= 2;
      this.back = this.size;
      this.front = 0;
    }
  }
}

export default Queue;
