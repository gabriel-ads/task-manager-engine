import { type TaskCases } from 'src/use-cases/task/task-cases'
import { type ITaskController } from './interface-task-controller'
import { type Request, type Response } from 'express'

export class TaskController implements ITaskController {
  constructor (private readonly taskCases: TaskCases) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const { title, description, status, endsAt } = req.body
    const { id: authorId } = req.user

    const task = await this.taskCases.create({ authorId, title, description, status, endsAt })

    return res.json(task)
  }

  async read (res: Response): Promise<Response<any, Record<string, any>>> {
    const task = await this.taskCases.read()

    return res.json(task)
  }

  async update (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const { id, title, description, endsAt, status } = req.body

    const task = await this.taskCases.update({ id, title, description, endsAt, status })

    return res.json(task)
  }

  async delete (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const id = parseInt(req.params.id)

    const task = await this.taskCases.delete(id)

    return res.json(task)
  }
}
