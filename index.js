require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./core/user.js");
const Task = require("./core/task.js");
const authenticate = require("./middleware/authenticate.js");

const user = new User();
const task = new Task();
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.get("/tasks", authenticate, (req, res) => {
  task.Get(({ result, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    res.status(200).json(result);
  });
});

app.post("/tasks/create", authenticate, async (req, res) => {
  const taskInputs = {
    title: req.body.title,
    description: req.body.description,
  };

  task.Create(taskInputs, ({ result, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    res.status(201).json(result);
  });
});

app.put("/tasks/update/:id", authenticate, async (req, res) => {
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

app.delete("/tasks/delete/:id", authenticate, async (req, res) => {
  const id = parseInt(req.params.id);

  task.Delete(id, ({ result, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    res.status(200).send(result);
  });
});

app.post("/user/create", (req, res) => {
  const userInputs = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  user.Create(userInputs, ({ user_id, error }) => {
    if (error) res.status(500).send("Internal Server Error");
    if (user_id) {
      user.Find(user_id, ({ result, error }) => {
        if (error) {
          res.status(500).send("Internal Server Error");
        }
        res.status(201).json(result);
      });
    }
  });
});

app.post("/user/login", (req, res) => {
  const { body } = req;
  const { username, password } = body;

  user.Login(
    { username, password },
    ({ authorization, error, wrongPassword }) => {
      const { user, accessToken, refreshToken } = authorization;

      if (wrongPassword) res.status(403).send("Usuário ou senha inválido!");
      if (error) res.status(500).send("Internal Server Error");

      console.log("accessToken", accessToken);

      req.headers["authorization"] = accessToken;
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .send(user);
    }
  );
});

app.listen(3000);
