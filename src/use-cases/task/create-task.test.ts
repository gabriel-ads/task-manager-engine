import { InMemoryTasksRepository } from '../../repositories/task/in-memory/in-memory-tasks-repository'
import { Task } from '../../entities/task/task'
import { TaskCases } from './task-cases'

describe('Create a Task', () => {
  it('Should be able to create a task', async () => {
    const taskRepository = new InMemoryTasksRepository()
    const createTask = new TaskCases(taskRepository)

    await expect(createTask.create({
      authorId: 1,
      title: 'Teste de criação',
      description: ''
    })).resolves.toBeInstanceOf(Task)
  })
})
