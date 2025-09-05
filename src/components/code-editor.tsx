import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  value: string | undefined;
  handleChange: (value: string | undefined) => void; 
}

function CodeEditor({ value, handleChange }: CodeEditorProps) {
  return (
    <>
      <Editor
        width="100%"
        height="100%"
        theme="hc-black"
        defaultLanguage="javascript"
        // defaultValue="// some comment"
        value={value}
        onChange={handleChange}
      />
    </>
  );
}

export default CodeEditor;
