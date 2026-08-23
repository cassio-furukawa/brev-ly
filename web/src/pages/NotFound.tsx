import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-200 px-4 text-center">
      <span className="font-heading text-5xl font-bold text-blue-base">404</span>
      <p className="font-heading text-base font-semibold text-gray-600">
        Link não encontrado
      </p>
      <p className="max-w-xs text-sm text-gray-400">
        O link que você está tentando acessar não existe ou foi removido.
      </p>
      <Link
        to="/"
        className="mt-2 text-sm font-semibold text-blue-base hover:underline"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
