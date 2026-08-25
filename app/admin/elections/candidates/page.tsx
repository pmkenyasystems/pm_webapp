'use client'

import { useState, useEffect, useMemo } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import PageLoader from '@/components/PageLoader'

interface CandidateItem {
  id: string
  idNumber: string
  memberName: string | null
  election: { id: string; title: string; electionDate: string }
  position: { id: number; positionTitle: string; positionLevel: string }
  county: string | null
  constituency: string | null
  ward: string | null
  certificateNumber: string | null
  certificateIssuedAt: string | null
}

const POSITION_LEVEL_LABELS: Record<string, string> = {
  '1': 'National', '2': 'County', '3': 'Constituency', '4': 'Ward',
}
const posLevelLabel = (l: string) => POSITION_LEVEL_LABELS[l] ?? l

export default function CandidateProfilesPage() {
  const [candidates, setCandidates] = useState<CandidateItem[]>([])
  const [elections, setElections] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [electionFilter, setElectionFilter] = useState('')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCandidates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCandidates = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/aspirants?status=1')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch candidates')
      const issued = (data.aspirants || []).filter((a: CandidateItem) => a.certificateIssuedAt)
      setCandidates(issued)
      setElections(data.elections || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load candidates')
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(
    () => (electionFilter ? candidates.filter((c) => c.election.id === electionFilter) : candidates),
    [candidates, electionFilter]
  )

  const handleDownloadCertificate = async (candidate: CandidateItem) => {
    setDownloadingId(candidate.id)
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const W = 297
      const H = 210

      // Border
      doc.setDrawColor(0, 51, 102)
      doc.setLineWidth(1.2)
      doc.rect(10, 10, W - 20, H - 20)
      doc.setLineWidth(0.3)
      doc.rect(13, 13, W - 26, H - 26)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 51, 102)
      doc.setFontSize(12)
      doc.text("PEOPLE'S RENAISSANCE MOVEMENT", W / 2, 32, { align: 'center' })
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text('National Elections Board', W / 2, 39, { align: 'center' })

      doc.setDrawColor(196, 30, 58)
      doc.setLineWidth(0.6)
      doc.line(W / 2 - 30, 44, W / 2 + 30, 44)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(24)
      doc.setTextColor(30, 30, 30)
      doc.text('CERTIFICATE OF NOMINATION', W / 2, 62, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      doc.text('This is to certify that', W / 2, 78, { align: 'center' })

      const name = candidate.memberName || candidate.idNumber
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(0, 51, 102)
      doc.text(name, W / 2, 92, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      const area = [candidate.ward, candidate.constituency, candidate.county].filter(Boolean).join(', ')
      doc.text(
        `has been duly nominated as the PM Party candidate for the position of`,
        W / 2, 104, { align: 'center' }
      )
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(15)
      doc.setTextColor(196, 30, 58)
      doc.text(
        `${candidate.position.positionTitle}${area ? ` — ${area}` : ''}`,
        W / 2, 114, { align: 'center' }
      )

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      doc.text(
        `in the ${candidate.election.title}, held on ${new Date(candidate.election.electionDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
        W / 2, 124, { align: 'center' }
      )

      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text(`Certificate No. ${candidate.certificateNumber}`, W / 2, 138, { align: 'center' })
      doc.text(
        `Issued on ${candidate.certificateIssuedAt ? new Date(candidate.certificateIssuedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}`,
        W / 2, 144, { align: 'center' }
      )

      doc.setDrawColor(150, 150, 150)
      doc.setLineWidth(0.3)
      doc.line(W / 2 - 40, 172, W / 2 + 40, 172)
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      doc.text('Chairperson, National Elections Board', W / 2, 178, { align: 'center' })

      doc.save(`PM-Nomination-Certificate-${candidate.idNumber}.pdf`)
    } catch (err) {
      console.error('Error generating certificate PDF:', err)
      alert('Failed to generate the certificate. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Candidate Profiles" />

      <div className="p-4 sm:p-6">
        <p className="text-sm text-gray-500 mb-5 max-w-2xl">
          A candidate profile is created once the National Elections Board issues a nomination certificate to an
          approved aspirant, in the Aspirant Applications list.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        <div className="bg-white rounded-[10px] border border-gray-200 p-4 mb-5">
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Election</label>
          <select
            value={electionFilter}
            onChange={(e) => setElectionFilter(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
          >
            <option value="">All elections</option>
            {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <PageLoader size="md" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 text-center">
            <p className="text-gray-400 text-sm">No candidate profiles yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{filtered.length}</span> candidate{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Candidate', 'ID Number', 'Election', 'Position', 'Area', 'Certificate No.', 'Issued', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{c.memberName || c.idNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs font-mono">{c.idNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{c.election.title}</p>
                        <p className="text-xs text-gray-400">{new Date(c.election.electionDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{c.position.positionTitle}</p>
                        <p className="text-xs text-gray-400">{posLevelLabel(c.position.positionLevel)}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {[c.county, c.constituency, c.ward].filter(Boolean).join(' · ') || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-600">{c.certificateNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">
                        {c.certificateIssuedAt ? new Date(c.certificateIssuedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleDownloadCertificate(c)}
                          disabled={downloadingId === c.id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-blue text-white hover:bg-[#002244] transition disabled:opacity-50"
                        >
                          {downloadingId === c.id ? 'Preparing…' : 'Download Certificate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
