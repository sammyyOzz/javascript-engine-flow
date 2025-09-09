import type { ILocation, TCodeSnippetType } from "./abstract-syntax-tree";

export interface IExecutionStep {
  node: any;
  index: number;
  type: TCodeSnippetType;
  status: 'pending' | 'executing' | 'completed';
}

export interface ICallStackItem {
  id: string;
  functionName: string;
  variables: Record<string, any>;
  executionContext?: string;
}

export interface IConsoleLog {
  message: string;
  timestamp: number;
  type: 'log' | 'error' | 'warn' | 'info';
}

export interface IExecutionState {
  steps: IExecutionStep[];
  currentIndex: number;
  isRunning: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  highlightLocation: ILocation | null;
}

// listeners
export type TConsoleListener = (logs: IConsoleLog[]) => void;
export type TCallStackListener = (stack: ICallStackItem[]) => void;
export type TExecutionListener = (state: IExecutionState) => void;
