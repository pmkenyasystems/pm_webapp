'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { AVAILABLE_MODULES } from '@/lib/modules'

interface CreateResult {
  emailSent: boolean
  temporaryPassword?: string
  warning?: string
}

export default function NewAdminUserPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'admin',
    modules: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CreateResult | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleModuleToggle = (moduleValue: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleValue)
        ? prev.modules.filter(m => m !== moduleValue)
        : [...prev.modules, moduleValue]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin user')
      }

      setResult({
        emailSent: data.emailSent,
        temporaryPassword: data.temporaryPassword,
        warning: data.warning,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div>Please log in to access this page.</div>
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[10px] border border-gray-200 p-8">
          {result.emailSent ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin user created</h1>
              <p className="text-gray-600 mb-6">
                A welcome email with login instructions and a temporary password has been sent to{' '}
                <strong>{formData.email}</strong>. They should change the password after their first login.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin user created</h1>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-4 text-sm">
                {result.warning}
              </div>
              <p className="text-sm text-gray-500 mb-2">Temporary password for {formData.email}:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 font-mono text-lg font-semibold text-gray-900 mb-6">
                {result.temporaryPassword}
              </div>
            </>
          )}
          <Link
            href="/admin/users"
            className="inline-block bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition"
          >
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Admin User</h1>
      <p className="text-gray-500 mb-8">
        A temporary password is generated automatically and emailed to the user &mdash; they'll be asked to
        change it after their first login.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-[10px] border border-gray-200 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Super Admin has access to all modules and can manage other admins.
          </p>
        </div>

        {formData.role === 'admin' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Modules * (matches the sidebar menu items this admin will see)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AVAILABLE_MODULES.map((module) => (
                <label
                  key={module.value}
                  className="flex items-center space-x-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(module.value)}
                    onChange={() => handleModuleToggle(module.value)}
                    className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                  />
                  <span className="text-sm text-gray-700">{module.label}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected modules: {formData.modules.length > 0 ? formData.modules.map(v => AVAILABLE_MODULES.find(m => m.value === v)?.label ?? v).join(', ') : 'None'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
