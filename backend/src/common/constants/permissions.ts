/**
 * Permission constants for PBAC (Permission-Based Access Control)
 *
 * Format: resource:action[:scope]
 * - resource: the entity being accessed (user, course, etc.)
 * - action: the operation (read, write, delete)
 * - scope: optional scope modifier (self, all)
 *
 * For scaling to more complex authorization, consider CASL or similar ABAC libraries.
 */

export const Permissions = {
  USER_READ_SELF: 'user:read:self',
} as const

export type Permission = (typeof Permissions)[keyof typeof Permissions]

/**
 * Default permissions assigned to new users on signup
 */
export const DEFAULT_USER_PERMISSIONS: Permission[] = [Permissions.USER_READ_SELF]

/**
 * Role-to-permissions mapping (for future expansion)
 * Currently we use direct permission assignment, but this provides
 * a documented path for role-based grouping if needed.
 */
export const RolePermissions: Record<string, Permission[]> = {
  user: [Permissions.USER_READ_SELF],
}
