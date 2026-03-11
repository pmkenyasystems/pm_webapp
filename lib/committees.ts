export type CommitteeRole = 'Chairperson' | 'Vice Chairperson' | 'Secretary' | 'Member'

export interface CommitteeMember {
  name: string
  role: CommitteeRole
  bio: string
  profileImage?: string
  linkedinUrl?: string
  email?: string
}

export interface Committee {
  id: string
  title: string
  description: string
  image: string
  members?: CommitteeMember[]
}

const ROLE_ORDER: CommitteeRole[] = ['Chairperson', 'Vice Chairperson', 'Secretary', 'Member']

export function sortMembersByRole(members: CommitteeMember[]): CommitteeMember[] {
  return [...members].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
  )
}

export const committees: Committee[] = [
  {
    id: 'recruitment',
    title: 'Recruitment & Membership Drive',
    description: 'Drive membership growth and engagement. Help identify, onboard, and integrate new members into the party structure.',
    image: '/images/committees/recruitment.jpg',
    members: [
      {
        name: 'Samuel Munyekenye',
        role: 'Chairperson',
        bio: 'Chairperson of the Recruitment & Membership Drive Committee, leading membership growth and engagement efforts across the party.',
      },
    ],
  },
  {
    id: 'resource-mobilization',
    title: 'Resource Mobilization',
    description: 'Support the party\'s financial sustainability through fundraising, partnerships, and strategic resource allocation.',
    image: '/images/committees/resource-mobilization.jpg',
    members: [
      {
        name: 'Caroline Muhila',
        role: 'Chairperson',
        bio: 'Chairperson of the Resource Mobilization Committee, overseeing fundraising and strategic resource allocation for the party.',
      },
    ],
  },
  {
    id: 'legal-affairs',
    title: 'Legal & International Affairs',
    description: 'Provide legal guidance, compliance oversight, and representation on party matters and electoral processes.',
    image: '/images/committees/legal-affairs.jpg',
    members: [
      {
        name: 'Prof. Nicodemus Minde',
        role: 'Chairperson',
        bio: 'Chairperson of the Legal & International Affairs Committee, providing legal guidance and compliance oversight on party and electoral matters.',
      },
      {
        name: 'Austine Wambingwa',
        role: 'Member',
        bio: 'Member of the Legal & International Affairs Committee.',
      },
    ],
  },
  {
    id: 'national-elections-board',
    title: 'National Elections Board',
    description: 'Oversee party internal elections, ensure free and fair processes, and manage electoral compliance at national level.',
    image: '/images/committees/legal-affairs.jpg',
    members: [
      {
        name: 'Carren Moga',
        role: 'Chairperson',
        bio: 'Chairperson of the National Elections Board, overseeing party internal elections and electoral compliance at national level.',
      },
    ],
  },
  {
    id: 'policy-formulation-strategy',
    title: 'Policy & Strategy',
    description: 'Develop and refine party policies, manifestos, and long-term strategy for governance and national development.',
    image: '/images/committees/policy-strategy.jpg',
    members: [
      {
        name: 'Buluma Antony Samba',
        role: 'Chairperson',
        bio: 'Public management professional with over ten years\' experience in the public, private and civil society. Established credentials in public policy development, program implementation and youth empowerment initiatives. Proven ability to identify and leverage international donor networks for local public service initiatives. A strong communicator who is able to articulate complex policy initiatives to the wider public and a holder of Masters Degree in International Relations at the United States International University.',
        profileImage: '/images/profile/buluma.png',
      },
    ],
  },
  {
    id: 'diaspora-affairs',
    title: 'Diaspora Affairs',
    description: 'Engage Kenyans abroad, coordinate diaspora contributions, and integrate their voice into party programmes.',
    image: '/images/committees/diaspora.jpg',
    members: [],
  },
  {
    id: 'human-rights',
    title: 'Human Rights & Gender Compliance',
    description: 'Advance and protect human rights, promote equality, and ensure the party\'s agenda reflects dignity for all.',
    image: '/images/committees/human-rights.jpg',
    members: [
      {
        name: 'Martha Selina Nerima Wako',
        role: 'Chairperson',
        bio: 'Chairperson of the Human Rights & Gender Compliance Committee, advancing and protecting human rights and promoting equality in the party agenda.',
      },
    ],
  },
  {
    id: 'media-pr-communications',
    title: 'Media, Relations, Publicity & Communications',
    description: 'Shape the party\'s public image, manage media relations, and communicate our message clearly and effectively.',
    image: '/images/committees/media-pr.jpg',
    members: [
      {
        name: 'Jomo Alex',
        role: 'Chairperson',
        bio: 'Chairperson of the Media, Relations, Publicity & Communications Committee, leading the party\'s public image and communications.',
      },
      {
        name: 'Edwin A. Makori',
        role: 'Vice Chairperson',
        bio: 'Vice Chairperson of the Media, Relations, Publicity & Communications Committee.',
      },
    ],
  },
]

export function getCommitteeBySlug(slug: string): Committee | undefined {
  return committees.find((c) => c.id === slug)
}
