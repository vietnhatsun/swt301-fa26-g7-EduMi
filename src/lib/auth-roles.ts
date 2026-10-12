export const AUTH_ROLES = ["student", "teacher", "parent", "staff", "admin"] as const;
export const REGISTERABLE_ROLES = ["student", "teacher", "parent"] as const;

export type UserRole = (typeof AUTH_ROLES)[number];
export type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && AUTH_ROLES.includes(role as UserRole);
}

export function isRegisterableRole(role: unknown): role is RegisterableRole {
  return typeof role === "string" && REGISTERABLE_ROLES.includes(role as RegisterableRole);
}

export function getRoleHomePath(role?: string | null) {
  if (role === "parent") return "/parent";
  return "/profile";
}

export function getRoleLabel(role?: string | null) {
  if (role === "teacher") return "giáo viên";
  if (role === "parent") return "phụ huynh";
  if (role === "staff") return "nhân viên";
  return "học sinh";
}