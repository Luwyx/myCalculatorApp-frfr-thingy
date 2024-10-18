import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useCalculatorContext } from "../viewmodels/CalculatorContext";
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
    return <Text style={styles.errorText}>Calculator not found</Text>;
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

    if (value === "( )") {
      const openParentheses = (calculator.expression.match(/\(/g) || []).length;
      const closeParentheses = (calculator.expression.match(/\)/g) || [])
        .length;
      updatedExpression += openParentheses > closeParentheses ? ")" : "(";
      setLastInputWasOperator(false);
    } else if (value === ".") {
      updatedExpression +=
        calculator.expression === "" || /[+\-*/%]$/.test(calculator.expression)
          ? "0."
          : ".";
      setLastInputWasOperator(false);
    } else if (/[+\-*/%]/.test(value)) {
      if (calculator.result && !calculator.expression) {
        updatedExpression = calculator.result + value;
      } else if (/[+\-*/%]$/.test(updatedExpression)) {
        updatedExpression = updatedExpression.slice(0, -1) + value;
      } else {
        updatedExpression += value;
      }
      setLastInputWasOperator(true);
    } else {
      updatedExpression =
        calculator.result && !calculator.expression
          ? value
          : updatedExpression + value;
      setLastInputWasOperator(false);
    }

    updateCalculatorExpression(calculator.id, updatedExpression);
  };

  const handleEqualsPress = () => {
    let updatedExpression = calculator.expression;
    const openParentheses = (updatedExpression.match(/\(/g) || []).length;
    const closeParentheses = (updatedExpression.match(/\)/g) || []).length;
    if (openParentheses > closeParentheses) {
      updatedExpression += ")".repeat(openParentheses - closeParentheses);
    }
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
          <ButtonComponent
            label="√"
            onPress={() => handleButtonPress("sqrt(")}
          />
          <ButtonComponent label="π" onPress={() => handleButtonPress("pi")} />
          <ButtonComponent label="^" onPress={() => handleButtonPress("^")} />
          <ButtonComponent label="!" onPress={() => handleButtonPress("!")} />
        </View>
        <View style={styles.row}>
          <ButtonComponent
            label="AC"
            onPress={() => clearCalculator(calculator.id)}
          />
          <ButtonComponent
            label="( )"
            onPress={() => handleButtonPress("( )")}
          />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212", // Dark background color
  },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#1e1e1e", // Darker display background
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  lastExpression: { fontSize: 16, color: "#aaaaaa" }, // Lighter text for last expression
  result: { fontSize: 32, fontWeight: "bold", color: "#ffffff" }, // White text for result
  buttonsContainer: { paddingBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#007BFF", // Button color
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: { color: "#ffffff", fontSize: 20 }, // White text for buttons
  errorText: { color: "red", textAlign: "center", marginTop: 20 }, // Error message styling
});
