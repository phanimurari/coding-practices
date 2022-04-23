const express = require("express");

const app = express();

app.get("/", (request, response) => {
  const homePageText = "Home Page";

  response.send(homePageText);
});

app.get("/about", (request, response) => {
  const aboutPageText = "About Page";

  response.send(aboutPageText);
});

app.listen(3000);

module.exports = app;
