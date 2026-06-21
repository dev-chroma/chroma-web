import type { UserRole } from "@/types/user";

export const userRoles = ["Owner", "Admin", "Editor", "Author"] as const;
export const assignableRoles = ["Admin", "Editor", "Author"] as const;

export function isAdminRole(role?: string | null) {
  return role === "Admin" || role === "Owner";
}

export function isEditorialRole(role?: string | null) {
  return role === "Admin" || role === "Owner" || role === "Editor";
}

export function isAssignableRole(role: unknown): role is Exclude<UserRole, "Owner"> {
  return (
    typeof role === "string" &&
    assignableRoles.includes(role as Exclude<UserRole, "Owner">)
  );
}
