const departmentColors: Record<string, string> = {
  lighting: "#facc15",
  sound: "#a855f7",
  stage: "#22c55e",
  orchestra: "#3b82f6",
  production: "#f97316"
}

const defaultColor = "#6b7280"

export function getDepartmentColor(department?: string): string {
  return (department && departmentColors[department.toLowerCase()]) || defaultColor
}
