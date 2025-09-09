import type { TExecutionListener, TCallStackListener, TConsoleListener } from "@/types/js-engine";
import { ASTParser } from "./ast-parser";
import { CallStack } from "./call-stack";
import { Console } from "./console";
import { ExecutionController } from "./execution-controller";

export class JSEngine {
  private callStack: CallStack;
  private console: Console;
  private parser: ASTParser;
  private controller: ExecutionController;
  private source: string = '';
  private tree: any = null;

  constructor() {
    this.callStack = new CallStack();
    this.console = new Console();
    this.parser = new ASTParser();
    this.controller = new ExecutionController(
      this.callStack, 
      this.console, 
    );
  }

  setSource(source: string): void {
    this.source = source;
    this.controller.reset();
  }

  getSource(): string {
    return this.source;
  }

  parseAndLoad(): void {
    if (!this.source) return;
    
    this.tree = this.parser.parse(this.source);
    const steps = this.parser.createExecutionSteps(this.tree);
    this.controller.loadSteps(steps);
  }

  getTree(): any {
    return this.tree;
  }

  stepForward(): boolean {
    return this.controller.stepForward();
  }

  stepBackward(): boolean {
    return this.controller.stepBackward();
  }

  playAll(delay?: number): void {
    this.controller.playAll(delay);
  }

  pause(): void {
    this.controller.pause();
  }

  reset(): void {
    this.controller.reset();
  }

  goToStep(index: number): boolean {
    return this.controller.goToStep(index);
  }

  getCallStack(): CallStack {
    return this.callStack;
  }

  getConsole(): Console {
    return this.console;
  }

  getController(): ExecutionController {
    return this.controller;
  }

  // subscription methods below
  
  subscribeToExecution(listener: TExecutionListener): () => void {
    return this.controller.subscribe(listener);
  }

  subscribeToCallStack(listener: TCallStackListener): () => void {
    return this.callStack.subscribe(listener);
  }

  subscribeToConsole(listener: TConsoleListener): () => void {
    return this.console.subscribe(listener);
  }
}