'use client'

import { useState } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
  StyleSheet,
  pdf,
  Font,
} from '@react-pdf/renderer'
import type { CommitteeMember } from '@/lib/committees'

Font.register({
  family: 'Helvetica',
  fonts: [],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#1a3a8f',
    paddingBottom: 14,
  },
  partyName: {
    fontSize: 9,
    color: '#1a3a8f',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  committeeTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.6,
  },
  membersHeading: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
  },
  memberCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 6,
    backgroundColor: '#dbeafe',
    marginRight: 14,
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 6,
    backgroundColor: '#dbeafe',
    marginRight: 14,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1a3a8f',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 9,
    color: '#1a3a8f',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  memberBio: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
})

function CommitteePDF({
  title,
  description,
  members,
}: {
  title: string
  description: string
  members: CommitteeMember[]
}) {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.partyName}>People's Renaissance Movement (PM Party)</Text>
          <Text style={styles.committeeTitle}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Members */}
        <Text style={styles.membersHeading}>Members</Text>
        {members.length === 0 ? (
          <Text style={styles.description}>No members have been appointed yet.</Text>
        ) : (
          members.map((member, i) => (
            <View key={i} style={styles.memberCard} wrap={false}>
              {member.profileImage ? (
                <PDFImage
                  src={member.profileImage}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{member.name.charAt(0)}</Text>
                </View>
              )}
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberBio}>{member.bio}</Text>
              </View>
            </View>
          ))
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>People's Renaissance Movement (PM Party) — Kenyan Renaissance</Text>
          <Text style={styles.footerText}>{date}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default function CommitteePDFButton({
  title,
  description,
  members,
}: {
  title: string
  description: string
  members: CommitteeMember[]
}) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const blob = await pdf(
        <CommitteePDF title={title} description={description} members={members} />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-primary-blue text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-blue/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Generating PDF…
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  )
}
