const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [
  {
    id: "ef7671ed-7c67-49e4-89af-2a5229c27164",
    title: "Repositório #1602719657830",
    url: "http://github.com/igorluciano/gostack-repositorio-1602719657830",
    techs: ["ReactJS"],
    likes: 2,
  },
  {
    id: "9c9f9c82-e892-40c5-9e78-0d4340db1964",
    title: "Repositório #1602719669653",
    url: "http://github.com/igorluciano/gostack-repositorio-1602719669653",
    techs: ["NodeJS"],
    likes: 5,
  },
];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json("ID not found");
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository id not found" });
  }

  const totalLikesBefore = repositories[repositoryIndex].likes;
  const repository = {
    id,
    title,
    url,
    techs,
    likes: totalLikesBefore,
  };

  repositories[repositoryIndex] = repository;
  return response.status(201).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Repository id not found" });
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not exist" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Repository id not found" });
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status().json({ error: "Repository not exist" });
  }

  const repository = repositories[repositoryIndex];
  repository.likes = repository.likes + 1;

  repositories[repositoryIndex] = repository;
  return response.status(200).json(repository);
});

module.exports = app;
