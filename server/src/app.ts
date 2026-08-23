import fastify from 'fastify'
import cors from '@fastify/cors'
import staticFiles from '@fastify/static'
import { linksRoutes } from './routes/links.js'
import { UPLOADS_DIR } from './services/storage.js'

export function buildApp() {
  const app = fastify({ logger: true })

  app.register(cors, {
    origin: '*',
  })

  // Serve os arquivos exportados (CSV) localmente em /files/<nome-do-arquivo>
  app.register(staticFiles, {
    root: UPLOADS_DIR,
    prefix: '/files/',
    decorateReply: false,
  })

  app.register(linksRoutes)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return app
}
