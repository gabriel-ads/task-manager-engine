const express = require("express");
const router = express.Router();
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
  const userId = req.user.id;

  const taskInputs = {
    title: req.body.title,
    description: req.body.description,
  };

  if (!taskInputs.title) {
    return res.status(400).send("O título deve ser preenchido");
  }

  if (userId)
    task.Create(taskInputs, userId, ({ result, error }) => {
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
