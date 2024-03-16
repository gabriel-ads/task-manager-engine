const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING.toString(),
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
