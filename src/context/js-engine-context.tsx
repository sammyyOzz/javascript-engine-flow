import { simpleCode } from "@/constants/code-samples";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { JSEngine } from "@/classes/js-engine";
import type { 
  IExecutionState, 
  ICallStackItem, 
  IConsoleLog 
} from "@/types/js-engine";
import type { ILocation } from "@/types/abstract-syntax-tree";

interface JsEngineContextType {
  // source code management
  source: string;
  handleSourceChange: (value: string) => void;
  tree: any;
  parseSource: () => void;
  
  // execution state
  executionState: IExecutionState;
  callStack: ICallStackItem[];
  consoleLogs: IConsoleLog[];
  highlightLocation: ILocation | null;
  
  // control methods
  stepForward: () => void;
  stepBackward: () => void;
  playAll: (delay?: number) => void;
  pause: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
  
  // engine instance
  engine: JSEngine;
}

interface JsEngineProviderProps {
  children: React.ReactNode;
}

const JsEngineContext = createContext<JsEngineContextType | null>(null);

export const useJsEngineContext = () => {
  const context = useContext(JsEngineContext);
  if (!context) {
    throw new Error("Must be within a JsEngineProvider");
  }
  return context;
};

export const JsEngineProvider: React.FC<JsEngineProviderProps> = ({
  children,
}) => {
  const engineRef = useRef<JSEngine>(new JSEngine());
  const engine = engineRef.current;

  const [source, setSource] = useState<string>(simpleCode);
  const [tree, setTree] = useState<any>(null);
  const [executionState, setExecutionState] = useState<IExecutionState>({
    steps: [],
    currentIndex: -1,
    isRunning: false,
    canStepForward: false,
    canStepBackward: false,
    highlightLocation: null
  });
  const [callStack, setCallStack] = useState<ICallStackItem[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<IConsoleLog[]>([]);

  // subscribe to engine events
  useEffect(() => {
    const unsubscribeExecution = engine.subscribeToExecution(setExecutionState);
    const unsubscribeCallStack = engine.subscribeToCallStack(setCallStack);
    const unsubscribeConsole = engine.subscribeToConsole(setConsoleLogs);

    // initialize with current source code
    engine.setSource(source);
    
    return () => {
      unsubscribeExecution();
      unsubscribeCallStack();
      unsubscribeConsole();
    };
  }, []);

  useEffect(() => {
    engine.setSource(source);
    setTree(null);
  }, [source]);

  const handleSourceChange = (value: string) => {
    setSource(value);
  };

  const parseSource = () => {
    engine.parseAndLoad();
    setTree(engine.getTree());
  };

  const stepForward = () => {
    engine.stepForward();
  };

  const stepBackward = () => {
    engine.stepBackward();
  };

  const playAll = (delay?: number) => {
    engine.playAll(delay);
  };

  const pause = () => {
    engine.pause();
  };

  const reset = () => {
    engine.reset();
  };

  const goToStep = (index: number) => {
    engine.goToStep(index);
  };

  const contextValue: JsEngineContextType = {
    source,
    handleSourceChange,
    tree,
    parseSource,
    executionState,
    callStack,
    consoleLogs,
    highlightLocation: executionState.highlightLocation,
    stepForward,
    stepBackward,
    playAll,
    pause,
    reset,
    goToStep,
    engine
  };

  return (
    <JsEngineContext.Provider value={contextValue}>
      {children}
    </JsEngineContext.Provider>
  );
};