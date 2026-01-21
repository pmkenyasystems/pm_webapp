'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

const AVAILABLE_MODULES = [
  { value: 'news', label: 'News/Articles' },
  { value: 'events', label: 'Events' },
  { value: 'elections', label: 'Elections' },
  { value: 'positions', label: 'Positions' },
  { value: 'members', label: 'Members' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'donations', label: 'Donations' },
  { value: 'admins', label: 'Admin Management' },
]

interface User {
  id: string
  email: string
  name: string | null
  role: string
  modules: string | null
}

export default function EditAdminUserPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'admin',
    modules: [] as string[],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user')
      }

      setUser(data.user)
      const modules = data.user.modules ? JSON.parse(data.user.modules) : []
      setFormData({
        email: data.user.email,
        password: '',
        name: data.user.name || '',
        role: data.user.role,
        modules: modules,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    setError('')

    try {
      const updateData: any = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        modules: formData.modules,
      }

      // Only include password if it's been changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user')
      }

      router.push('/admin/users')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return <div>Please log in to access this page.</div>
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (error && !user) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="text-primary-blue hover:underline"
        >
          ← Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Admin User</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
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
            disabled={user?.role === 'super_admin'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent disabled:bg-gray-100"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          {user?.role === 'super_admin' && (
            <p className="text-sm text-gray-500 mt-1">
              Super admin role cannot be changed.
            </p>
          )}
        </div>

        {formData.role === 'admin' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Modules (Select all that apply)
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
              Selected modules: {formData.modules.length > 0 ? formData.modules.join(', ') : 'None'}
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
            disabled={saving}
            className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
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

