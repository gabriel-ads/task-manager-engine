const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { privateKey } = require("../globalVariables.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class User {
  async #Find({ username, email }) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      if (user) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async Create(body, callback) {
    body.password = bcrypt.hashSync(body.password, 10);
    const { username, email, password } = body;
    const alreadyExistEmailOrUsername = await this.#Find({ username, email });

    if (alreadyExistEmailOrUsername) {
      callback({ message: "E-mail ou Username já existente" });
      return;
    }

    try {
      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: password,
        },
      });
      callback({ result: user });
    } catch (err) {
      console.log(err);
      callback({ error: true });
    }
  }

  async Login({ username, password }, callback) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        callback({ wrongPassword: true });
        return;
      }

      const isCorrectPassword = bcrypt.compareSync(password, user.password);

      if (isCorrectPassword) {
        const accessToken = jwt.sign({ user }, privateKey, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ user }, privateKey, {
          expiresIn: "1d",
        });

        callback({
          authorization: {
            user,
            accessToken,
            refreshToken,
          },
        });
      } else callback({ wrongPassword: true });
    } catch (err) {
      console.log(err);
      callback({ error: true });
    }
  }
}

module.exports = User;
