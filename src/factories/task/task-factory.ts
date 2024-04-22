import { TaskController } from 'src/controllers/task/task-controller'
import { TaskRepository } from 'src/repositories/task/prisma/task-repository'
import { TaskCases } from 'src/use-cases/task/task-cases'

export const taskFactory = (): TaskController => {
  const taskRepository = new TaskRepository()
  const taskCases = new TaskCases(taskRepository)
  const taskController = new TaskController(taskCases)
  return taskController
}
