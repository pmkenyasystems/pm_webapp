import { getSession } from './auth'
import { prisma } from './prisma'
import { AVAILABLE_MODULES, type ModuleName } from './modules'

export type Module = ModuleName

/**
 * Check if the current user has access to a specific module.
 * All authenticated users can access admin routes; this determines which modules they can use.
 * Super admins have access to all modules; other users are restricted by their assigned modules.
 */
export async function hasModuleAccess(module: Module): Promise<boolean> {
  const session = await getSession()

  if (!session?.user?.email) {
    return false
  }

  // Fetch fresh from the DB (not the JWT) so a deactivation or rights change
  // by a super admin takes effect immediately, without waiting for re-login.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || !user.isActive) {
    return false
  }

  // Super admin has access to everything
  if (user.role === 'super_admin') {
    return true
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
  if (!session?.user?.email) {
    return false
  }

  // Fetch fresh from the DB (not the JWT) so a deactivation takes effect immediately.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, isActive: true },
  })

  return !!user && user.isActive && user.role === 'super_admin'
}

/**
 * Get all available modules
 */
export function getAvailableModules(): { value: Module; label: string }[] {
  return AVAILABLE_MODULES
}

