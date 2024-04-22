import * as express from 'express'

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number
        username: string
        email: string
        password: string
        tasks?: Array<{ id?: number
          createdAt?: Date
          updatedAt?: Date
          endsAt?: Date | null
          title: string
          description?: string | null
          status?: string | null
          authorId?: number }>
      }
    }
  }
}
