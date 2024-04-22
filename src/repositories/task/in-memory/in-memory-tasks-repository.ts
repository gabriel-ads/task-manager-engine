import { type Task } from '../../../entities/task/task'
import { type ITaskRepository } from '../interface-task-repository'
import { v4 as uuid } from 'uuid'

export class InMemoryTasksRepository implements ITaskRepository {
  public items: Task[] = []

  async create (task: Task): Promise<Task> {
    Object.assign(task, {
      id: uuid(),
      createdAt: new Date()
    })
    this.items.push(task)
    return task
  }

  async save (task: Task): Promise<void> {

  }
}
