import { type Task } from '../../entities/task/task'

export interface ITaskRepository {
  create: (task: Task) => Promise<Task>
  read: () => Promise<Task[]>
  update: (task: Task) => Promise<Task>
  delete: (id: number) => Promise<string>
}
