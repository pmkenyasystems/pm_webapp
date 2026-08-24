'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'

interface Position {
  id: number
  positionTitle: string
  positionLevel: string
  applicationFee: number | null
  createdAt: string
  _count: {
    aspirants: number
  }
}

const POSITION_LEVEL_LABELS: Record<string, string> = {
  '1': 'National',
  '2': 'County',
  '3': 'Constituency',
  '4': 'Ward',
}
const positionLevelLabel = (level: string) => POSITION_LEVEL_LABELS[level] ?? level

export default function PositionsPage() {
  const router = useRouter()
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null)
  const [feeDraft, setFeeDraft] = useState('')
  const [savingFee, setSavingFee] = useState(false)

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/admin/positions')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch positions')
      }

      setPositions(data.positions)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveFee = async (id: number) => {
    setSavingFee(true)
    try {
      const response = await fetch(`/api/admin/positions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationFee: feeDraft }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update fee')
      setPositions((prev) => prev.map((p) => (p.id === id ? { ...p, applicationFee: data.position.applicationFee } : p)))
      setEditingFeeId(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSavingFee(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this position?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/positions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete position')
      }

      fetchPositions()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Manage Positions">
        <Link
          href="/admin/positions/new"
          className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
        >
          New Position
        </Link>
      </AdminHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {positions.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No positions found. Create your first position.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Position Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Application Fee
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {positions.map((position) => (
                  <tr key={position.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{position.positionTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {positionLevelLabel(position.positionLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position._count.aspirants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingFeeId === position.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            autoFocus
                            value={feeDraft}
                            onChange={(e) => setFeeDraft(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          />
                          <button
                            onClick={() => saveFee(position.id)}
                            disabled={savingFee}
                            className="text-primary-blue font-semibold hover:underline disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingFeeId(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingFeeId(position.id)
                            setFeeDraft(position.applicationFee != null ? String(position.applicationFee) : '')
                          }}
                          className="hover:underline"
                        >
                          {position.applicationFee != null
                            ? `KES ${position.applicationFee.toLocaleString()}`
                            : <span className="text-gray-400">Not set</span>}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

