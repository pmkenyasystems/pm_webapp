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

export async function sendNdcWelcomeEmail(data: { name: string; email: string }) {
  const senderEmail = process.env.GMAIL_USER

  if (!senderEmail) {
    console.error('Email not sent: GMAIL_USER not configured in .env')
    return
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const membershipUrl = `${siteUrl}/membership`
  const aspirantUrl = `${siteUrl}/aspirants/apply`
  const firstName = data.name.trim().split(' ')[0]

  await transporter.sendMail({
    from: `"PM Party" <${senderEmail}>`,
    to: data.email,
    subject: "You're Registered — National Delegates Convention (NDC) 2026",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">You're Registered!</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">National Delegates Convention (NDC) 2026</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px; color: #374151;">
            Dear ${firstName},
          </p>
          <p style="margin: 0 0 16px; color: #374151;">
            Thank you for registering for the People's Renaissance Movement (PM Party) National Delegates
            Convention (NDC). We're excited to welcome you.
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
            <tbody>
              ${row('Date', 'Tuesday, 11th August 2026')}
              ${row('Time', '10:00 AM &ndash; 1:00 PM')}
              ${row('Venue', 'The A.S.K Dome, ASK Showgrounds, Jamhuri Park &ndash; Nairobi')}
            </tbody>
          </table>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 24px; margin-bottom: 16px;">
            <p style="margin: 0 0 8px; color: #111827; font-weight: 600;">Not yet a party member?</p>
            <p style="margin: 0 0 12px; color: #374151; font-size: 14px;">
              If you're not yet a registered PM Party member, we'd love to welcome you into the movement.
            </p>
            <a href="${membershipUrl}" style="display: inline-block; background: #003366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
              Register as a Member
            </a>
          </div>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 24px; margin-bottom: 8px;">
            <p style="margin: 0 0 8px; color: #111827; font-weight: 600;">Considering vying for office?</p>
            <p style="margin: 0 0 12px; color: #374151; font-size: 14px;">
              If you are considering vying in the upcoming election, we encourage you to register as an aspirant.
            </p>
            <a href="${aspirantUrl}" style="display: inline-block; background: #C41E3A; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
              Register as an Aspirant
            </a>
          </div>

          <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px;">
            The Change We Need &mdash; Mabadiliko Ni Sasa
          </p>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated confirmation from the PM Party NDC registration page.
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
