import { useJsEngineContext } from "@/context/js-engine-context";
import { Button } from "./ui/button";

function Navbar() {
  const { parseSource, tree } = useJsEngineContext();
  console.log(tree);

  const handleParseClick = () => {
    try {
      parseSource();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="h-15 bg-black">
      <Button variant="secondary" onClick={handleParseClick}>
        Parse
      </Button>
    </div>
  );
}

export default Navbar;
