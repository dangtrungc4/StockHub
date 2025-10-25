import { createServer } from 'http'
import app from './app.js'
import { env } from './config/env.js'

const server = createServer(app)
const PORT = Number(env.PORT) || 4000

server.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`)
})
