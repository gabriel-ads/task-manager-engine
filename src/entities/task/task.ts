export class Task {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  endsAt?: Date | null
  title: string
  description?: string | null
  status?: string | null
  authorId?: number

  constructor (props: Task) {
    const { title, endsAt, authorId } = props
    const currentDate = new Date()

    if (!title) {
      throw new Error('Titles cannot be empty')
    }

    if (endsAt) {
      if (endsAt <= currentDate) {
        throw new Error('Invalid end date')
      }
    }

    this.title = title
    this.authorId = authorId
  }
}
