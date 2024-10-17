// app/views/CalculatorScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useCalculatorContext } from "../context/CalculatorContext";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import Toast from "react-native-toast-message";

type CalculatorScreenRouteProp = RouteProp<RootStackParamList, "Calculator">;

interface CalculatorScreenProps {
  route: CalculatorScreenRouteProp;
}

const ButtonComponent = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  route,
}) => {
  const { calculatorId } = route.params;
  const {
    calculators,
    updateCalculatorExpression,
    evaluateExpression,
    clearCalculator,
    backspace,
  } = useCalculatorContext();
  const calculator = calculators.find((c) => c.id === calculatorId);

  const [lastInputWasOperator, setLastInputWasOperator] = useState(false);

  if (!calculator) {
    return <Text>Calculator not found</Text>;
  }

  useEffect(() => {
    if (calculator.result === "69" || calculator.result === "80085") {
      Toast.show({
        text1: "Nice!",
        position: "top",
        type: "success",
        visibilityTime: 2000,
      });
    }
  }, [calculator.result]);

  const handleButtonPress = (value: string) => {
    let updatedExpression = calculator.expression;

    // Handle parentheses
    if (value === "( )") {
      const openParentheses = (calculator.expression.match(/\(/g) || []).length;
      const closeParentheses = (calculator.expression.match(/\)/g) || [])
        .length;

      if (openParentheses > closeParentheses) {
        updatedExpression += ")";
      } else {
        updatedExpression += "(";
      }
      setLastInputWasOperator(false);
    } else if (value === ".") {
      if (
        calculator.expression === "" ||
        /[+\-*/%]$/.test(calculator.expression)
      ) {
        updatedExpression += "0.";
      } else {
        updatedExpression += ".";
      }
      setLastInputWasOperator(false);
    } else if (/[+\-*/%]/.test(value)) {
      // Handle operator press
      if (calculator.result && !calculator.expression) {
        // If there's a result and expression is empty, start a new expression with the result and operator
        updatedExpression = calculator.result + value;
      } else if (/[+\-*/%]$/.test(updatedExpression)) {
        // Replace the last operator with the new one if it's an operator
        updatedExpression = updatedExpression.slice(0, -1) + value;
      } else {
        // Append operator if not at the end of the expression
        updatedExpression += value;
      }
      setLastInputWasOperator(true);
    } else {
      // Handle number press
      if (calculator.result && !calculator.expression) {
        // If a result is displayed and the expression is empty, start a new expression with the number
        updatedExpression = value;
      } else if (lastInputWasOperator) {
        // If the last input was an operator, append the number after the operator
        updatedExpression += value;
      } else {
        // Append number
        updatedExpression += value;
      }
      setLastInputWasOperator(false);
    }

    updateCalculatorExpression(calculator.id, updatedExpression);
  };

  const handleEqualsPress = () => {
    let updatedExpression = calculator.expression;

    // Auto-close unclosed parentheses
    const openParentheses = (updatedExpression.match(/\(/g) || []).length;
    const closeParentheses = (updatedExpression.match(/\)/g) || []).length;

    if (openParentheses > closeParentheses) {
      updatedExpression += ")".repeat(openParentheses - closeParentheses);
    }

    // Evaluate the expression
    evaluateExpression(calculator.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        {calculator.lastExpression ? (
          <Text style={styles.lastExpression}>{calculator.lastExpression}</Text>
        ) : null}
        <Text style={styles.result}>
          {calculator.expression || calculator.result || "0"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        <View style={styles.row}>
          <ButtonComponent label="√" onPress={() => handleButtonPress("sqrt(")} />
          <ButtonComponent label="π" onPress={() => handleButtonPress("pi")} />
          <ButtonComponent label="^" onPress={() => handleButtonPress("^")} />
          <ButtonComponent label="!" onPress={() => handleButtonPress("!")} />
        </View>
        <View style={styles.row}>
          <ButtonComponent
            label="AC"
            onPress={() => clearCalculator(calculator.id)}
          />
          <ButtonComponent label="( )" onPress={() => handleButtonPress("( )")} />
          <ButtonComponent label="%" onPress={() => handleButtonPress("%")} />
          <ButtonComponent label="/" onPress={() => handleButtonPress("/")} />
        </View>

        <View style={styles.row}>
          <ButtonComponent label="7" onPress={() => handleButtonPress("7")} />
          <ButtonComponent label="8" onPress={() => handleButtonPress("8")} />
          <ButtonComponent label="9" onPress={() => handleButtonPress("9")} />
          <ButtonComponent label="*" onPress={() => handleButtonPress("*")} />
        </View>
        <View style={styles.row}>
          <ButtonComponent label="4" onPress={() => handleButtonPress("4")} />
          <ButtonComponent label="5" onPress={() => handleButtonPress("5")} />
          <ButtonComponent label="6" onPress={() => handleButtonPress("6")} />
          <ButtonComponent label="-" onPress={() => handleButtonPress("-")} />
        </View>
        <View style={styles.row}>
          <ButtonComponent label="1" onPress={() => handleButtonPress("1")} />
          <ButtonComponent label="2" onPress={() => handleButtonPress("2")} />
          <ButtonComponent label="3" onPress={() => handleButtonPress("3")} />
          <ButtonComponent label="+" onPress={() => handleButtonPress("+")} />
        </View>
        <View style={styles.row}>
          <ButtonComponent label="0" onPress={() => handleButtonPress("0")} />
          <ButtonComponent label="." onPress={() => handleButtonPress(".")} />
          <ButtonComponent label="=" onPress={handleEqualsPress} />
          <ButtonComponent label="⌫" onPress={() => backspace(calculator.id)} />
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  lastExpression: { fontSize: 16, color: "#666" },
  result: { fontSize: 32, fontWeight: "bold" },
  buttonsContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: { color: "#fff", fontSize: 20 },
});

