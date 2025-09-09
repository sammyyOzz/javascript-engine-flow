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
    return tree.body.map((node: any, index: number) => ({
      node,
      index,
      type: node.type,
      status: 'pending' as const
    }));
  }
}