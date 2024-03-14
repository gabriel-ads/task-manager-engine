const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://gabriel-ads:wDlRUsny5Lm0@ep-restless-cell-a51jkkuu.us-east-2.aws.neon.tech/task-manager-engine-db?sslmode=require",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
