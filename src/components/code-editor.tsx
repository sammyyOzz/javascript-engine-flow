import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  value: string | undefined;
  handleChange: (value: string | undefined) => void; 
  [anyProp: string]: any;
}

function CodeEditor({ value, handleChange, ...props }: CodeEditorProps) {
  return (
    <>
      <Editor
        width="100%"
        height="100%"
        theme="hc-black"
        defaultLanguage="javascript"
        value={value}
        onChange={handleChange}
        {...props}
      />
    </>
  );
}

export default CodeEditor;
