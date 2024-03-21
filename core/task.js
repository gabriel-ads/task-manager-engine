const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Task {
  async Get(callback) {
    try {
      const result = await prisma.task.findMany();
      callback({ result: result.rows });
    } catch (err) {
      console.error(err);
      callback({ error: true });
    }
  }

  async Create({ title, description }, callback) {
    try {
      const result = await query(
        "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
        [title, description]
      );
      callback({ result: result.rows[0] });
    } catch (err) {
      console.log(err);
      callback({ error: true });
    }
  }

  async Update({ id, title, description }, callback) {
    try {
      await query(
        "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
        [title, description, id]
      );

      callback({ result: `Tarefa com ID ${id} foi modificada com sucesso!` });
    } catch (err) {
      console.error(err);
      callback({ error: true });
    }
  }

  async Delete(id, callback) {
    try {
      await query("DELETE FROM tasks WHERE id = $1", [id]);

      callback({ result: `A Tarefa com o ID: ${id} foi DELETADA` });
    } catch (err) {
      console.error(err);
      callback({ error: true });
    }
  }
}

module.exports = Task;
