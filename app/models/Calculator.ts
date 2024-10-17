  // app/models/Calculator.ts
  export interface Calculator {
    id: string;
    name: string;
    expression: string;
    result: string;
    lastExpression?: string; // New property to hold the last calculated expression
  }
