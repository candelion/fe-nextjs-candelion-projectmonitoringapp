import { redirect } from 'next/navigation'

/**
 * Root page → redirect to /login.
 * Middleware also handles this, but SSR redirect is a safe fallback.
 */
export default function RootPage() {
  redirect('/login')
}
