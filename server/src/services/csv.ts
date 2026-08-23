import { format } from 'fast-csv'
import { PassThrough } from 'node:stream'
import type { Link } from '../db/schema.js'

// Gera um buffer CSV com os campos: URL original, URL encurtada, contagem de acessos e data de criação.
export async function generateLinksCsv(links: Link[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const stream = new PassThrough()
    const csvStream = format({ headers: true })

    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)

    csvStream.pipe(stream)

    for (const link of links) {
      csvStream.write({
        'URL original': link.originalUrl,
        'URL encurtada': link.shortUrl,
        'Contagem de acessos': link.accessCount,
        'Data de criação': link.createdAt.toISOString(),
      })
    }

    csvStream.end()
  })
}
