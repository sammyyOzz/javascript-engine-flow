import type { ICallStackItem, TCallStackListener } from "@/types/js-engine";

export class CallStack {
  private stack: ICallStackItem[] = [];
  private listeners: Set<(stack: ICallStackItem[]) => void> = new Set();

  push(item: ICallStackItem): void {
    this.stack.push(item);
    this.notifyListeners();
  }

  pop(): ICallStackItem | undefined {
    const item = this.stack.pop();
    this.notifyListeners();
    return item;
  }

  peek(): ICallStackItem | undefined {
    return this.stack[this.stack.length - 1];
  }

  clear(): void {
    this.stack = [];
    this.notifyListeners();
  }

  getStack(): ICallStackItem[] {
    return [...this.stack];
  }

  size(): number {
    return this.stack.length;
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  subscribe(listener: TCallStackListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getStack()));
  }
}