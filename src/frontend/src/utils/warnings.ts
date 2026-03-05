export interface Warning {
  id: string;
  message: string;
  issuedBy: string; // principal string
  timestamp: number;
}

const STORAGE_KEY = "beast_warnings";

export function getWarnings(principalStr: string): Warning[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data[principalStr] || [];
  } catch {
    return [];
  }
}

export function getAllWarnings(): Record<string, Warning[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function issueWarning(
  targetPrincipal: string,
  message: string,
  issuedByPrincipal: string,
): void {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const existing: Warning[] = data[targetPrincipal] || [];
    existing.push({
      id: Date.now().toString(),
      message,
      issuedBy: issuedByPrincipal,
      timestamp: Date.now(),
    });
    data[targetPrincipal] = existing;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearWarnings(principalStr: string): void {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    delete data[principalStr];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
