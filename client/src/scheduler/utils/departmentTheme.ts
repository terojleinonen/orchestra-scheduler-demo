export type DepartmentTheme = {
  bg: string
  border: string
  text: string
  glow: string
}

const themes: Record<string, DepartmentTheme> = {
  lighting: {
    bg: "linear-gradient(180deg, #facc15, #ca8a04)",
    border: "#facc15",
    text: "#1f2937",
    glow: "rgba(250, 204, 21, 0.4)"
  },

  sound: {
    bg: "linear-gradient(180deg, #a855f7, #6b21a8)",
    border: "#a855f7",
    text: "#f3e8ff",
    glow: "rgba(168, 85, 247, 0.4)"
  },

  stage: {
    bg: "linear-gradient(180deg, #22c55e, #166534)",
    border: "#22c55e",
    text: "#ecfdf5",
    glow: "rgba(34, 197, 94, 0.4)"
  },

  orchestra: {
    bg: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
    border: "#3b82f6",
    text: "#dbeafe",
    glow: "rgba(59, 130, 246, 0.4)"
  },

  production: {
    bg: "linear-gradient(180deg, #f97316, #c2410c)",
    border: "#f97316",
    text: "#fff7ed",
    glow: "rgba(249, 115, 22, 0.4)"
  }
}

// fallback
const defaultTheme: DepartmentTheme = {
  bg: "linear-gradient(180deg, #6b7280, #374151)",
  border: "#6b7280",
  text: "#f9fafb",
  glow: "rgba(107, 114, 128, 0.4)"
}

export function getDepartmentTheme(department?: string): DepartmentTheme {
  if (!department) return defaultTheme

  const key = department.toLowerCase()

  return themes[key] || defaultTheme
}