/**
 * App-wide color tokens (71club). Import from here for new UI; legacy screens may still use raw hex.
 */
export const AppTheme = {
  background: "#0f1117",
  backgroundDeep: "#0c0e14",
  surface: "#1e293b",
  surfaceElevated: "#252f3f",
  header: "#1a1d26",
  tabBar: "#0f1117",

  accent: "#d4af37",
  accentBright: "#f59e0b",
  accentMuted: "#b45309",

  highlight: "#34d399",
  border: "#334155",
  borderSubtle: "rgba(255, 255, 255, 0.08)",

  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",

  inactiveTab: "#64748b",
  disabled: "#334155",
} as const;
