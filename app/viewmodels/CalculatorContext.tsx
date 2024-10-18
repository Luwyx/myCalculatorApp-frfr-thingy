// app/context/CalculatorContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Calculator } from "../models/Calculator";
import { v4 as uuidv4 } from "uuid";
import { evaluate } from "mathjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CalculatorContextType {
  calculators: Calculator[];
  addCalculator: (name: string) => string;
  deleteCalculator: (id: string) => void;
  updateCalculatorName: (id: string, newName: string) => void;
  updateCalculatorExpression: (id: string, newExpression: string) => void;
  evaluateExpression: (id: string) => void;
  clearCalculator: (id: string) => void;
  backspace: (id: string) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

interface CalculatorProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "calculators";

export const CalculatorProvider: React.FC<CalculatorProviderProps> = ({
  children,
}) => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);

  useEffect(() => {
    const loadCalculators = async () => {
      try {
        const storedCalculators = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedCalculators) {
          setCalculators(JSON.parse(storedCalculators));
        }
      } catch (error) {
        console.error("Failed to load calculators from storage", error);
      }
    };
    loadCalculators();
  }, []);

  useEffect(() => {
    const saveCalculators = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(calculators));
      } catch (error) {
        console.error("Failed to save calculators to storage", error);
      }
    };
    saveCalculators();
  }, [calculators]);

  useEffect(() => {
    const clearStorage = () => {
      const asyncClearStorage = async () => {
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.error("Failed to clear calculators from storage", error);
        }
      };
      asyncClearStorage();
    };
    return clearStorage;
  }, []);

  const addCalculator = (name: string): string => {
    const newCalculator: Calculator = {
      id: uuidv4(),
      name,
      expression: "",
      result: "",
    };
    setCalculators([...calculators, newCalculator]);
    return newCalculator.id;
  };

  const deleteCalculator = (id: string) => {
    setCalculators(calculators.filter((calculator) => calculator.id !== id));
  };

  const updateCalculatorName = (id: string, newName: string) => {
    setCalculators(
      calculators.map((calculator) =>
        calculator.id === id ? { ...calculator, name: newName } : calculator
      )
    );
  };

  const updateCalculatorExpression = (id: string, newExpression: string) => {
    setCalculators(
      calculators.map((calculator) =>
        calculator.id === id
          ? { ...calculator, expression: newExpression }
          : calculator
      )
    );
  };

  const evaluateExpression = (id: string) => {
    setCalculators(
      calculators.map((calculator) => {
        if (calculator.id === id) {
          try {
            const result = evaluate(calculator.expression);
            return {
              ...calculator,
              result: result.toString(),
              lastExpression: calculator.expression,
              expression: "",
            };
          } catch (error) {
            return {
              ...calculator,
              result: "Error",
              lastExpression: calculator.expression,
              expression: "",
            };
          }
        }
        return calculator;
      })
    );
  };

  const clearCalculator = (id: string) => {
    setCalculators(
      calculators.map((calculator) =>
        calculator.id === id
          ? { ...calculator, expression: "", result: "" }
          : calculator
      )
    );
  };

  const backspace = (calculatorId: string) => {
    setCalculators((prevCalculators) =>
      prevCalculators.map((calc) => {
        if (calc.id === calculatorId) {
          return {
            ...calc,
            expression: calc.expression.slice(0, -1),
          };
        }
        return calc;
      })
    );
  };

  return (
    <CalculatorContext.Provider
      value={{
        calculators,
        addCalculator,
        deleteCalculator,
        updateCalculatorName,
        updateCalculatorExpression,
        evaluateExpression,
        clearCalculator,
        backspace,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculatorContext = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error(
      "useCalculatorContext must be used within a CalculatorProvider"
    );
  }
  return context;
};
