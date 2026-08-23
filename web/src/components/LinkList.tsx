import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Copy, Trash2 } from 'lucide-react'
import { deleteLink, exportLinksCsv, fetchLinks, resolveLink } from '../services/api.ts'

function formatShortUrl(shortUrl: string) {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL as string
  return `${frontendUrl.replace(/^https?:\/\//, '')}/${shortUrl}`
}

export function LinkList() {
  const queryClient = useQueryClient()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: links, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: fetchLinks,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const exportMutation = useMutation({
    mutationFn: exportLinksCsv,
    onSuccess: (url) => {
      window.open(url, '_blank')
    },
  })

  const openMutation = useMutation({
    mutationFn: resolveLink,
    onSuccess: (link) => {
      window.open(link.originalUrl, '_blank', 'noopener,noreferrer')
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  async function handleCopy(id: string, shortUrl: string) {
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL as string
    await navigator.clipboard.writeText(`${frontendUrl}/${shortUrl}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500)
  }

  function handleDelete(shortUrl: string) {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esse link? Essa ação não pode ser desfeita.'
    )

    if (confirmed) {
      deleteMutation.mutate(shortUrl)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-gray-600">Meus Links</h2>
        <button
          type="button"
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending || !links?.length}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exportMutation.isPending ? 'Gerando...' : 'Baixar CSV'}
        </button>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {isLoading && (
        <div className="flex flex-col items-center gap-2 py-10 text-sm text-gray-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-base" />
          Carregando links...
        </div>
      )}

      {!isLoading && links?.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-gray-400">
          <span className="font-heading text-xs font-semibold uppercase tracking-wide text-gray-300">
            Ainda não existem links
          </span>
          <p>Cadastre o seu primeiro link encurtado</p>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-gray-200">
        {links?.map((link) => (
          <li key={link.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => openMutation.mutate(link.shortUrl)}
                disabled={openMutation.isPending}
                className="truncate text-left text-sm font-semibold text-blue-base hover:underline disabled:cursor-wait"
                title={`Abrir ${formatShortUrl(link.shortUrl)} em nova aba`}
              >
                {formatShortUrl(link.shortUrl)}
              </button>
              <span className="truncate text-xs text-gray-400">{link.originalUrl}</span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-gray-400">{link.accessCount} acessos</span>
              <button
                type="button"
                onClick={() => handleCopy(link.id, link.shortUrl)}
                aria-label="Copiar link"
                title={copiedId === link.id ? 'Copiado!' : 'Copiar link'}
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-base"
              >
                {copiedId === link.id ? (
                  <Check size={16} strokeWidth={2.5} className="text-blue-base" />
                ) : (
                  <Copy size={16} strokeWidth={2.5} />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(link.shortUrl)}
                disabled={deleteMutation.isPending}
                aria-label="Excluir link"
                title="Excluir link"
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
