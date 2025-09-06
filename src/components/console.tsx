import { useJsEngineContext } from "@/context/js-engine-context";
import { Badge } from "./ui/badge";
import { RenderIf } from "./render-if";

function Console() {
  const { consoleLogs } = useJsEngineContext();

  return (
    <div className="h-1/3 bg-black relative">
      <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
        Console
      </Badge>

      <div className="h-full overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          <RenderIf condition={consoleLogs && consoleLogs.length > 0}>
            {consoleLogs.map((log, index) => (
              <div key={index} className="text-green-400 text-sm">
                <span className="text-gray-500">{"> "}</span>{log}
              </div>
            ))}
          </RenderIf>
          <RenderIf condition={!consoleLogs || consoleLogs.length === 0}>
            <div className="text-gray-500 text-sm">No logs yet.</div>
          </RenderIf>
        </div>
      </div>
    </div>
  );
}

export default Console;
