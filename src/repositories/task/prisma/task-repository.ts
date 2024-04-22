import { type Task } from 'src/entities/task/task'
import { type ITaskRepository } from '../interface-task-repository'
import { prisma } from '../../../database/client'

export class TaskRepository implements ITaskRepository {
  async create ({ title, description, status, endsAt, authorId }: Task): Promise<Task> {
    try {
      const task = await prisma.task.create({ data: { title, description, status, endsAt, authorId } })

      return task
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async read (): Promise<Task[]> {
    try {
      const tasks = await prisma.task.findMany()

      return tasks
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async update ({ id, title, description, endsAt, status }: Task): Promise<Task> {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          endsAt,
          status
        }
      })

      return task
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async delete (id: number): Promise<string> {
    try {
      await prisma.task.delete({
        where: { id }
      })

      return `Tarefa com o ID: ${id} deletada com sucesso.`
    } catch (error) {
      throw new Error(error as string)
    }
  }
}
