export type CommitteeRole = 'Interim Chairperson' | 'Chairperson' | 'Vice Chairperson' | 'Secretary' | 'Member'

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

const ROLE_ORDER: CommitteeRole[] = ['Interim Chairperson', 'Chairperson', 'Vice Chairperson', 'Secretary', 'Member']

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
      {
        name: 'Gideon Simiyu',
        role: 'Member',
        bio: 'Member of the Recruitment & Membership Drive Committee.',
      },
      {
        name: 'Elizabeth Nekesa',
        role: 'Member',
        bio: 'Member of the Recruitment & Membership Drive Committee.',
      },
      {
        name: 'Godfrey Okeyo',
        role: 'Member',
        bio: 'Member of the Recruitment & Membership Drive Committee.',
      },
      {
        name: 'Dan Korir',
        role: 'Member',
        bio: 'Member of the Recruitment & Membership Drive Committee.',
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
      {
        name: 'Noella Olukere',
        role: 'Member',
        bio: 'Chairperson Linda Mwananchi Young Women Movement. Events Manager and Political Analyst.',
        profileImage: '/images/profile/noela.jpeg',
      },
      {
        name: 'Dennis Ajega',
        role: 'Member',
        bio: 'Member of the Resource Mobilization Committee.',
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
        name: 'Caroline Thiong\'o',
        role: 'Member',
        bio: 'Member of the Legal & International Affairs Committee.',
      },
      {
        name: 'Judethedeus Ong\'ondo',
        role: 'Member',
        bio: 'Member of the Legal & International Affairs Committee.',
      },
      {
        name: 'Zulekha Godana',
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
        profileImage: '/images/profile/carren.PNG',
      },
      {
        name: 'John Simiyu',
        role: 'Member',
        bio: 'Member of the National Elections Board.',
      },
      {
        name: 'Catherine Chemiat',
        role: 'Member',
        bio: 'Member of the National Elections Board.',
      },
      {
        name: 'Vincent Mukabwa',
        role: 'Member',
        bio: 'Member of the National Elections Board.',
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
        name: 'Michael Orwa',
        role: 'Member',
        bio: 'Member of the Policy & Strategy Committee.',
      },
      {
        name: 'France Mukuranya',
        role: 'Member',
        bio: 'Member of the Policy & Strategy Committee.',
      },
      {
        name: 'Manoah Esinamutu',
        role: 'Member',
        bio: 'Member of the Policy & Strategy Committee.',
      },
      {
        name: 'Munyi Elijah',
        role: 'Member',
        bio: 'Member of the Policy & Strategy Committee.',
      },
    ],
  },
  {
    id: 'diaspora-affairs',
    title: 'Diaspora Affairs',
    description: 'Engage Kenyans abroad, coordinate diaspora contributions, and integrate their voice into party programmes.',
    image: '/images/committees/diaspora.jpg',
    members: [
      {
        name: 'Dr. Emmaculate Tatu',
        role: 'Member',
        bio: 'Member of the Diaspora Affairs Committee.',
      },
      {
        name: 'Mohammed Adam',
        role: 'Member',
        bio: 'Member of the Diaspora Affairs Committee.',
      },
      {
        name: 'Dennis Olsson',
        role: 'Member',
        bio: 'Member of the Diaspora Affairs Committee.',
      },
    ],
  },
  {
    id: 'human-rights',
    title: 'Human Rights & Gender Compliance',
    description: 'Advance and protect human rights, promote equality, and ensure the party\'s agenda reflects dignity for all.',
    image: '/images/committees/human-rights.jpg',
    members: [
      {
        name: 'Nerima Wako',
        role: 'Chairperson',
        bio: 'Social Accountability Champion, Keynote Speaker, Political & Governance Expert.',
        profileImage: '/images/profile/nerima.png',
        linkedinUrl: 'https://ke.linkedin.com/in/nerimawako',
      },
      {
        name: 'Lydia Nanjeko',
        role: 'Member',
        bio: 'Member of the Human Rights & Gender Compliance Committee.',
      },
      {
        name: 'Whitney Mwenje',
        role: 'Member',
        bio: 'Member of the Human Rights & Gender Compliance Committee.',
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
        name: 'Amb. Yvonne Khamati',
        role: 'Chairperson',
        bio: 'Chairperson of the Media, Relations, Publicity & Communications Committee, leading the party\'s public image and communications.',
      },
      {
        name: 'Jomo Alex',
        role: 'Vice Chairperson',
        bio: 'Vice Chairperson of the Media, Relations, Publicity & Communications Committee.',
        profileImage: '/images/profile/jomo.png',
      },
      {
        name: 'Maxwell Okoth',
        role: 'Member',
        bio: 'Member of the Media, Relations, Publicity & Communications Committee.',
      },
      {
        name: 'Dennis Kanyeki',
        role: 'Member',
        bio: 'Member of the Media, Relations, Publicity & Communications Committee.',
      },
      {
        name: 'Miriam Obara',
        role: 'Member',
        bio: 'Member of the Media, Relations, Publicity & Communications Committee.',
      },
      {
        name: 'Daniel Wabwire',
        role: 'Member',
        bio: 'Member of the Media, Relations, Publicity & Communications Committee.',
      },
    ],
  },
]

