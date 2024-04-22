import { type IUserRepository } from 'src/repositories/user/interface-user-repository'
import { type ILogin, type ICreate, type IUserCases } from './interface-user-cases'
import { User } from 'src/entities/user/user'

export class UserCases implements IUserCases {
  constructor (
    private readonly userRepository: IUserRepository
  ) {}

  async create ({ email, username, password }: ICreate): Promise<string> {
    const user = new User({ email, username, password })

    const userResponse = await this.userRepository.create(user)

    return userResponse
  }

  async login ({ username, password }: ILogin): Promise<User> {
    const user = new User({ username, password })

    const userResponse = await this.userRepository.login(user)

    return userResponse
  }
}
