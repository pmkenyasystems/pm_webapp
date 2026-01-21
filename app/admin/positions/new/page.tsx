'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function NewPositionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    positionTitle: '',
    positionLevel: 'National', // Default to National
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create position')
      }

      router.push('/admin/positions')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Position</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div>
          <label htmlFor="positionTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Position Title *
          </label>
          <input
            type="text"
            id="positionTitle"
            name="positionTitle"
            value={formData.positionTitle}
            onChange={handleChange}
            required
            placeholder="e.g., President, Governor, Member of Parliament, MCA"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="positionLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Position Level *
          </label>
          <select
            id="positionLevel"
            name="positionLevel"
            value={formData.positionLevel}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            <option value="National">National</option>
            <option value="County">County</option>
            <option value="Constituency">Constituency</option>
            <option value="Ward">Ward</option>
          </select>
        </div>

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
            {loading ? 'Creating...' : 'Create Position'}
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

