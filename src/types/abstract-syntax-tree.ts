export type TCodeSnippetType =
  | "ExpressionStatement"
  | "FunctionDeclaration"
  | "VariableDeclaration"
  | "IfStatement"
  | "SwitchStatement"
  | "ForStatement"
  | "WhileStatement"
  | "DoWhileStatement"
  | "ReturnStatement";

export interface ILocation {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}
