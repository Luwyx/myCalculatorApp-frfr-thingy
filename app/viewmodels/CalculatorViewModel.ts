// app/viewmodels/CalculatorViewModel.ts
import { useState } from 'react';
import { Calculator } from '../models/Calculator';
import { v4 as uuidv4 } from 'uuid';
import { evaluate } from 'mathjs';

export const useCalculatorViewModel = () => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);

  const addCalculator = (name: string) => {
    const newCalculator: Calculator = {
      id: uuidv4(),
      name,
      expression: '',
      result: '',
    };
    setCalculators([...calculators, newCalculator]);
  };

  const deleteCalculator = (id: string) => {
    setCalculators(calculators.filter(calculator => calculator.id !== id));
  };

  const updateCalculatorName = (id: string, newName: string) => {
    setCalculators(
      calculators.map(calculator =>
        calculator.id === id ? { ...calculator, name: newName } : calculator
      )
    );
  };

  const updateCalculatorExpression = (id: string, newExpression: string) => {
    setCalculators(
      calculators.map(calculator =>
        calculator.id === id ? { ...calculator, expression: newExpression } : calculator
      )
    );
  };

  const evaluateExpression = (id: string) => {
    setCalculators(
      calculators.map(calculator => {
        if (calculator.id === id) {
          try {
            const result = evaluate(calculator.expression);
            return { ...calculator, result: result.toString(), expression: '' }; // Clear expression after evaluation
          } catch (error) {
            return { ...calculator, result: 'Error', expression: '' }; // Clear expression after evaluation
          }
        }
        return calculator;
      })
    );
  };

  const clearCalculator = (id: string) => {
    setCalculators(
      calculators.map(calculator =>
        calculator.id === id ? { ...calculator, expression: '', result: '' } : calculator
      )
    );
  };

  const backspace = (id: string) => {
    setCalculators(
      calculators.map(calculator =>
        calculator.id === id
          ? { ...calculator, expression: calculator.expression.slice(0, -1) }
          : calculator
      )
    );
  };

  return {
    calculators,
    addCalculator,
    deleteCalculator,
    updateCalculatorName,
    updateCalculatorExpression,
    evaluateExpression,
    clearCalculator,
    backspace,
  };
};
