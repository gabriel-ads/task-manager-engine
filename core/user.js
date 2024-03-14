const pool = require("./pool.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { privateKey } = require("../globalVariables.js");

const { query } = pool;

class User {
  async Find(userId, callback) {
    if (userId) {
      const sql = `SELECT * FROM users WHERE user_id = $1`;

      try {
        const result = await query(sql, [userId]);
        callback({ result: result.rows[0] });
      } catch (err) {
        console.error(err);
        callback({ error: true });
      }
    }
  }

  async Create(body, callback) {
    body.password = bcrypt.hashSync(body.password, 10);
    const { username, email, password } = body;

    let sql = `INSERT INTO users(username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id`;

    try {
      const result = await query(sql, [username, email, password]);
      callback(result.rows[0]);
    } catch (err) {
      console.log(err);
      callback({ error: true });
    }
  }

  async Login({ username, password }, callback) {
    let sql = "SELECT * FROM users WHERE username = $1";

    try {
      const findUserByUsername = await query(sql, [username]);

      if (!findUserByUsername.rows.length) {
        callback({ wrongPassword: true });
        return;
      }

      const user = findUserByUsername.rows[0];

      const isCorrectPassword = bcrypt.compareSync(
        password,
        user.password_hash
      );

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
