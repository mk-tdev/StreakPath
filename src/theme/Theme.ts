export const Theme = {
  colors: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    background: '#0f172a', // Slate 900
    surface: '#1e293b', // Slate 800
    text: '#f8fafc', // Slate 50
    textSecondary: '#94a3b8', // Slate 400
    success: '#10b981', // Emerald 500
    error: '#ef4444', // Red 500
    warning: '#f59e0b', // Amber 500
    info: '#3b82f6', // Blue 500
    border: '#334155', // Slate 700
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
    },
  },
};
