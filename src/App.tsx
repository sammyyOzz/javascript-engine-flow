import "./App.css";
import { Editor } from "@monaco-editor/react";

function App() {
  return (
    <>
      <Editor
        width="50vw"
        height="90vh"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue="// some comment"
      />
    </>
  );
}

export default App;
