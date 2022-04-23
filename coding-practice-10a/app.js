const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const bcrypt = require("bcrypt");

const app = express();

const databasePath = path.join(__dirname, "covid19IndiaPortal.db");

let db = null;

app.use(express.json());

const initializingDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,

      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server And Db Initialized Successfully");
    });
  } catch (e) {
    console.log(`DbError: ${e.message}`);

    process.exit(1);
  }
};

initializingDbAndServer();

app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;

  const databaseUser = await db.get(selectUserQuery);

  if (databaseUser === undefined) {
    response.status(400);

    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,

      databaseUser.password
    );

    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };

      const jwtToken = jwt.sign(
        payload,

        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFodWwiLCJnZW5kZXIiOiJNYWxlIiwibG9jYXRpb24iOiJoeWRlcmFiYWQiLCJpYXQiOjE2MTc0MzI0MDd9.Eqevw5QE70ZAVrmOZUc6pflUbeI0ffZUmQLDHYplU8g"
      );

      response.send({ jwtToken });
    } else {
      response.status(400);

      response.send("Invalid password");
    }
  }
});
