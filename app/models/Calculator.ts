  // app/models/Calculator.ts
  export interface Calculator {
    id: string;
    name: string;
    expression: string;
    result: string;
    lastExpression?: string;
  }
