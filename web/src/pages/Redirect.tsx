import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { resolveLink } from '../services/api.ts'
import { NotFound } from './NotFound.tsx'

export function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const [status, setStatus] = useState<'loading' | 'not-found'>('loading')
  const hasResolvedRef = useRef(false)

  useEffect(() => {
    if (!shortUrl) {
      setStatus('not-found')
      return
    }

    // Evita contabilizar o acesso duas vezes (o StrictMode do React
    // executa efeitos duas vezes em desenvolvimento).
    if (hasResolvedRef.current) {
      return
    }
    hasResolvedRef.current = true

    resolveLink(shortUrl)
      .then((link) => {
        window.location.href = link.originalUrl
      })
      .catch(() => {
        setStatus('not-found')
      })
  }, [shortUrl])

  if (status === 'not-found') {
    return <NotFound />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-200 px-4 text-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-base" />
      <p className="font-heading text-sm font-semibold text-gray-500">
        Redirecionando...
      </p>
      <p className="max-w-xs text-xs text-gray-400">
        O link será aberto automaticamente em alguns instantes
      </p>
    </div>
  )
}
