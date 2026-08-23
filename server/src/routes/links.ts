import type { FastifyInstance } from 'fastify'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db/connection.js'
import { links } from '../db/schema.js'
import { createLinkSchema } from '../utils/validators.js'
import { generateLinksCsv } from '../services/csv.js'
import { saveFileLocally } from '../services/storage.js'

export async function linksRoutes(app: FastifyInstance) {
  // Cria um link encurtado
  app.post('/links', async (request, reply) => {
    const parseResult = createLinkSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply.status(400).send({
        message: 'Dados inválidos',
        errors: parseResult.error.flatten().fieldErrors,
      })
    }

    const { originalUrl, shortUrl } = parseResult.data

    const existing = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .limit(1)

    if (existing.length > 0) {
      return reply.status(409).send({ message: 'Essa URL encurtada já existe' })
    }

    const [link] = await db
      .insert(links)
      .values({ originalUrl, shortUrl })
      .returning()

    return reply.status(201).send(link)
  })

  // Lista todas as URLs cadastradas, ordenadas pelas mais recentes (performático via índice)
  app.get('/links', async (_request, reply) => {
    const allLinks = await db.select().from(links).orderBy(desc(links.createdAt))

    return reply.status(200).send(allLinks)
  })

  // Obtém a URL original a partir da URL encurtada e incrementa o contador de acessos
  app.get('/links/:shortUrl', async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string }

    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .limit(1)

    if (!link) {
      return reply.status(404).send({ message: 'URL encurtada não encontrada' })
    }

    const [updated] = await db
      .update(links)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(links.shortUrl, shortUrl))
      .returning()

    return reply.status(200).send(updated)
  })

  // Deleta um link a partir da URL encurtada
  app.delete('/links/:shortUrl', async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string }

    const [deleted] = await db
      .delete(links)
      .where(eq(links.shortUrl, shortUrl))
      .returning()

    if (!deleted) {
      return reply.status(404).send({ message: 'URL encurtada não encontrada' })
    }

    return reply.status(204).send()
  })

  // Exporta os links cadastrados em CSV e disponibiliza o arquivo localmente, retornando a URL pública
  app.get('/links/export', async (request, reply) => {
    const allLinks = await db.select().from(links).orderBy(desc(links.createdAt))

    const csvBuffer = await generateLinksCsv(allLinks)

    const fileName = await saveFileLocally({
      fileBuffer: csvBuffer,
      extension: 'csv',
    })

    const url = `${request.protocol}://${request.headers.host}/files/${fileName}`

    return reply.status(200).send({ url })
  })
}
