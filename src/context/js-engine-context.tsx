import { simpleCode } from "@/constants/code-samples";
import React, { createContext, useContext, useState, useRef } from "react";
import { parse } from "abstract-syntax-tree";
import type { ILocation, TCodeSnippetType } from "@/types/abstract-syntax-tree";

interface ExecutionStep {
  node: any;
  index: number;
  type: TCodeSnippetType;
  status: 'pending' | 'executing' | 'completed';
}

interface JsEngineContextType {
  source: string | undefined;
  handleSourceChange: (value: string | undefined) => void;
  tree: any;
  parseSource: () => void;
  callStack: any[];
  consoleLogs: string[];
  highlightLocation?: ILocation | null;
  
  // step-by-step execution
  executionSteps: ExecutionStep[];
  currentStepIndex: number;
  isExecuting: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  
  // controls
  stepForward: () => void;
  stepBackward: () => void;
  playAll: () => void;
  pause: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
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
  const [source, setSource] = useState<string | undefined>(simpleCode);
  const [tree, setTree] = useState(null);
  const [callStack] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [highlightLocation, setHighlightLocation] = useState<ILocation | null>(null);
  
  // step execution state
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleSourceChange = (value: string | undefined) => {
    setSource(value);
    reset();
  };

  const executeStep = (step: ExecutionStep) => {
    const { node, type } = step;
    
    if (type === "ExpressionStatement" && 
        node.expression.type === "CallExpression" && 
        node.expression.callee.object.name === "console") {
      
      const args = node.expression.arguments;
      const logMessage = args.map((arg: any) => arg.value).join(" ");
      setConsoleLogs((prevLogs) => [...prevLogs, logMessage]);
      
      const location = node.loc as ILocation;
      setHighlightLocation(location);
    }
    
    // TODO: handle other node types
  };

  const undoStep = (step: ExecutionStep) => {
    const { node, type } = step;
    
    if (type === "ExpressionStatement" && 
        node.expression.type === "CallExpression" && 
        node.expression.callee.object.name === "console") {
      
      setConsoleLogs((prevLogs) => prevLogs.slice(0, -1));
    }
    
    // TODO: handle undoing other node types
  };

  const parseSource = () => {
    const _tree = parse(source, {
      loc: true,
      range: true,
      sourceType: "script",
    });
    setTree(_tree);

    const steps: ExecutionStep[] = _tree.body.map((node: any, index: number) => ({
      node,
      index,
      type: node.type,
      status: 'pending'
    }));

    setExecutionSteps(steps);
    setCurrentStepIndex(-1);
    setConsoleLogs([]);
    setHighlightLocation(null);
  };

  const stepForward = () => {
    if (currentStepIndex < executionSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const step = executionSteps[nextIndex];
      
      setExecutionSteps(prev => 
        prev.map((s, i) => 
          i === nextIndex 
            ? { ...s, status: 'executing' }
            : i < nextIndex 
              ? { ...s, status: 'completed' }
              : { ...s, status: 'pending' }
        )
      );
      
      executeStep(step);
      setCurrentStepIndex(nextIndex);
    }
  };

  const stepBackward = () => {
    if (currentStepIndex >= 0) {
      const currentStep = executionSteps[currentStepIndex];
      undoStep(currentStep);
      
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      
      setExecutionSteps(prev => 
        prev.map((s, i) => 
          i === prevIndex 
            ? { ...s, status: 'executing' }
            : i < prevIndex 
              ? { ...s, status: 'completed' }
              : { ...s, status: 'pending' }
        )
      );
      
      // update highlight to previous step or clear if at beginning
      if (prevIndex >= 0) {
        const prevStep = executionSteps[prevIndex];
        setHighlightLocation(prevStep.node.loc as ILocation);
      } else {
        setHighlightLocation(null);
      }
    }
  };

  const playAll = () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    
    const executeNextStep = () => {
      if (currentStepIndex < executionSteps.length - 1) {
        stepForward();
        autoPlayRef.current = setTimeout(executeNextStep, 1000); // 1 second delay
      } else {
        setIsExecuting(false);
      }
    };
    
    executeNextStep();
  };

  const pause = () => {
    setIsExecuting(false);
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const reset = () => {
    pause();
    setCurrentStepIndex(-1);
    setConsoleLogs([]);
    setHighlightLocation(null);
    setExecutionSteps(prev => 
      prev.map(step => ({ ...step, status: 'pending' as const }))
    );
  };

  const goToStep = (index: number) => {
    if (index < -1 || index >= executionSteps.length) return;
    
    pause();
    
    reset();
    
    // execute steps up to the target index
    for (let i = 0; i <= index; i++) {
      const step = executionSteps[i];
      executeStep(step);
    }
    
    setCurrentStepIndex(index);
    setExecutionSteps(prev => 
      prev.map((s, i) => 
        i === index 
          ? { ...s, status: 'executing' }
          : i < index 
            ? { ...s, status: 'completed' }
            : { ...s, status: 'pending' }
      )
    );
  };

  const canStepForward = currentStepIndex < executionSteps.length - 1;
  const canStepBackward = currentStepIndex >= 0;

  return (
    <JsEngineContext.Provider
      value={{
        source,
        handleSourceChange,
        tree,
        parseSource,
        callStack,
        highlightLocation,
        consoleLogs,
        executionSteps,
        currentStepIndex,
        isExecuting,
        canStepForward,
        canStepBackward,
        stepForward,
        stepBackward,
        playAll,
        pause,
        reset,
        goToStep,
      }}
    >
      {children}
    </JsEngineContext.Provider>
  );
};