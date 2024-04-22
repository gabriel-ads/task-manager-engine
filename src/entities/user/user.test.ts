import { User } from './user'

describe('Create a user', () => {
  it('Should be create a user', () => {
    const user = new User({
      username: 'user-name',
      password: '123'
    })

    expect(user).toBeInstanceOf(User)
    expect(user.username).toEqual('user-name')
  })

  it('Should be return error if username contains spaces', () => {
    expect(() => {
      return new User({
        username: 'user name',
        password: '123'
      })
    }).toThrow()
  })
})
