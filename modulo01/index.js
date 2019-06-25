const express = require("express");

const server = express();

server.use(express.json());

const users = ["Diego", "Robson", "Victor"];

server.use((req, res, next) => {
  console.time('Request')
  console.log(`Método: ${req.method}  URL: ${req.url}`)
  next()

  console.timeEnd('Request')
})

function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' })
  }
  next()
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index]

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' })
  }

  req.user = user

  next()
}

server.get("/users", (req, res) => {
  console.log(users)
  users.push('Bruno')

  res.json(users);

});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;

  users.push(name);
  res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUsersExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  res.send();
});

server.listen(3000);
