import { LinkForm } from '../components/LinkForm.tsx'
import { LinkList } from '../components/LinkList.tsx'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-200 px-4 py-8 sm:py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2C46B1" />
            <path d="M13 19L19 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path
              d="M15 11.5L16.5 10C18.4 8.1 21.5 8.1 23.4 10C25.3 11.9 25.3 15 23.4 16.9L21.9 18.4"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M17 20.5L15.5 22C13.6 23.9 10.5 23.9 8.6 22C6.7 20.1 6.7 17 8.6 15.1L10.1 13.6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-heading text-xl font-bold text-gray-600">brev.ly</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <LinkForm />
          <LinkList />
        </div>
      </div>
    </div>
  )
}
