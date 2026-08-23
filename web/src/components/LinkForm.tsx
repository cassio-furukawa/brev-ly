import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLink } from '../services/api.ts'
import { isAxiosError } from 'axios'

const formSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, 'Informe uma URL válida.')
    .url('Informe uma URL válida.'),
  shortUrl: z
    .string()
    .trim()
    .min(1, 'Informe uma URL minúscula e sem espaço/caracter especial.')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Use apenas letras, números, hífen e underline.'),
})

type FormValues = z.infer<typeof formSchema>

export function LinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      reset()
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError('shortUrl', { message: 'Essa URL encurtada já existe.' })
        return
      }
      setError('shortUrl', { message: 'Não foi possível criar o link.' })
    },
  })

  function onSubmit(values: FormValues) {
    mutation.mutate(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg bg-white p-6 sm:p-8"
    >

      <h2 className="font-heading text-base font-semibold text-gray-600">Novo Link</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="originalUrl" className="text-xs font-semibold text-gray-500">
          LINK ORIGINAL
        </label>
        <input
          id="originalUrl"
          type="text"
          placeholder="www.exemplo.com.br"
          aria-invalid={!!errors.originalUrl}
          className={`rounded-lg border px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-base ${
            errors.originalUrl ? 'border-danger' : 'border-gray-300'
          }`}
          {...register('originalUrl')}
        />
        {errors.originalUrl && (
          <span className="text-xs text-danger">{errors.originalUrl.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="shortUrl" className="text-xs font-semibold text-gray-500">
          LINK ENCURTADO
        </label>
        <div
          className={`flex items-center rounded-lg border text-sm focus-within:border-blue-base ${
            errors.shortUrl ? 'border-danger' : 'border-gray-300'
          }`}
        >
          <span className="select-none border-r border-gray-300 px-3 py-2.5 text-gray-400">
            brev.ly/
          </span>
          <input
            id="shortUrl"
            type="text"
            placeholder="meu-link"
            aria-invalid={!!errors.shortUrl}
            className="w-full rounded-r-lg px-3 py-2.5 text-gray-600 outline-none"
            {...register('shortUrl')}
          />
        </div>
        {errors.shortUrl && (
          <span className="text-xs text-danger">{errors.shortUrl.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="mt-2 rounded-lg bg-blue-base py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Salvando...' : 'Salvar link'}
      </button>
    </form>
  )
}
