export type ModuleName =
  | 'news'
  | 'elections'
  | 'positions'
  | 'members'
  | 'volunteers'
  | 'donations'
  | 'aspirants'
  | 'admins'

/** Module labels mirror the admin sidebar's menu items, so assigning a module reads the same as granting access to that menu. */
export const AVAILABLE_MODULES: { value: ModuleName; label: string }[] = [
  { value: 'members', label: 'Membership' },
  { value: 'elections', label: 'Elections Board' },
  { value: 'aspirants', label: 'Aspirants' },
  { value: 'donations', label: 'Resource Mobilization' },
  { value: 'volunteers', label: 'Volunteers' },
  { value: 'news', label: 'Articles' },
  { value: 'positions', label: 'Officials' },
  { value: 'admins', label: 'User Management' },
]

export function moduleLabel(value: string): string {
  return AVAILABLE_MODULES.find((m) => m.value === value)?.label ?? value
}
