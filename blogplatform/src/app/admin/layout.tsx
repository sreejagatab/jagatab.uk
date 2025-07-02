import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Check if user is authenticated
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Check if user has admin or editor role
  const userRole = (session.user as any).role
  if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
    redirect('/unauthorized')
  }

  const user = {
    id: session.user.id,
    name: session.user.name || 'User',
    email: session.user.email || '',
    image: session.user.image,
    role: userRole
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
