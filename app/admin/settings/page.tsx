'use client'

import { useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

type SettingsTab = 'counties' | 'constituencies' | 'wards' | 'positions' | 'elections'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('counties')

  const tabs = [
    { id: 'counties' as SettingsTab, name: 'Counties', icon: '🗺️' },
    { id: 'constituencies' as SettingsTab, name: 'Constituencies', icon: '📍' },
    { id: 'wards' as SettingsTab, name: 'Wards', icon: '🏘️' },
    { id: 'positions' as SettingsTab, name: 'Positions', icon: '💼' },
    { id: 'elections' as SettingsTab, name: 'Elections', icon: '🗳️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Settings" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-primary-blue text-primary-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'counties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Counties</h2>
                  <Link
                    href="/admin/settings/counties"
                    className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
                  >
                    Manage Counties
                  </Link>
                </div>
                <p className="text-gray-600">
                  View and manage all counties in the system. Counties are the primary administrative divisions.
                </p>
              </div>
            )}

            {activeTab === 'constituencies' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Constituencies</h2>
                  <Link
                    href="/admin/settings/constituencies"
                    className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
                  >
                    Manage Constituencies
                  </Link>
                </div>
                <p className="text-gray-600">
                  View and manage all constituencies. Constituencies are grouped by counties.
                </p>
              </div>
            )}

            {activeTab === 'wards' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Wards</h2>
                  <Link
                    href="/admin/settings/wards"
                    className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
                  >
                    Manage Wards
                  </Link>
                </div>
                <p className="text-gray-600">
                  View and manage all wards. Wards are grouped by constituencies.
                </p>
              </div>
            )}

            {activeTab === 'positions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Positions</h2>
                  <Link
                    href="/admin/positions"
                    className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
                  >
                    Manage Positions
                  </Link>
                </div>
                <p className="text-gray-600">
                  View and manage all political positions. Positions can be at National, County, Constituency, or Ward level.
                </p>
              </div>
            )}

            {activeTab === 'elections' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Elections</h2>
                  <Link
                    href="/admin/elections"
                    className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-[#002244] transition"
                  >
                    Manage Elections
                  </Link>
                </div>
                <p className="text-gray-600">
                  View and manage all elections. Elections can be activated or deactivated to control when applications are accepted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

