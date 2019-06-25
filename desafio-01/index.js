const express = require("express");
const server = express();

server.use(express.json());

let count = 0;
const reqCounter = (req, res, next) => {
  count++;
  console.log(count);
  next();
};
server.use(reqCounter);

const projectExists = (req, res, next) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id == id);
  if (projectIndex === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  req.projectIndex = projectIndex;
  next();
};

const projects = [
  {
    id: "1123",
    title: "Project 1",
    tasks: ["task1", "task2"]
  },
  {
    id: "222",
    title: "Project 2",
    tasks: ["task3", "task4"]
  }
];

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  try {
    projects.push({
      id,
      title,
      tasks: []
    });

    res.json({ message: "Created with success!" });
  } catch ({ message: error }) {
    res.status(400).json({ error });
  }
});

server.get("/projects", (req, res) => {
  try {
    res.json(projects);
  } catch ({ message: error }) {
    res.status(500).send({ error });
  }
});

server.put("/projects/:id", projectExists, (req, res) => {
  try {
    projects[req.projectIndex].title = req.body.title;
    res.json(projects[req.projectIndex]);
  } catch ({ message: error }) {
    res.status(500).send({ error });
  }
});

server.delete("/projects/:id", projectExists, (req, res) => {
  try {
    projects.splice(req.projectIndex, 1);
    res.json({
      message: "Project deleted with success!"
    });
  } catch ({ message: error }) {
    res.status(400).json({ error });
  }
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  const { title } = req.body;
  try {
    projects[req.projectIndex].tasks.push(title);
    res.json(projects[req.projectIndex]);
  } catch ({ message: error }) {
    res.status(400).json({ error });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
