// app/views/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useCalculatorContext } from "../viewmodels/CalculatorContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const { calculators, addCalculator, deleteCalculator, updateCalculatorName } =
    useCalculatorContext();
  const [newCalculatorName, setNewCalculatorName] = useState("");
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const generateDefaultName = () => `Calculator (${calculators.length + 1})`;

  useEffect(() => {
    Toast.show({
      text1: "Welcome!",
      position: "top",
      type: "success",
      visibilityTime: 2000,
    });
  }, []);

  const handleAddCalculator = () => {
    const newName = newCalculatorName || generateDefaultName();
    const newId = addCalculator(newName);
    setNewCalculatorName("");
    navigation.navigate("Calculator", { calculatorId: newId });
  };

  const renderCalculatorItem = ({ item }: { item: any }) => (
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
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          const newName =
            prompt("Enter new calculator name:", item.name) || item.name;
          updateCalculatorName(item.id, newName);
        }}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteCalculator(item.id)}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculators</Text>
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={renderCalculatorItem}
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
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 150,
  },
  calculatorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  calculatorNameContainer: {
    flex: 1,
  },
  calculatorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  lastResult: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 30,
  },
});

export default HomeScreen;
