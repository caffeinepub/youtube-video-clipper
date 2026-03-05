export type CustomRole = "tester" | "mod" | "helper";

const STORAGE_KEY = "beast_custom_roles";

export function getCustomRole(principalStr: string): CustomRole | null {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data[principalStr] || null;
  } catch {
    return null;
  }
}

export function setCustomRole(
  principalStr: string,
  role: CustomRole | null,
): void {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (role === null) delete data[principalStr];
    else data[principalStr] = role;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getAllCustomRoles(): Record<string, CustomRole> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
