const express = require("express");

const app = express();

app.use(express.json());

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,

      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server running at http://localhost/3000");
    });
  } catch (e) {
    console.log(`DBERROR: ${e.message}`);

    process.exit(1);
  }
};

initializeDbAndServer();
