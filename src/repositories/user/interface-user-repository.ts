import { type User } from 'src/entities/user/user'

export interface IUserRepository {
  create: (user: User) => Promise<string>
  login: (user: User) => Promise<User>
}
