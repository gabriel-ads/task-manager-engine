import { Task } from './task'

describe('Create a task', () => {
  it('Should be create a task', () => {
    const task = new Task({
      authorId: 3,
      title: 'Task number one',
      description: 'Description number one'
    })

    expect(task).toBeInstanceOf(Task)
    expect(task.title).toEqual('Task number one')
  })

  it('Should be return error if title is empty', () => {
    expect(() => {
      return new Task({
        authorId: 86,
        title: '',
        description: 'Description number two'
      })
    }).toThrow()
  })

  it('Should be return error if end date is before today or create date', () => {
    const endsAt = new Date()

    endsAt.setDate(endsAt.getDate() - 1)

    expect(() => {
      return new Task({
        authorId: 86,
        title: '',
        description: 'Description number two',
        endsAt
      })
    }).toThrow()
  })
})
