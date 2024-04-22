import { type Task } from '../../entities/task/task'

export interface ITaskCases {
  create: (task: Task) => Promise<Task>
  read: () => Promise<Task[]>
  update: ({ id, title, description, endsAt, status }: Task) => Promise<Task>
  delete: (id: number) => Promise<string>
}
