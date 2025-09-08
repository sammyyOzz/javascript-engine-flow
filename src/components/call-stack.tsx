import { useJsEngineContext } from "@/context/js-engine-context";
import { Badge } from "./ui/badge";
import { RenderIf } from "./render-if";

function CallStack() {
  const { callStack } = useJsEngineContext();

  return (
    <div className="w-1/2 relative p-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded">
      <div className="flex flex-col justify-end h-full pt-4 bg-black rounded relative">
        <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
          Call Stack
        </Badge>
        {callStack.map((item, index) => (
          <div
            key={index}
            className="border border-white p-2 m-2 rounded bg-gray-800 text-white"
          >
            <p>{item.functionName}</p>
            <RenderIf condition={Object.keys(item.variables).length > 0}>
              <div className="pl-2">
                <p className="text-sm">
                  <em>Args:</em>
                </p>
                <ul>
                  {Object.entries(item.variables).map(([varName, varValue]) => (
                    <li key={varName} className="text-xs">
                      {String(varValue)}
                    </li>
                  ))}
                </ul>
              </div>
            </RenderIf>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CallStack;
