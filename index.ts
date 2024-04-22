import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client'
import taskRouter from './src/routes/task'

import 'dotenv/config'

const prisma = new PrismaClient()
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(cookieParser())

async function main (): Promise<void> {
  app.use('/task', taskRouter)
  // app.use('/user', userRoute)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

const server = app.listen(process.env.PORT ?? 3000)

export { app, server }
