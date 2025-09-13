import type { ILocation } from "@/types/abstract-syntax-tree";
import type { CallStack } from "./call-stack";
import type { Console } from "./console";
import type { ICallStackItem, IConsoleLog, IExecutionState, IExecutionStep, TExecutionListener } from "@/types/js-engine";
import { generateUniqueId } from "@/utils/generate-id";

export class ExecutionController {
  private steps: IExecutionStep[] = [];
  private currentIndex: number = -1;
  private isRunning: boolean = false;
  private autoPlayTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(state: IExecutionState) => void> = new Set();
  private callStack: CallStack;
  private console: Console;
  private poppedStackItems: ICallStackItem[] = [];
  // private parser: ASTParser;

  constructor(callStack: CallStack, console: Console) {
    this.callStack = callStack;
    this.console = console;
    // this.parser = parser;
  }

  loadSteps(steps: IExecutionStep[]): void {
    this.steps = steps;
    this.currentIndex = -1;
    this.notifyListeners();
  }

  stepForward(): boolean {
    if (!this.canStepForward()) return false;

    this.currentIndex++;

    // save popped items for possible redo;
    const poppedItem = this.callStack.pop();
    if (poppedItem) {
      this.poppedStackItems.push(poppedItem)
    }

    const step = this.steps[this.currentIndex];
    
    this.updateStepStatuses();
    this.executeStep(step);
    this.notifyListeners();
    
    return true;
  }

  stepBackward(): boolean {
    if (!this.canStepBackward()) return false;

    const currentStep = this.steps[this.currentIndex];
    this.undoStep(currentStep);
    
    this.currentIndex--;

    if (this.poppedStackItems.length > 0) {
      const itemToRestore = this.poppedStackItems.pop();
      if (itemToRestore) {
        this.callStack.push(itemToRestore);
      }
    }

    this.updateStepStatuses();
    this.notifyListeners();
    
    return true;
  }

  playAll(delay: number = 1000): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.notifyListeners();
    
    const executeNext = () => {
      if (this.stepForward()) {
        this.autoPlayTimer = setTimeout(executeNext, delay);
      } else {
        this.pause();
      }
    };
    
    executeNext();
  }

  pause(): void {
    this.isRunning = false;
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    this.notifyListeners();
  }

  reset(): void {
    this.pause();
    this.currentIndex = -1;
    this.callStack.clear();
    this.console.clear();
    
    this.steps = this.steps.map(step => ({ 
      ...step, 
      status: 'pending' as const 
    }));
    
    this.notifyListeners();
  }

  goToStep(index: number): boolean {
    if (index < -1 || index >= this.steps.length) return false;
    
    this.pause();
    this.reset();
    
    // execute steps up to target index
    for (let i = 0; i <= index; i++) {
      const step = this.steps[i];
      this.executeStep(step);
    }
    
    this.currentIndex = index;
    this.updateStepStatuses();
    this.notifyListeners();
    
    return true;
  }

  private executeStep(step: IExecutionStep): void {
    const { node, type } = step;

    const id = generateUniqueId("callstack-item");
    
    if (type === "ExpressionStatement" && 
        node.expression.type === "CallExpression" && 
        node.expression.callee.object?.name === "console") {
      
      const args = node.expression.arguments;
      const logMessage = args.map((arg: any) => arg.value).join(" ");
      const logType: IConsoleLog['type'] = node.expression.callee.property?.name || 'log';
      this.console.log(logMessage, logType);

      const formattedArgs: Record<string, any> = {};
      args.forEach((arg: any) => {
        formattedArgs[arg.name || arg.value] = arg.value;
      });
      
      this.callStack.push({ 
        id,
        functionName: `console.${logType}()`, 
        variables: formattedArgs 
      });
    }
    
    if (type === "FunctionDeclaration") {
      this.callStack.push({
        id,
        functionName: node.id.name,
        variables: {},
        executionContext: 'declaration'
      });
    }
    
    // TODO: Add more node type handlers
  }

  private undoStep(step: IExecutionStep): void {
    const { type } = step;
    
    if (type === "ExpressionStatement") {
      this.console.removeLastLog();
      this.callStack.pop();
    }
    
    if (type === "FunctionDeclaration") {
      this.callStack.pop();
    }
    
    // TODO: Add more undo handlers
  }

  private updateStepStatuses(): void {
    this.steps = this.steps.map((step, i) => ({
      ...step,
      status: i === this.currentIndex 
        ? 'executing' as const
        : i < this.currentIndex 
          ? 'completed' as const
          : 'pending' as const
    }));
  }

  canStepForward(): boolean {
    return this.currentIndex < this.steps.length - 1;
  }

  canStepBackward(): boolean {
    return this.currentIndex >= 0;
  }

  getCurrentStep(): IExecutionStep | null {
    return this.currentIndex >= 0 ? this.steps[this.currentIndex] : null;
  }

  getHighlightLocation(): ILocation | null {
    const currentStep = this.getCurrentStep();
    return currentStep?.node?.loc || null;
  }

  getExecutionState(): IExecutionState {
    return {
      steps: [...this.steps],
      currentIndex: this.currentIndex,
      isRunning: this.isRunning,
      canStepForward: this.canStepForward(),
      canStepBackward: this.canStepBackward(),
      highlightLocation: this.getHighlightLocation()
    };
  }

  subscribe(listener: TExecutionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getExecutionState()));
  }
}