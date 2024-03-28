require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const taskRoute = require("./routes/Tasks");
const userRoute = require("./routes/Users");

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

async function main() {
  app.use("/task", taskRoute);
  app.use("/user", userRoute);
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

const server = app.listen(process.env.PORT || 3000);

module.exports = { app, server };
