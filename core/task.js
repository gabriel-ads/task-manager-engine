const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Task {
  async Get(callback) {
    try {
      const result = await prisma.task.findMany();
      callback({ result: result });
    } catch (err) {
      console.error(err);
      callback({ error: true });
    }
  }

  async Create({ title, description }, userId, callback) {
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
      callback({ result: task });
    } catch (err) {
      console.log(err);
      callback({ error: true });
    }
  }

  async Update({ id, title, description }, callback) {
    try {
      const result = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
        },
      });

      callback({ result: result });
    } catch (err) {
      console.error(err);
      callback({ error: true });
    }
  }

  async Delete(id, callback) {
    try {
      await prisma.task.delete({
        where: {
          id,
        },
      });

      callback({ result: `A Tarefa com o ID: ${id} foi DELETADA` });
    } catch (err) {
      console.error(err);
      callback({ error: true });
    }
  }
}

module.exports = Task;
