import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Image, Platform, Alert, SafeAreaView } from "react-native";
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const db = Platform.OS !== "web" ? SQLite.openDatabaseSync("provas.db") : null;

export default function Task({ navigation }) {
  const [provas, setProvas] = useState([]);

  async function loadProvas() {
    if (Platform.OS === "web") {
      try {
        const stored = await AsyncStorage.getItem("provas");
        const parsed = stored ? JSON.parse(stored) : [];
        setProvas(parsed);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const rows = db.getAllSync("SELECT * FROM provas;");
        setProvas(rows);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function deleteProva(id, index) {
    if (Platform.OS === "web") {
      try {
        const stored = await AsyncStorage.getItem("provas");
        let provas = stored ? JSON.parse(stored) : [];
        provas.splice(index, 1);
        await AsyncStorage.setItem("provas", JSON.stringify(provas));
        setProvas(provas);
        Alert.alert("Sucesso", "Prova excluída!");
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Não foi possível excluir a prova.");
      }
    } else {
      try {
        db.runSync("DELETE FROM provas WHERE id = ?;", [id]);
        loadProvas();
        Alert.alert("Sucesso", "Prova excluída!");
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Não foi possível excluir a prova.");
      }
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadProvas();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: "#1e90ff", fontSize: 18 }}>
              {"< Voltar"}
            </Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Provas</Text>
            <Text style={styles.subtitle}>
              {provas.length} Provas Cadastradas
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
        >
          {provas.map((prova, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Questions", { prova })}
                style={{ flex: 1 }}
              >
                <Text style={styles.cardTitle}>{prova.title}</Text>
                {prova.description ? (
                  <Text style={styles.cardSubject}>{prova.description}</Text>
                ) : (
                  <Text style={styles.cardSubject}>Sem descrição</Text>
                )}
                {prova.image ? (
                  <Image
                    source={{ uri: prova.image }}
                    style={styles.cardImage}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteProva(prova.id, index)}
              >
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("NewTask")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubject: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
  },
  cardImage: {
    marginTop: 10,
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1e90ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
});
