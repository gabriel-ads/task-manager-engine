import { Task } from '../../entities/task/task'
import { type ITaskRepository } from '../../repositories/task/interface-task-repository'
import { type ITaskCases } from './interface-task-cases'

type CreateTaskRequest = Pick<Task, 'endsAt' | 'title' | 'description' | 'status' | 'authorId'>
type UpdateTaskRequest = Pick<Task, 'endsAt' | 'title' | 'description' | 'status' | 'id'>

export class TaskCases implements ITaskCases {
  constructor (
    private readonly taskRepository: ITaskRepository
  ) {}

  async create ({ authorId, title, description, status, endsAt }: CreateTaskRequest): Promise<Task> {
    const task = new Task({ authorId, title, description, status, endsAt })
    const taskResponse = await this.taskRepository.create(task)

    return taskResponse
  }

  async read (): Promise<Task[]> {
    const taskResponse = await this.taskRepository.read()

    return taskResponse
  }

  async update ({ id, title, description, endsAt, status }: UpdateTaskRequest): Promise<Task> {
    const task = new Task({ id, title, description, status, endsAt })

    const taskResponse = await this.taskRepository.update(task)

    return taskResponse
  }

  async delete (id: number): Promise<string> {
    const taskResponse = await this.taskRepository.delete(id)

    return taskResponse
  }
}
