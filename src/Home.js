import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const db = Platform.OS !== "web" ? SQLite.openDatabaseSync("provas.db") : null;

export default function Home({ navigation }) {
  const [count, setCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "web") {
        const loadProvas = async () => {
          try {
            const stored = await AsyncStorage.getItem("provas");
            const parsed = stored ? JSON.parse(stored) : [];
            setCount(parsed.length);
          } catch (error) {
            console.log(error);
          }
        };
        loadProvas();
      } else {
        try {
          const result = db.getFirstSync("SELECT COUNT(*) as total FROM provas;");
          setCount(result?.total ?? 0);
        } catch (error) {
          console.log(error);
        }
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      <Ionicons name="school-outline" size={48} color="#fff" style={styles.icon} />

      <Text style={styles.title}>Banco de Questões</Text>

      <Text style={styles.subtitle}>
        Organize e reutilize suas provas e questões com facilidade.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardNumber}>{count}</Text>
        <Text style={styles.cardText}>Provas Cadastradas</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate("NewTask")}
        >
          <Text style={styles.buttonText}>Nova Prova</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Task")}
        >
          <Text style={styles.buttonText}>Ver Provas</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  cardText: {
    fontSize: 16,
    color: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  buttonPrimary: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});