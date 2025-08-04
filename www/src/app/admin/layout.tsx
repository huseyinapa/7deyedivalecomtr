import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel | 7 de Yedi Vale',
  description: 'Admin panel for managing 7 de Yedi Vale services',
  robots: 'noindex, nofollow', // Prevent search engine indexing
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}
