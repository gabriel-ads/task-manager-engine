import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class Task {
  async Get (callback: () => void): Promise<void> {
    try {
      const result = await prisma.task.findMany()
      callback({ result })
    } catch (err) {
      console.error(err)
      callback({ error: true })
    }
  }

  async Create ({ title, description }, userId, callback): Promise<void> {
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          author: {
            connect: {
              id: userId
            }
          }
        }
      })
      callback({ result: task })
    } catch (err) {
      console.log(err)
      callback({ error: true })
    }
  }

  async Update ({ id, title, description }, callback) {
    try {
      const result = await prisma.task.update({
        where: { id },
        data: {
          title,
          description
        }
      })

      callback({ result })
    } catch (err) {
      console.error(err)
      callback({ error: true })
    }
  }

  async Delete (id, callback) {
    try {
      await prisma.task.delete({
        where: {
          id
        }
      })

      callback({ result: `A Tarefa com o ID: ${id} foi DELETADA` })
    } catch (err) {
      console.error(err)
      callback({ error: true })
    }
  }
}

module.exports = Task
