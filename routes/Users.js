const express = require("express");
const router = express.Router();
const User = require("../core/user.js");

const user = new User();

router.post("/create", (req, res) => {
  const userInputs = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  const regex = new RegExp(/\s/gm);

  if (regex.test(userInputs.username)) {
    res.status(400).send("Username não deve conter espaços");
    return;
  }

  user.Create(userInputs, ({ result, error, message }) => {
    if (error) res.status(500).send("Internal Server Error");
    if (message) res.status(400).send(message);
    if (result) res.status(201).send("Criado com sucesso");
  });
});

router.post("/login", (req, res) => {
  const { body } = req;
  const { username, password } = body;

  user.Login(
    { username, password },
    ({ authorization, error, wrongPassword }) => {
      if (wrongPassword)
        return res.status(403).send("Usuário ou senha inválido!");
      if (error) res.status(500).send("Internal Server Error");

      const { user, accessToken, refreshToken } = authorization;

      console.log("accessToken", accessToken);

      req.headers["Authorization"] = accessToken;
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .send(user);
    }
  );
});

module.exports = router;
