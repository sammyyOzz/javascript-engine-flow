import type { IConsoleLog, TConsoleListener } from "@/types/js-engine";

export class Console {
  private logs: IConsoleLog[] = [];
  private listeners: Set<(logs: IConsoleLog[]) => void> = new Set();

  log(message: string, type: IConsoleLog['type'] = 'log'): void {
    const logEntry: IConsoleLog = {
      message,
      type,
      timestamp: Date.now()
    };
    this.logs.push(logEntry);
    this.notifyListeners();
  }

  error(message: string): void {
    this.log(message, 'error');
  }

  warn(message: string): void {
    this.log(message, 'warn');
  }

  info(message: string): void {
    this.log(message, 'info');
  }

  clear(): void {
    this.logs = [];
    this.notifyListeners();
  }

  getLogs(): IConsoleLog[] {
    return [...this.logs];
  }

  getLastLog(): IConsoleLog | undefined {
    return this.logs[this.logs.length - 1];
  }

  removeLastLog(): IConsoleLog | undefined {
    const lastLog = this.logs.pop();
    this.notifyListeners();
    return lastLog;
  }

  subscribe(listener: TConsoleListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getLogs()));
  }
}