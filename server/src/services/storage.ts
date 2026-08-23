import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Pasta local onde os arquivos exportados (CSV) ficam salvos.
// Em produção real, o ideal é apontar isso para um volume persistente
// ou trocar por um provedor de CDN (S3, Cloudflare R2, etc).
export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads')

interface SaveFileParams {
  fileBuffer: Buffer
  extension: string
}

// Gera um nome de arquivo aleatório e único e salva localmente em disco.
// Retorna apenas o nome do arquivo — quem chama monta a URL pública.
export async function saveFileLocally({
  fileBuffer,
  extension,
}: SaveFileParams): Promise<string> {
  await mkdir(UPLOADS_DIR, { recursive: true })

  const fileName = `${randomUUID()}.${extension}`
  const filePath = path.join(UPLOADS_DIR, fileName)

  await writeFile(filePath, fileBuffer)

  return fileName
}
