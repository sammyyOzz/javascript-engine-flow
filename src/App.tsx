import { useState } from "react";
import "./App.css";
import CodeEditor from "./components/code-editor";
import { parse } from "abstract-syntax-tree";
import { Badge } from "./components/ui/badge";
import TwinArrows from "./components/twin-arrows";

function App() {
  const [source, setSource] = useState<string | undefined>(
    "// some default comment"
  );

  const tree = parse(source);
  console.log(tree);

  return (
    <>
      <div className="flex h-[90vh] w-full gap-4">
        {/* column 1 */}
        <div className="flex flex-col gap-4 w-1/2">
          <div className="h-2/3">
            <CodeEditor
              value={source}
              handleChange={(value) => setSource(value)}
            />
          </div>
          <div className="h-1/3 bg-black relative">
            <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
              Console
            </Badge>
          </div>
        </div>

        {/* column 2 */}
        <div className="flex flex-col gap-4 w-1/2">
          <div className="flex h-3/5 gap-4">
            {/* Call Stack */}
            <div className="w-1/2 relative p-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded">
              <div className="h-full bg-black rounded relative">
                <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
                  Call Stack
                </Badge>
              </div>
            </div>
            
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
    </>
  );
}

export default App;