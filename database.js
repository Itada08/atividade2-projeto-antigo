import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("provas.db");

export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS provas ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image TEXT );
    CREATE TABLE IF NOT EXISTS questoes ( id INTEGER PRIMARY KEY AUTOINCREMENT, prova_id INTEGER, title TEXT, description TEXT, image TEXT );
  `);
}

export function addQuestao(prova_id, title, description, image) {
  db.runSync(
    "INSERT INTO questoes (prova_id, title, description, image) VALUES (?, ?, ?, ?);",
    [prova_id, title, description, image]
  );
}

export function getQuestoes(prova_id, callback) {
  const rows = db.getAllSync(
    "SELECT * FROM questoes WHERE prova_id = ?;",
    [prova_id]
  );
  callback(rows);
}