import { z } from 'zod'

// Aceita apenas letras, números, hífen e underscore, sem espaços ou barras.
const shortUrlRegex = /^[a-zA-Z0-9-_]+$/

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .url({ message: 'URL original inválida' }),
  shortUrl: z
    .string()
    .trim()
    .min(1, 'A URL encurtada não pode ser vazia')
    .regex(shortUrlRegex, 'A URL encurtada está mal formatada'),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>
