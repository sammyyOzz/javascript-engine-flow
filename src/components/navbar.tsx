import { useJsEngineContext } from "@/context/js-engine-context";
import { Button } from "./ui/button";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

function Navbar() {
  const {
    tree,
    parseSource,
    isExecuting,
    canStepForward,
    canStepBackward,
    stepForward,
    stepBackward,
    playAll,
    pause,
    reset,
  } = useJsEngineContext();
  
  console.log(tree);

  const handleParseClick = () => {
    try {
      parseSource();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex items-center h-15 pl-4 bg-black">
      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleParseClick}>
          Parse
        </Button>

        <Button
          onClick={stepBackward}
          disabled={!canStepBackward}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
        >
          <SkipBack size={16} />
          Step Back
        </Button>

        {isExecuting ? (
          <Button
            onClick={pause}
            className="flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded"
          >
            <Pause size={16} />
            Pause
          </Button>
        ) : (
          <Button
            onClick={playAll}
            disabled={!canStepForward}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
          >
            <Play size={16} />
            Play All
          </Button>
        )}

        <Button
          onClick={stepForward}
          disabled={!canStepForward}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
        >
          <SkipForward size={16} />
          Step Forward
        </Button>

        <Button
          onClick={reset}
          className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          <RotateCcw size={16} />
          Reset
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
