import nodemailer from 'nodemailer'
import path from 'path'
import { moduleLabel } from './modules'

const ASPIRANT_APPLICATION_FORM_PATH = path.join(
  process.cwd(),
  'public',
  'documents',
  'PM-Party-Aspirant-Application-Form.pdf'
)

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

/** Confirms to the aspirant themselves that they've been registered, and what happens next. */
export async function sendAspirantConfirmation(data: {
  name: string
  email: string
  electionTitle: string
  positionTitle: string
  positionLevel: string
  area: string
}) {
  const senderEmail = process.env.GMAIL_USER

  if (!senderEmail) {
    throw new Error('GMAIL_USER not configured in .env')
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const portalUrl = `${siteUrl}/membership/profile?section=applications`
  const firstName = data.name.trim().split(' ')[0] || 'there'

  await transporter.sendMail({
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
            Dear ${firstName},
          </p>
          <p style="margin: 0 0 20px; color: #374151;">
            You have been registered as an aspirant with People's Renaissance Movement (PM Party) for the
            position and election below.
          </p>

          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
            <tbody>
              ${row('Election', data.electionTitle)}
              ${row('Position', data.positionTitle)}
              ${row('Level', data.positionLevel)}
              ${row('Area', data.area)}
            </tbody>
          </table>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 24px; margin-bottom: 16px;">
            <p style="margin: 0 0 10px; color: #111827; font-weight: 600;">What happens next</p>
            <ol style="margin: 0; padding-left: 18px; color: #374151; font-size: 14px; line-height: 1.7;">
              <li>
                Complete the attached <strong>Application Form for Nomination as a Party Official</strong>
                (in triplicate) and the Code of Conduct declaration included with it.
              </li>
              <li>Gather the supporting documents listed below and submit everything to the National Elections Board.</li>
              <li>Your application will then be <strong>pending review</strong> by the Elections Board.</li>
              <li>You'll receive an email once a decision has been made on your application.</li>
              <li>You can check your status anytime from the Member Portal.</li>
            </ol>
          </div>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px; color: #111827; font-weight: 600;">Documents to submit with your form</p>
            <ol style="margin: 0; padding-left: 18px; color: #374151; font-size: 14px; line-height: 1.7;">
              <li>A detailed Curriculum Vitae</li>
              <li>Certified copy of your ID card or passport</li>
              <li>Certified copies of your academic and professional certificates</li>
              <li>Certified copy of your certificate of registration with the NCPD, where applicable</li>
              <li>All clearances as prescribed in Chapter Six of the Constitution of Kenya</li>
              <li>Certified copy of your Party Membership card and/or certificate</li>
              <li>Names of a proposer and seconder who are fully paid-up Party members</li>
              <li>Duly completed, signed and commissioned Code of Conduct form</li>
            </ol>
          </div>

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
    attachments: [
      {
        filename: 'PM-Party-Aspirant-Application-Form.pdf',
        path: ASPIRANT_APPLICATION_FORM_PATH,
        contentType: 'application/pdf',
      },
    ],
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

  await transporter.sendMail({
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

  await transporter.sendMail({
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

  await transporter.sendMail({
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
  const senderEmail = process.env.GMAIL_USER

  if (!senderEmail) {
    console.error('Email not sent: GMAIL_USER not configured in .env')
    return
  }

  const siteUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')
  const portalUrl = `${siteUrl}/membership/profile?section=candidatures`
  const firstName = data.name.trim().split(' ')[0] || 'there'

  await transporter.sendMail({
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
