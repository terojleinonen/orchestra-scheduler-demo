// Department colours are defined as CSS custom properties in theme.css (light and dark variants).
const KNOWN = ["orchestra", "choir", "stage", "lighting", "sound", "library", "production"]

export function departmentColor(department?: string): string {
  const key = department?.toLowerCase()
  return key && KNOWN.includes(key) ? `var(--dept-${key})` : "var(--dept-default)"
}
