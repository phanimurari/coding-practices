const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasStatusAndPriorityProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasStatusProperties = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasStatusProperties = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodoQuery = "";
  const { search_q = "", status, priority } = request.query;
  switch (true) {
    case hasStatusAndPriorityProperties(request.query):
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND status = '${status}'
            AND priority = '${priority}';`;
      break;
    case hasPriorityProperties(request.query):
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'
            AND priority = '${priority}';`;
      break;
    case hasStatusProperties(request.query):
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND status = '${status}';`;
      break;
    default:
      getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;
  }
  data = await database.all(getTodosQuery);
  response.send(data);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT 
      *
    FROM 
      todo
    WHERE 
      id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(todo);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addQuery = `INSERT INTO todo(id,todo,priority,status) VALUES(${id},'${todo}','${priority}','${status}');`;
  await database.run(addQuery);
  send.response("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.priority !== undefined:
      updateColumn = "Priority";
      break;
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
  }
  const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;
  const previousTodo = await database.get(previousTodoQuery);

  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
  } = request.body;
  const updateQuery = `UPDATE
    todo
  SET
    id = ${todoId},
    todo = '${todo}',
     priority= '${priority}',
     status= '${status}'
  WHERE
    id = ${todoId};`;
  await database.run(updateQuery);
  response.send(`${updateColumn} Updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const deleteQuery = `DELETE FROM todo WHERE id = ${todoId};`;
  await database.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
