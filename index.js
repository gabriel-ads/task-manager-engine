require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./core/user.js");
const Task = require("./core/task.js");
const authenticate = require("./middleware/authenticate.js");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { privateKey } = require("./globalVariables.js");

const prisma = new PrismaClient();
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

async function main() {
  app.get("/tasks", authenticate, (req, res) => {
    task.Get(({ result, error }) => {
      if (error) res.status(500).send("Internal Server Error");
      res.status(200).json(result);
    });
  });

  app.post("/tasks/create", authenticate, async (req, res) => {
    const { authorization: accessToken } = req.headers;
    const decodedToken = jwt.verify(accessToken, privateKey);
    const taskInputs = {
      title: req.body.title,
      description: req.body.description,
    };

    task.Create(taskInputs, decodedToken.user.id, ({ result, error }) => {
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

    user.Create(userInputs, ({ result, error }) => {
      if (error) res.status(500).send("Internal Server Error");

      if (result) res.status(201).send("Criado com sucesso");
    });
  });

  app.post("/user/login", (req, res) => {
    const { body } = req;
    const { username, password } = body;

    user.Login(
      { username, password },
      ({ authorization, error, wrongPassword }) => {
        if (wrongPassword) res.status(403).send("Usuário ou senha inválido!");
        if (error) res.status(500).send("Internal Server Error");

        const { user, accessToken, refreshToken } = authorization;

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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

app.listen(process.env.PORT || 3000);
