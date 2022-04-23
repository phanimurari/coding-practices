const express = require("express");

const app = express();

app.get("/", (request, response) => {
  const todayDate = new Date();
  const dateInTodayDate = todayDate.getDate();
  const monthInTodayDate = todayDate.getMonth() + 1;
  const yearInTodayDate = todayDate.getFullYear();

  const formattedTodayDate = `${dateInTodayDate}-${monthInTodayDate}-${yearInTodayDate}`;

  response.send(formattedTodayDate);
});

module.exports = app;
