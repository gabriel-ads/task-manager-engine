import { type Request, type Response } from 'express'
// import { Task } from 'src/entities/task'

export interface ITaskController {
  create: (request: Request, response: Response) => object
  read: (response: Response) => object
  update: (request: Request, response: Response) => object
  delete: (request: Request, response: Response) => object
}
