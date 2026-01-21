import { getSession } from './auth'
import { prisma } from './prisma'

export type Module = 'news' | 'events' | 'elections' | 'positions' | 'members' | 'volunteers' | 'donations' | 'admins'

/**
 * Check if the current user has access to a specific module
 */
export async function hasModuleAccess(module: Module): Promise<boolean> {
  const session = await getSession()
  
  if (!session || !session.user) {
    return false
  }

  // Super admin has access to everything
  if (session.user.role === 'super_admin') {
    return true
  }

  // Get user from database to check modules
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user) {
    return false
  }

  // If no modules assigned, deny access
  if (!user.modules) {
    return false
  }

  try {
    const modules = JSON.parse(user.modules) as string[]
    return modules.includes(module)
  } catch {
    return false
  }
}

/**
 * Check if the current user is a super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.user?.role === 'super_admin' || false
}

/**
 * Get all available modules
 */
export function getAvailableModules(): { value: Module; label: string }[] {
  return [
    { value: 'news', label: 'News/Articles' },
    { value: 'events', label: 'Events' },
    { value: 'elections', label: 'Elections' },
    { value: 'positions', label: 'Positions' },
    { value: 'members', label: 'Members' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'donations', label: 'Donations' },
    { value: 'admins', label: 'Admin Management' },
  ]
}

