import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home.tsx'
import { Redirect } from './pages/Redirect.tsx'
import { NotFound } from './pages/NotFound.tsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:shortUrl" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
