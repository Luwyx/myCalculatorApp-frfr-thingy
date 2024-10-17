// app/App.tsx
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./app/views/HomeScreen";
import { CalculatorScreen } from "./app/views/CalculatorScreen";
import { CalculatorProvider } from "./app/context/CalculatorContext";

export type RootStackParamList = {
  Home: undefined;
  Calculator: { calculatorId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <CalculatorProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={({ route }) => ({ title: route.params.calculatorId })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CalculatorProvider>
  );
};

export default App;
