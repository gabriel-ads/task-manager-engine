export class User {
  id?: number
  username: string
  email?: string
  password: string
  tasks?: Array<{ id?: number
    createdAt?: Date
    updatedAt?: Date
    endsAt?: Date | null
    title: string
    description?: string | null
    status?: string | null
    authorId?: number }>

  constructor (props: User) {
    const { username, password } = props
    const pattern = /\s/gm

    const regex = new RegExp(pattern)

    if (regex.test(username)) {
      throw new Error('Username cannot contain spaces')
    }

    this.username = username
    this.password = password
  }
}
