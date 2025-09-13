import { useJsEngineContext } from "@/context/js-engine-context";
import { Badge } from "./ui/badge";
import { RenderIf } from "./render-if";
import { AnimatePresence, motion } from "framer-motion";

function CallStack() {
  const { callStack } = useJsEngineContext();

  return (
    <div className="w-1/2 relative p-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded">
      <div className="flex flex-col justify-end h-full pt-4 bg-black rounded relative">
        <Badge className="absolute text-md -top-3 left-1/2 -translate-x-1/2 px-2">
          Call Stack
        </Badge>

        <AnimatePresence mode="popLayout">
          {callStack.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="border border-white p-2 m-2 rounded bg-gray-800 text-white shadow-md"
            >
              <p className="font-medium">{item.functionName}</p>

              <RenderIf condition={Object.keys(item.variables).length > 0}>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pl-2 overflow-hidden"
                >
                  <p className="text-sm">
                    <em>Args:</em>
                  </p>
                  <ul>
                    {Object.entries(item.variables).map(
                      ([varName, varValue]) => (
                        <li key={varName} className="text-xs">
                          {String(varValue)}
                        </li>
                      ),
                    )}
                  </ul>
                </motion.div>
              </RenderIf>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CallStack;
