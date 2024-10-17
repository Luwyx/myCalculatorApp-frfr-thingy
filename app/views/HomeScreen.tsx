// app/views/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import { useCalculatorContext } from "../context/CalculatorContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export const HomeScreen: React.FC = () => {
  const { calculators, addCalculator, deleteCalculator, updateCalculatorName } =
    useCalculatorContext();
  const [newCalculatorName, setNewCalculatorName] = useState("");
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const generateDefaultName = () => `Calculator (${calculators.length + 1})`;

  useEffect(() => {
    // Show welcome toast when the app is first launched
    Toast.show({
      text1: "Velkommen!",
      position: "top",
      type: "success",
      visibilityTime: 2000,
    });
  }, []);

  const handleAddCalculator = () => {
    const newName = newCalculatorName || generateDefaultName();
    const newId = addCalculator(newName); // Get the new calculator ID
    setNewCalculatorName("");
    // Navigate to the calculator screen after adding a calculator
    navigation.navigate("Calculator", { calculatorId: newId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculators</Text>
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.calculatorItem}>
            <TouchableOpacity
              style={styles.calculatorNameContainer}
              onPress={() =>
                navigation.navigate("Calculator", { calculatorId: item.id })
              }
            >
              <Text style={styles.calculatorName}>{item.name}</Text>
              {item.lastExpression && (
                <Text style={styles.lastResult}>
                  {item.lastExpression} = {item.result}
                </Text>
              )}
            </TouchableOpacity>
            <Button
              title="Edit"
              onPress={() => {
                const newName =
                  prompt("Enter new calculator name:", item.name) ||
                  item.name;
                updateCalculatorName(item.id, newName);
              }}
            />
            <Button
              title="Delete"
              onPress={() => deleteCalculator(item.id)}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddCalculator}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 16 
  },
  listContent: {
    paddingBottom: 150, // Added padding to ensure last item isn't hidden behind button
  },
  calculatorItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  calculatorNameContainer: { 
    flex: 1 
  },
  calculatorName: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  lastResult: { 
    fontSize: 16, 
    color: "#666" 
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 30,
  },
});

export default HomeScreen;
