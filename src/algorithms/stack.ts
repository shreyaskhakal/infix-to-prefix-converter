/**
 * Custom Stack Abstract Data Type adhering strictly to LIFO semantics.
 * All stack operations run in O(1) amortized time.
 */
export class Stack<T> {
  private items: T[] = [];
  public pushCount: number = 0;
  public popCount: number = 0;
  public peekCount: number = 0;
  public maxStackSize: number = 0;

  push(item: T): void {
    this.items.push(item);
    this.pushCount++;
    if (this.items.length > this.maxStackSize) {
      this.maxStackSize = this.items.length;
    }
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error('Stack Underflow: Cannot pop from an empty stack.');
    }
    this.popCount++;
    return this.items.pop()!;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error('Stack Underflow: Cannot peek into an empty stack.');
    }
    this.peekCount++;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  /**
   * Return an immutable snapshot copy of stack elements from bottom to top.
   */
  snapshot(): T[] {
    return [...this.items];
  }

  getStats() {
    return {
      pushes: this.pushCount,
      pops: this.popCount,
      peeks: this.peekCount,
      maxStackSize: this.maxStackSize,
    };
  }
}
