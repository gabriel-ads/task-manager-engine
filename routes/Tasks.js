const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { privateKey } = require("../globalVariables.js");
const authenticate = require("../middleware/authenticate.js");
const Task = require("../core/task.js");

const task = new Task();

router.get("/", authenticate, (req, res) => {
  task.Get(({ result, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    res.status(200).json(result);
  });
});

router.post("/create", authenticate, async (req, res) => {
  const accessToken = req.headers["authorization"];
  console.log(accessToken);
  console.log(req.headers["authorization"]);

  const decodedUserId = jwt.verify(
    accessToken,
    privateKey,
    (error, decoded) => {
      if (error) {
        res.status(400).send("Access Denied. No token provided.");
        return;
      }

      return decoded.user.id;
    }
  );

  const taskInputs = {
    title: req.body.title,
    description: req.body.description,
  };

  if (!taskInputs.title) {
    return res.status(400).send("O título deve ser preenchido");
  }

  if (decodedUserId)
    task.Create(taskInputs, decodedUserId, ({ result, error }) => {
      if (error) res.status(500).send("Internal Server Error");
      res.status(201).json(result);
    });
});

router.put("/update/:id", authenticate, async (req, res) => {
  const taskUpdateInputs = {
    id: parseInt(req.params.id),
    title: req.body.title,
    description: req.body.description,
  };

  task.Update(taskUpdateInputs, ({ result, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    res.status(200).json(result);
  });
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  const id = parseInt(req.params.id);

  task.Delete(id, ({ result, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    res.status(200).send(result);
  });
});

module.exports = router;
