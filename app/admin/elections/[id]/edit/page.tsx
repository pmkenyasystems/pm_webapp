'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

export default function EditElectionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const electionId = params.id as string
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    electionDate: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (electionId) {
      fetchElection()
    }
  }, [electionId])

  const fetchElection = async () => {
    try {
      const response = await fetch(`/api/admin/elections/${electionId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch election')
      }

      setFormData({
        title: data.election.title,
        description: data.election.description || '',
        electionDate: data.election.electionDate.slice(0, 10),
        isActive: data.election.isActive,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/elections/${electionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update election')
      }

      router.push('/admin/elections')
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
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Edit Election" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Edit Election">
        <Link
          href="/admin/elections"
          className="text-gray-700 hover:text-primary-blue transition"
        >
          ← Back to Elections
        </Link>
      </AdminHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-[10px] border border-gray-200 p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="electionDate" className="block text-sm font-medium text-gray-700 mb-2">
              Election Date *
            </label>
            <input
              type="date"
              id="electionDate"
              name="electionDate"
              value={formData.electionDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active (accepting applications)</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Election'}
            </button>
            <Link
              href="/admin/elections"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
