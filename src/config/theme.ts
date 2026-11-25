
export const theme = {
  brand: {
    name: "SYMBIOLOGY",
    tagline: "grow ur future",
    product: "Smart Aquaponic IoT Kit",
  },

  colors: {
    primary: "#005B45",
    primaryDark: "#003D2E",
    primaryHover: "#08785C",
    primaryLight: "#E2F0E9",

    accent: "#FF70AD",
    accentHover: "#F05297",
    accentLight: "#FFE0EE",

    background: "#FFFAE7",
    surface: "#FFFFFF",
    surfaceMuted: "#F5F0DD",

    foreground: "#005B45",
    muted: "#62766D",
    border: "#DCE6DB",

    success: "#16834F",
    warning: "#D99A18",
    danger: "#DC2626",
    info: "#3182CE",
  },

  radius: {
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    xxl: "32px",
    full: "9999px",
  },

  shadow: {
    sm: "0 2px 8px rgba(0,91,69,0.05)",
    md: "0 8px 24px rgba(0,91,69,0.08)",
    lg: "0 16px 40px rgba(0,91,69,0.12)",
    pink: "0 8px 24px rgba(255,112,173,0.25)",
  },

  layout: {
    maxWidth: "1600px",
    headerHeight: "78px",
    bottomNavHeight: "80px",
  },
} as const;

export type Theme = typeof theme;

export default theme;
