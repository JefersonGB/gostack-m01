const express = require("express");

const server = express();

server.use(express.json());

const users = ["Diego", "Robson", "Victor"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "User does not exists" });
  }
  return next();
}

//Lista todos
server.get("/users", (req, res) => {
  return res.json(users);
});

//Lista um
server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  return res.json(users[index]);
});

//Adiciona
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

//Atualiza
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});

//Deleta
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