export const partyOrgans: Committee[] = [
  {
    id: 'national-youth-league',
    title: 'National Youth League',
    description: 'The National Youth League mobilises and organises young Kenyans to actively participate in political processes, civic education, and the party\'s programmes for national renewal.',
    image: '/images/committees/youth-league.jpg',
    members: [
      {
        name: 'Sophie Mugure',
        role: 'Chairperson',
        bio: 'Chairperson of the National Youth League, leading the mobilisation and organisation of young Kenyans in the party\'s programmes for national renewal.',
      },
    ],
  },
  {
    id: 'national-women-league',
    title: 'National Women League',
    description: 'The National Women League champions the political, economic, and social empowerment of women within the party and across Kenya, ensuring women\'s voices are central to the Kenyan Renaissance.',
    image: '/images/committees/women-league.jpg',
    members: [
      {
        name: 'Riziki Juliet',
        role: 'Chairperson',
        bio: 'Chairperson of the National Women League, championing the political, economic, and social empowerment of women within the party and across Kenya.',
      },
    ],
  },
  {
    id: 'national-pwd-league',
    title: 'National PWD League',
    description: 'The National Persons with Disabilities League advocates for the rights, inclusion, and meaningful participation of persons with disabilities in all party structures and national governance.',
    image: '/images/committees/pwd-league.jpg',
    members: [
      {
        name: 'Catherine Wangari',
        role: 'Chairperson',
        bio: 'Chairperson of the National PWD League, advocating for the rights, inclusion, and meaningful participation of persons with disabilities in party structures and national governance.',
      },
    ],
  },
  {
    id: 'secretariat',
    title: 'The Secretariat',
    description: 'The Secretariat is responsible for the party\'s day-to-day administrative and business operations, providing institutional support, coordination, and continuity across all party structures and functions.',
    image: '/images/committees/secretariat.jpg',
    members: [],
  },
  {
    id: 'advisory-council',
    title: 'The Advisory Council',
    description: 'The Advisory Council comprises distinguished Kenyans who provide strategic counsel, institutional memory, and expert guidance to the party leadership on matters of governance and national policy.',
    image: '/images/committees/advisory-council.jpg',
    members: [
      {
        name: 'Njenga wa Ragū',
        role: 'Interim Chairperson',
        bio: 'Interim Chairperson of the National Advisory Council.',
        profileImage: '/images/profile/njenga.jpeg',
      },
    ],
  },
  {
    id: 'university-comrades',
    title: 'University Comrades',
    description: 'University Comrades is the party\'s campus wing, engaging students across Kenyan universities and colleges to build the next generation of civic leaders committed to the Kenyan Renaissance.',
    image: '/images/committees/university-comrades.jpg',
    members: [],
  },
]

export const allOrganisations = [...committees, ...partyOrgans]

export function getCommitteeBySlug(slug: string): Committee | undefined {
  return allOrganisations.find((c) => c.id === slug)
}
