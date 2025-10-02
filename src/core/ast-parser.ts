import type { IExecutionStep } from "@/types/js-engine";
import { parse } from "abstract-syntax-tree";

export class ASTParser {
  parse(source: string): any {
    return parse(source, {
      loc: true,
      range: true,
      sourceType: "script",
    });
  }

  createExecutionSteps(tree: any): IExecutionStep[] {
    const steps: IExecutionStep[] = [];
    const functions = new Map<string, any>();
    let stepIndex = 0;

    // First pass: collect function declarations (hoisted)
    tree.body.forEach((node: any) => {
      if (node.type === "FunctionDeclaration" && node.id) {
        functions.set(node.id.name, node);
      }
    });

    // Second pass: process statements in execution order
    const processNode = (node: any): void => {
      if (node.type === "FunctionDeclaration") {
        // Skip function declarations in execution flow
        return;
      }

      if (
        node.type === "ExpressionStatement" &&
        node.expression.type === "CallExpression"
      ) {
        const callExpr = node.expression;

        // Check if it's a function call (not a method call)
        if (callExpr.callee.type === "Identifier") {
          const funcName = callExpr.callee.name;
          const funcDecl = functions.get(funcName);

          if (funcDecl) {
            // First add the function call itself
            steps.push({
              node,
              index: stepIndex++,
              type: node.type,
              status: "pending" as const,
            });

            // Then process the function body
            funcDecl.body.body.forEach((stmt: any) => {
              processNode(stmt);
            });
            return;
          }
        }
      }

      // Add this node as an execution step
      steps.push({
        node,
        index: stepIndex++,
        type: node.type,
        status: "pending" as const,
      });
    };

    // Process top-level statements
    tree.body.forEach((node: any) => {
      processNode(node);
    });

    return steps;
  }
}
