import { simpleCode } from "@/constants/code-samples";
import React, { createContext, useContext, useState } from "react";
import { parse } from "abstract-syntax-tree";

interface JsEngineContextType {
  source: string | undefined;
  handleSourceChange: (value: string | undefined) => void;
  tree: any;
  parseSource: () => void;
  callStack: any[];
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

  const handleSourceChange = (value: string | undefined) => {
    setSource(value);
  };

  const parseSource = () => {
    const _tree = parse(source, {
      loc: true,
      range: true,
      sourceType: "script",
    });
    setTree(_tree);
  };

  return (
    <JsEngineContext.Provider
      value={{
        source,
        handleSourceChange,
        tree,
        parseSource,
        callStack,
      }}
    >
      {children}
    </JsEngineContext.Provider>
  );
};
