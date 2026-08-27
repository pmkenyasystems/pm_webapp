import nodemailer from 'nodemailer'
import { moduleLabel } from './modules'

// General notifications (NDC, admin accounts, membership) — sent via Gmail.
export const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Aspirant application emails — sent via the NEB mailbox (Truehost SMTP) for
// better deliverability, since these were landing in spam when sent via Gmail.
const smtpPort = Number(process.env.SMTP_PORT) || 465

const nebTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.NEB_EMAIL,
    pass: process.env.SMTP_PASSWORD,
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

  if (!nebEmail) {
    console.error('Email not sent: NEB_EMAIL not configured in .env')
    return
  }

  const senderEmail = nebEmail

  const locationParts = [data.county, data.constituency, data.ward].filter(Boolean)
  const location = locationParts.length ? locationParts.join(', ') : 'Not specified'

  await nebTransporter.sendMail({
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

const MCA_REQUIREMENTS = [
  "Certified copy of the applicant's National Identity Card",
  'Certified Proof of registration as a voter',
  "Copy of the People's Renaissance Movement Life Membership Certificate/Card",
  'Clearance certificate from the Kenya Revenue Authority (KRA)',
  'Clearance certificate from the Higher Education Loans Board (HELB)',
  'Clearance certificate from the Ethics and Anti-Corruption Commission',
  'Certified Nomination Forms by the County Executive Committee (CEC) to which the applicant belongs (where applicable)',
  'Copy of post-secondary education from an institution recognized in Kenya',
  'Original receipt from the Party Headquarters as proof of payment of non-refundable nomination fee of Kshs. 35,000 (Kshs. 20,000 for SIGs)',
  'Original receipt from the PM Party as proof of payment of membership fee of Kshs. 10,000 (for recruitment of members)',
  'Meet all other requirements of the Elections Act and regulations made by the IEBC',
]

const MNA_REQUIREMENTS = [
  "Certified copy of the applicant's National Identity Card",
  'Certified Proof of registration as a voter',
  "Copy of the People's Renaissance Movement Life Membership Certificate",
  'Clearance certificate from the Kenya Revenue Authority (KRA)',
  'Clearance certificate from the Higher Education Loans Board (HELB)',
  'Clearance certificate from the Ethics and Anti-Corruption Commission',
  'Certified Nomination Forms by the County Executive Committee (CEC) to which the applicant belongs',
  'Copy of degree certificate from a university recognized in Kenya',
  'Original receipt from the Party Headquarters as proof of payment of non-refundable nomination fee of Kshs. 100,000 (Kshs. 50,000 for SIGs)',
  'Original receipt of payment of membership fee of Kshs. 40,000 (for recruitment of members)',
  'Meet all other requirements of the Elections Act and regulations made by the IEBC',
]

const SENATOR_WOMEN_REP_REQUIREMENTS = [
  "Certified copy of the applicant's National Identity Card",
  'Certified Proof of registration as a voter',
  "Copy of the People's Renaissance Movement Life Membership Certificate",
  'Clearance certificate from the Kenya Revenue Authority (KRA)',
  'Clearance certificate from the Higher Education Loans Board (HELB)',
  'Clearance certificate from the Ethics and Anti-Corruption Commission',
  'Certified Nomination Forms by the County Executive Committee (CEC) to which the applicant belongs',
  'Copy of degree certificate from a university recognized in Kenya',
  'Original receipt from the Party Headquarters as proof of payment of non-refundable nomination fee of Kshs. 250,000 (Kshs. 150,000 for SIGs)',
  'Original receipt of payment of membership fee of Kshs. 40,000 (for recruitment of members)',
  'Meet all other requirements of the Elections Act and regulations made by the IEBC',
]

const GOVERNOR_REQUIREMENTS = [
  "Certified copy of the applicant's National Identity Card",
  'Certified Proof of registration as a voter',
  "Copy of the People's Renaissance Movement Life Membership Certificate",
  'Clearance certificate from the Kenya Revenue Authority (KRA)',
  'Clearance certificate from the Higher Education Loans Board (HELB)',
  'Clearance certificate from the Ethics and Anti-Corruption Commission',
  'Certified Nomination Forms by the County Executive Committee (CEC) to which the applicant belongs',
  'Copy of degree certificate from a university recognized in Kenya',
  'Original receipt from the Party Headquarters as proof of payment of non-refundable nomination fee of Kshs. 500,000 (Kshs. 250,000 for SIGs)',
  'Original receipt of payment of membership fee of Kshs. 60,000 (for recruitment of members)',
  'Meet all other requirements of the Elections Act and regulations made by the IEBC',
]

/** Maps a position title (free text set by admins) to its nomination requirements checklist. */
function getAspirantRequirements(positionTitle: string): string[] | null {
  const title = positionTitle.trim().toLowerCase()

  if (title.includes('mca') || title.includes('county assembly')) return MCA_REQUIREMENTS
  if (title.includes('mna') || title === 'mp' || title.includes('member of parliament') || title.includes('national assembly'))
    return MNA_REQUIREMENTS
  if (title.includes('senator') || title.includes('women rep') || title.includes('woman rep'))
    return SENATOR_WOMEN_REP_REQUIREMENTS
  if (title.includes('governor')) return GOVERNOR_REQUIREMENTS

  return null
}

/** Confirms to the aspirant themselves that their application has been received. */
export async function sendAspirantConfirmation(data: {
  name: string
  email: string
  electionTitle: string
  positionTitle: string
  area: string
}) {
  const senderEmail = process.env.NEB_EMAIL

  if (!senderEmail) {
    throw new Error('NEB_EMAIL not configured in .env')
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const portalUrl = `${siteUrl}/membership/profile?section=applications`
  const firstName = data.name.trim().split(' ')[0] || 'there'
  const requirements = getAspirantRequirements(data.positionTitle)

  await nebTransporter.sendMail({
    from: `"PM Party Elections Board" <${senderEmail}>`,
    to: data.email,
    subject: `You're Registered as an Aspirant — ${data.positionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">You've Been Registered as an Aspirant</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">People's Renaissance Movement</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px; color: #374151;">
            Hello ${firstName},
          </p>
          <p style="margin: 0 0 20px; color: #374151;">
            Your application as an aspirant for the <strong>${data.positionTitle}</strong> position has been
            received successfully. Below are the details:
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
            <tbody>
              ${row('Election', data.electionTitle)}
              ${row('Position', data.positionTitle)}
              ${row('Area', data.area)}
            </tbody>
          </table>

          <p style="margin: 0 0 20px; color: #374151;">
            The National Elections Board will reach out to you regarding the next steps. In case of further
            inquiries, send an email to
            <a href="mailto:neb@pmparty.ke" style="color: #003366;">neb@pmparty.ke</a>.
          </p>

          ${
            requirements
              ? `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px; color: #111827; font-weight: 600;">In the meantime, start preparing the following</p>
            <ol style="margin: 0; padding-left: 18px; color: #374151; font-size: 14px; line-height: 1.7;">
              ${requirements.map((item) => `<li>${item}</li>`).join('')}
            </ol>
          </div>
          `
              : ''
          }

          <a href="${portalUrl}" style="display: inline-block; background: #003366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
            View My Application
          </a>

          <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px;">
            The Change We Need &mdash; Mabadiliko Ni Sasa
          </p>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated notification from the PM Party member portal. If you were not expecting
            this, please contact the secretariat.
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

  await gmailTransporter.sendMail({
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

export async function sendAdminWelcomeEmail(data: {
  name: string | null
  email: string
  temporaryPassword: string
  role: string
  modules: string[]
}) {
  const senderEmail = process.env.GMAIL_USER

  if (!senderEmail) {
    throw new Error('GMAIL_USER not configured in .env')
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const loginUrl = `${siteUrl}/admin/login`
  const firstName = data.name?.trim().split(' ')[0] || 'there'
  const accessList =
    data.role === 'super_admin'
      ? 'All modules (Super Admin)'
      : data.modules.length > 0
      ? data.modules.map(moduleLabel).join(', ')
      : 'No modules assigned yet'

  await gmailTransporter.sendMail({
    from: `"PM Party Admin" <${senderEmail}>`,
    to: data.email,
    subject: 'Your PM Party Admin Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">Welcome to the Admin Dashboard</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">People's Renaissance Movement</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px; color: #374151;">
            Hi ${firstName},
          </p>
          <p style="margin: 0 0 16px; color: #374151;">
            An admin account has been created for you on the PM Party admin dashboard. Use the credentials
            below to log in.
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 16px;">
            <tbody>
              ${row('Email', data.email)}
              ${row('Temporary Password', `<code style="font-size: 15px; font-weight: 700;">${data.temporaryPassword}</code>`)}
              ${row('Access', accessList)}
            </tbody>
          </table>

          <p style="margin: 0 0 24px; color: #b91c1c; font-size: 13px; font-weight: 600;">
            For security, please change this password immediately after your first login.
          </p>

          <a href="${loginUrl}" style="display: inline-block; background: #003366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
            Log In to Admin Dashboard
          </a>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated message from the PM Party admin dashboard. If you were not expecting this
            account, please contact the secretariat.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendAdminPasswordResetEmail(data: {
  name: string | null
  email: string
  temporaryPassword: string
}) {
  const senderEmail = process.env.GMAIL_USER

  if (!senderEmail) {
    throw new Error('GMAIL_USER not configured in .env')
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const loginUrl = `${siteUrl}/admin/login`
  const firstName = data.name?.trim().split(' ')[0] || 'there'

  await gmailTransporter.sendMail({
    from: `"PM Party Admin" <${senderEmail}>`,
    to: data.email,
    subject: 'Your PM Party Admin Password Has Been Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">Password Reset</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">People's Renaissance Movement</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px; color: #374151;">
            Hi ${firstName},
          </p>
          <p style="margin: 0 0 16px; color: #374151;">
            Your password for the PM Party admin dashboard has been reset by a super admin. Use the
            temporary password below to log in.
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 16px;">
            <tbody>
              ${row('Email', data.email)}
              ${row('Temporary Password', `<code style="font-size: 15px; font-weight: 700;">${data.temporaryPassword}</code>`)}
            </tbody>
          </table>

          <p style="margin: 0 0 24px; color: #b91c1c; font-size: 13px; font-weight: 600;">
            For security, please change this password immediately after logging in.
          </p>

          <a href="${loginUrl}" style="display: inline-block; background: #003366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
            Log In to Admin Dashboard
          </a>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated message from the PM Party admin dashboard. If you did not expect this
            reset, please contact the secretariat immediately.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendMembershipRegistrationConfirmation(data: { name: string; email: string }) {
  const senderEmail = process.env.GMAIL_USER

  if (!senderEmail) {
    console.error('Email not sent: GMAIL_USER not configured in .env')
    return
  }

  const firstName = data.name.trim().split(' ')[0] || 'there'

  await gmailTransporter.sendMail({
    from: `"PM Party" <${senderEmail}>`,
    to: data.email,
    subject: 'Thanks for Sharing Your Details with PM Party',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">Thanks for Reaching Out</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">People's Renaissance Movement</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px; color: #374151;">
            Dear ${firstName},
          </p>
          <p style="margin: 0 0 16px; color: #374151;">
            Thank you for sharing your details with People's Renaissance Movement (PM Party). Our
            membership team has received your information and will be in touch to welcome you and keep
            you informed about PM Party activities near you.
          </p>
          <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px;">
            The Change We Need &mdash; Mabadiliko Ni Sasa
          </p>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated confirmation from the PM Party website.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendNominationCertificateEmail(data: {
  name: string
  email: string
  certificateNumber: string
  electionTitle: string
  positionTitle: string
}) {
  const senderEmail = process.env.NEB_EMAIL

  if (!senderEmail) {
    console.error('Email not sent: NEB_EMAIL not configured in .env')
    return
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const portalUrl = `${siteUrl}/membership/profile?section=candidatures`
  const firstName = data.name.trim().split(' ')[0] || 'there'

  await nebTransporter.sendMail({
    from: `"PM Party Elections Board" <${senderEmail}>`,
    to: data.email,
    subject: `Nomination Certificate Issued — ${data.positionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #003366; color: white; padding: 24px 32px;">
          <h2 style="margin: 0;">You've Been Nominated</h2>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">People's Renaissance Movement — Elections Board</p>
        </div>

        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 16px; color: #374151;">
            Dear ${firstName},
          </p>
          <p style="margin: 0 0 16px; color: #374151;">
            Congratulations — the National Elections Board has issued you a nomination certificate,
            confirming you as a PM Party candidate for the position and election below.
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
            <tbody>
              ${row('Certificate No.', data.certificateNumber)}
              ${row('Election', data.electionTitle)}
              ${row('Position', data.positionTitle)}
            </tbody>
          </table>

          <a href="${portalUrl}" style="display: inline-block; background: #003366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
            View My Candidature Profile
          </a>

          <p style="margin: 24px 0 0; color: #6b7280; font-size: 13px;">
            The Change We Need &mdash; Mabadiliko Ni Sasa
          </p>
        </div>

        <div style="padding: 16px 32px; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated notification from the PM Party Elections Board.
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
