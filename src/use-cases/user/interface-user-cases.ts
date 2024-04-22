import { type User } from 'src/entities/user/user'

export type ICreate = Pick<User, 'username' | 'email' | 'password'>

export type ILogin = Pick<User, 'username' | 'password'>

export interface IUserCases {
  create: (user: ICreate) => Promise<string>
  login: (user: ILogin) => Promise<User>
}
