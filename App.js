import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/Home";
import Task from "./src/Task";
import NewTask from "./src/NewTask";
import Questions from "./src/Questions"; 
import NewQuestions from "./src/NewQuestions"; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Task" component={Task} />
        <Stack.Screen name="NewTask" component={NewTask} />
        <Stack.Screen name="Questions" component={Questions} /> 
        <Stack.Screen name="NewQuestions" component={NewQuestions} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
