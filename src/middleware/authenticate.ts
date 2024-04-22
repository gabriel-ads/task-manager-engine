import jwt from 'jsonwebtoken'
import { privateKey } from '../../globalVariables'
import { type Request, type Response, type NextFunction } from 'express'

export interface TaskRequest extends Request {
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

interface UserJwtPayload extends jwt.JwtPayload {
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

export const authenticate = async (req: TaskRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  const accessToken = req.headers.authorization
  const refreshToken = req.cookies.refreshToken as string | undefined

  if (accessToken && refreshToken && privateKey) {
    try {
      const { user } = jwt.verify(accessToken, privateKey) as UserJwtPayload
      req.user = user
      next()
    } catch (error) {
      try {
        const { user } = jwt.verify(refreshToken, privateKey) as UserJwtPayload
        req.user = user
        const accessToken = jwt.sign(
          { user },
          privateKey,
          {
            expiresIn: '1h'
          }
        )

        res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict'
          })
          .header('authorization', accessToken)

        next()
      } catch (error) {
        console.log(error)
        return res.status(400).send('Invalid Token.')
      }
    }
  } else {
    return res.status(401).send('Access Denied. No token provided.')
  }
}
