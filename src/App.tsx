import { useEffect, useRef, useState } from "react";
import CodeEditor from "./components/code-editor";
import { Badge } from "./components/ui/badge";
import TwinArrows from "./components/icons/twin-arrows";
import type { IHighlightRange } from "./types/code-editor";
import Navbar from "./components/navbar";
import { useJsEngineContext } from "./context/js-engine-context";
import Console from "./components/console";
import CallStack from "./components/call-stack";

function App() {
  const { source, handleSourceChange, highlightLocation } =
    useJsEngineContext();

  const [editorIsReady, setEditorIsReady] = useState(false);

  const editorRef = useRef<any>(null);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    setEditorIsReady(true);
  };

  const highlightRange = ({
    startLine,
    startCol,
    endLine,
    endCol,
  }: IHighlightRange) => {
    if (editorRef.current) {
      editorRef.current.setSelection({
        startLineNumber: startLine,
        startColumn: startCol,
        endLineNumber: endLine,
        endColumn: endCol,
      });
    }
  };

  useEffect(() => {
    if (!editorIsReady) return;

    if (highlightLocation) {
      highlightRange({
        startLine: highlightLocation.start.line,
        startCol: highlightLocation.start.column,
        endLine: highlightLocation.end.line,
        endCol: highlightLocation.end.column,
      });
    } else {
      highlightRange({ startLine: 0, startCol: 0, endLine: 0, endCol: 0 });
    }
  }, [editorIsReady, highlightLocation]);

  return (
    <div className="flex flex-col h-screen gap-5 bg-gray-700">
      <Navbar />

      <div className="flex-1 px-6 pb-6">
        <div className="flex h-full w-full gap-4">
          {/* column 1 */}
          <div className="flex flex-col gap-4 w-1/2">
            <div className="h-2/3">
              <CodeEditor
                value={source}
                handleChange={(value) => handleSourceChange(value)}
                onMount={handleMount}
              />
            </div>
            <Console />
          </div>

          {/* column 2 */}
          <div className="flex flex-col gap-4 w-1/2">
            <div className="flex h-3/5 gap-4">
              <CallStack />

              {/* Web APIs */}
              <div className="w-1/2 relative p-[4px] bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded">
                <div className="h-full bg-black rounded relative">
                  <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
                    Web APIs
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex h-2/5 gap-4">
              <div className="flex justify-center items-center w-1/5 bg-black border-4 border-white rounded-sm relative">
                <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
                  Event Loop
                </Badge>

                <TwinArrows />
              </div>
              <div className="flex flex-col w-4/5 gap-4">
                {/* Task Queue */}
                <div className="h-1/2 relative p-1 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 rounded">
                  <div className="h-full bg-black rounded relative">
                    <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
                      Task Queue
                    </Badge>
                  </div>
                </div>

                {/* Microtask Queue */}
                <div className="h-1/2 relative p-1 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded">
                  <div className="h-full bg-black rounded relative">
                    <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
                      Microtask Queue
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
