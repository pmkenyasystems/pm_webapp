import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendAspirantNotification(data: {
  fullName: string | null
  idNumber: string
  phone: string | null
  email: string | null
  electionTitle: string
  positionTitle: string
  positionLevel: string
  county: string | null
  constituency: string | null
  ward: string | null
  pollingStation: string | null
}) {
  const nebEmail = process.env.NEB_EMAIL
  const senderEmail = process.env.GMAIL_USER

  if (!nebEmail || !senderEmail) {
    console.error('Email not sent: GMAIL_USER or NEB_EMAIL not configured in .env')
    return
  }

  const locationParts = [data.county, data.constituency, data.ward].filter(Boolean)
  const location = locationParts.length ? locationParts.join(', ') : 'Not specified'

  await transporter.sendMail({
    from: `"PRM Elections" <${senderEmail}>`,
    to: nebEmail,
    subject: `New Aspirant Application — ${data.positionTitle} (${data.electionTitle})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">New Aspirant Application</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">People's Renaissance Movement</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 24px; color: #374151;">
            A new aspirant application has been submitted and is pending review.
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <tbody>
              ${row('Full Name', data.fullName || 'Not provided')}
              ${row('ID Number', data.idNumber)}
              ${row('Phone', data.phone || 'Not provided')}
              ${row('Email', data.email || 'Not provided')}
              ${row('Election', data.electionTitle)}
              ${row('Position', data.positionTitle)}
              ${row('Position Level', data.positionLevel)}
              ${row('Location', location)}
              ${data.pollingStation ? row('Polling Station', data.pollingStation) : ''}
            </tbody>
          </table>

          <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px;">
            Please log in to the admin dashboard to review and approve or reject this application.
          </p>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated notification from the PRM member portal.
          </p>
        </div>
      </div>
    `,
  })
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #f3f4f6; width: 40%; background: #f9fafb;">
        ${label}
      </td>
      <td style="padding: 12px 16px; font-size: 14px; color: #111827; border-bottom: 1px solid #f3f4f6;">
        ${value}
      </td>
    </tr>
  `
}
