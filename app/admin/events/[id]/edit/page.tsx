'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

export default function EditEventPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    location: '',
    startDate: '',
    endDate: '',
    isPublic: true,
    maxAttendees: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch event')
      }

      const event = data.events.find((e: any) => e.id === eventId)
      if (!event) {
        throw new Error('Event not found')
      }

      const startDate = new Date(event.startDate).toISOString().slice(0, 16)
      const endDate = event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ''

      setFormData({
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl || '',
        location: event.location,
        startDate,
        endDate,
        isPublic: event.isPublic,
        maxAttendees: event.maxAttendees?.toString() || '',
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
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update event')
      }

      router.push('/admin/events')
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
        <AdminHeader title="Edit Event" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Edit Event">
        <Link
          href="/admin/events"
          className="text-gray-700 hover:text-primary-red transition"
        >
          ← Back to Events
        </Link>
      </AdminHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-4 w-4 text-primary-red focus:ring-primary-red border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              Make this event public
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-red text-white px-6 py-2 rounded-md hover:bg-[#9A162D] transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Event'}
            </button>
            <Link
              href="/admin/events"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

