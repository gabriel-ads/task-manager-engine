import { Router } from 'express'
import { taskFactory } from 'src/factories/task/task-factory'
import { authenticate } from 'src/middleware/authenticate'

const routes = Router()

routes.post('/create', authenticate, async (req, res) => {
  await taskFactory().create(req, res)
})

routes.get('/', authenticate, async (req, res) => {
  await taskFactory().read(res)
})

routes.put('/update', authenticate, async (req, res) => {
  await taskFactory().update(req, res)
})
routes.delete('/delete/:id', authenticate, async (req, res) => {
  await taskFactory().delete(req, res)
})

export default routes
