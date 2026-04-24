import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAvailableModules } from '@/lib/permissions'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminProfilePage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/admin/login')
  }

  const user = session.user
  const modulesRaw = (user as { modules?: string }).modules
  let assignedModules: string[] = []
  if (modulesRaw) {
    try {
      const parsed = JSON.parse(modulesRaw) as string[]
      assignedModules = Array.isArray(parsed) ? parsed : []
    } catch {
      // ignore
    }
  }

  const moduleLabels = getAvailableModules()
  const assignedLabels = assignedModules
    .map((value) => moduleLabels.find((m) => m.value === value)?.label ?? value)
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="My Profile" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Personal profile</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Your admin account details
            </p>
          </div>
          <dl className="divide-y divide-gray-200">
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.name || '—'}
              </dd>
            </div>
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="capitalize">
                  {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </dd>
            </div>
            <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Assigned modules</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.role === 'super_admin' ? (
                  <span className="text-gray-600">All modules</span>
                ) : assignedLabels.length > 0 ? (
                  <ul className="list-disc list-inside space-y-0.5">
                    {assignedLabels.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">None assigned</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
