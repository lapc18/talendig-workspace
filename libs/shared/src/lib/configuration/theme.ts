import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

// Design system tokens
const designSystem = {
  colors: {
    primary: '#1337ec',
    light: {
      background: {
        app: '#f6f6f8',
        surface: '#ffffff',
        surfaceAlt: '#f8fafc',
        surfaceElevated: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#64748b',
        inverse: '#ffffff',
        link: '#1337ec',
      },
      border: {
        subtle: '#f1f5f9',
        default: '#e2e8f0',
        strong: '#cbd5e1',
        focus: '#1337ec',
      },
      icon: {
        default: '#64748b',
        muted: '#94a3b8',
        strong: '#475569',
      },
    },
    dark: {
      background: {
        app: '#101322',
        surface: '#101322',
        surfaceAlt: '#0f172a',
        surfaceCard: '#0b1220',
        surfaceElevated: '#0f172a',
      },
      text: {
        primary: '#ffffff',
        secondary: '#cbd5e1',
        muted: '#94a3b8',
        inverse: '#0f172a',
        link: '#1337ec',
      },
      border: {
        subtle: '#1e293b',
        default: '#1f2937',
        strong: '#334155',
        focus: '#1337ec',
      },
      icon: {
        default: '#94a3b8',
        muted: '#64748b',
        strong: '#cbd5e1',
      },
    },
    status: {
      active: {
        light: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
        dark: { bg: 'rgba(34,197,94,0.18)', text: '#4ade80', border: 'rgba(34,197,94,0.25)', dot: '#22c55e' },
      },
      inactive: {
        light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', dot: '#f59e0b' },
        dark: { bg: 'rgba(245,158,11,0.18)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
  },
      completed: {
        light: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe', dot: '#1337ec' },
        dark: { bg: 'rgba(19,55,236,0.18)', text: '#93c5fd', border: 'rgba(19,55,236,0.25)', dot: '#1337ec' },
      },
      cancelled: {
        light: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
        dark: { bg: 'rgba(239,68,68,0.18)', text: '#fca5a5', border: 'rgba(239,68,68,0.25)', dot: '#ef4444' },
      },
      pending: {
        light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a', dot: '#f59e0b' },
        dark: { bg: 'rgba(245,158,11,0.18)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
  },
    },
    semantic: {
      overlayScrim: 'rgba(2, 6, 23, 0.55)',
      focusRing: 'rgba(19, 55, 236, 0.5)',
    },
  },
  typography: {
    fonts: {
      display: 'Lexend, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      body: 'Noto Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    },
    scale: {
      pageTitle: { fontSize: 30, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
      h2: { fontSize: 20, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' },
      h3: { fontSize: 18, fontWeight: 700, lineHeight: 1.3 },
      body: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
      bodyMedium: { fontSize: 14, fontWeight: 500, lineHeight: 1.5 },
      bodyStrong: { fontSize: 14, fontWeight: 700, lineHeight: 1.5 },
      small: { fontSize: 12, fontWeight: 500, lineHeight: 1.35 },
      xsUpper: { fontSize: 11, fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.08em', textTransform: 'uppercase' },
    },
  },
  radii: {
    default: 4,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  shadows: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
    md: '0 6px 18px rgba(15, 23, 42, 0.10)',
  },
  spacing: 8,
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Helper to create theme options
const createThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => {
  const colors = designSystem.colors[mode];
  const isLight = mode === 'light';

  return {
  palette: {
      mode,
      primary: {
        main: designSystem.colors.primary,
        light: '#0f2fcc',
        dark: '#0f2fcc',
        contrastText: '#ffffff',
      },
      background: {
        default: colors.background.app,
        paper: colors.background.surface,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.muted,
      },
      divider: colors.border.default,
      // Extend palette with custom colors
      ...({
        backgroundAlt: colors.background.surfaceAlt,
        backgroundElevated: colors.background.surfaceElevated,
        textMuted: colors.text.muted,
        textInverse: colors.text.inverse,
        textLink: colors.text.link,
        borderSubtle: colors.border.subtle,
        borderStrong: colors.border.strong,
        borderFocus: colors.border.focus,
        iconDefault: colors.icon.default,
        iconMuted: colors.icon.muted,
        iconStrong: colors.icon.strong,
        status: {
          active: designSystem.colors.status.active[mode],
          inactive: designSystem.colors.status.inactive[mode],
          completed: designSystem.colors.status.completed[mode],
          cancelled: designSystem.colors.status.cancelled[mode],
          pending: designSystem.colors.status.pending[mode],
        },
      } as any),
  },
  typography: {
      fontFamily: designSystem.typography.fonts.body,
    h1: {
        fontFamily: designSystem.typography.fonts.display,
        ...designSystem.typography.scale.pageTitle,
    },
    h2: {
        fontFamily: designSystem.typography.fonts.display,
        ...designSystem.typography.scale.h2,
    },
    h3: {
        fontFamily: designSystem.typography.fonts.display,
        ...designSystem.typography.scale.h3,
    },
    h4: {
        fontFamily: designSystem.typography.fonts.display,
        fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
        fontFamily: designSystem.typography.fonts.display,
        fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
        fontFamily: designSystem.typography.fonts.display,
        fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
        fontFamily: designSystem.typography.fonts.body,
        ...designSystem.typography.scale.body,
    },
    body2: {
        fontFamily: designSystem.typography.fonts.body,
        ...designSystem.typography.scale.bodyMedium,
      },
      caption: {
        fontFamily: designSystem.typography.fonts.body,
        ...designSystem.typography.scale.small,
    },
    button: {
        fontFamily: designSystem.typography.fonts.body,
      textTransform: 'none',
      fontWeight: 500,
        fontSize: 14,
    },
  },
  shape: {
      borderRadius: designSystem.radii.default,
  },
    spacing: designSystem.spacing,
  breakpoints: {
      values: designSystem.breakpoints,
    },
    shadows: [
      'none',
      designSystem.shadows.sm,
      designSystem.shadows.md,
      '0 8px 24px rgba(15, 23, 42, 0.12)',
      '0 12px 32px rgba(15, 23, 42, 0.15)',
      '0 16px 40px rgba(15, 23, 42, 0.18)',
      '0 20px 48px rgba(15, 23, 42, 0.20)',
      '0 24px 56px rgba(15, 23, 42, 0.22)',
      '0 28px 64px rgba(15, 23, 42, 0.24)',
      '0 32px 72px rgba(15, 23, 42, 0.26)',
      '0 36px 80px rgba(15, 23, 42, 0.28)',
      '0 40px 88px rgba(15, 23, 42, 0.30)',
      '0 44px 96px rgba(15, 23, 42, 0.32)',
      '0 48px 104px rgba(15, 23, 42, 0.34)',
      '0 52px 112px rgba(15, 23, 42, 0.36)',
      '0 56px 120px rgba(15, 23, 42, 0.38)',
      '0 60px 128px rgba(15, 23, 42, 0.40)',
      '0 64px 136px rgba(15, 23, 42, 0.42)',
      '0 68px 144px rgba(15, 23, 42, 0.44)',
      '0 72px 152px rgba(15, 23, 42, 0.46)',
      '0 76px 160px rgba(15, 23, 42, 0.48)',
      '0 80px 168px rgba(15, 23, 42, 0.50)',
      '0 84px 176px rgba(15, 23, 42, 0.52)',
      '0 88px 184px rgba(15, 23, 42, 0.54)',
      '0 92px 192px rgba(15, 23, 42, 0.56)',
      '0 96px 200px rgba(15, 23, 42, 0.58)',
    ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
            borderRadius: designSystem.radii.lg,
            height: 40,
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: designSystem.typography.fonts.body,
        },
        contained: {
            backgroundColor: designSystem.colors.primary,
            color: '#ffffff',
            boxShadow: '0 1px 2px rgba(19, 55, 236, 0.30)',
            '&:hover': {
              backgroundColor: '#0f2fcc',
              boxShadow: '0 1px 2px rgba(19, 55, 236, 0.30)',
            },
          },
          outlined: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            color: isLight ? '#334155' : '#cbd5e1',
            borderColor: isLight ? '#cbd5e1' : '#334155',
            '&:hover': {
              backgroundColor: isLight ? '#f8fafc' : '#334155',
              borderColor: isLight ? '#cbd5e1' : '#334155',
            },
          },
          text: {
            backgroundColor: 'transparent',
            color: isLight ? '#475569' : '#94a3b8',
          '&:hover': {
              backgroundColor: isLight ? '#f1f5f9' : '#1e293b',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
            borderRadius: designSystem.radii.xl,
            backgroundColor: isLight ? '#ffffff' : '#0f172a',
            border: `1px solid ${colors.border.default}`,
            boxShadow: designSystem.shadows.sm,
            padding: 20,
            '&:hover': {
              boxShadow: designSystem.shadows.md,
            },
        },
      },
    },
      MuiPaper: {
      styleOverrides: {
        root: {
            borderRadius: designSystem.radii.xl,
            backgroundColor: isLight ? '#ffffff' : '#0f172a',
            border: `1px solid ${colors.border.default}`,
            boxShadow: designSystem.shadows.sm,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: designSystem.radii.full,
            height: 24,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: designSystem.typography.fonts.body,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
              borderRadius: designSystem.radii.lg,
              backgroundColor: isLight ? '#f1f5f9' : '#1f2937',
              color: isLight ? '#0f172a' : '#ffffff',
              '&:not(.MuiInputBase-multiline)': {
                height: 40,
              },
              '&.MuiInputBase-multiline': {
                padding: '8px 14px',
                minHeight: 40,
              },
              '& fieldset': {
                borderColor: isLight ? '#e2e8f0' : '#334155',
              },
              '&:hover fieldset': {
                borderColor: isLight ? '#cbd5e1' : '#475569',
              },
              '&.Mui-focused fieldset': {
                borderColor: designSystem.colors.primary,
                borderWidth: 2,
              },
              '&.Mui-error fieldset': {
                borderColor: '#ef4444',
              },
              '&.Mui-disabled': {
                backgroundColor: isLight ? '#f8fafc' : '#1e293b',
                '& fieldset': {
                  borderColor: isLight ? '#e2e8f0' : '#334155',
                },
              },
              '& input::placeholder, & textarea::placeholder': {
                color: isLight ? '#94a3b8' : '#64748b',
                opacity: 1,
              },
            },
          },
        },
      },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.radii.lg,
          height: 40,
          backgroundColor: isLight ? '#f1f5f9' : '#1f2937',
          color: isLight ? '#0f172a' : '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isLight ? '#e2e8f0' : '#334155',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isLight ? '#cbd5e1' : '#475569',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: designSystem.colors.primary,
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ef4444',
          },
          '&.Mui-disabled': {
            backgroundColor: isLight ? '#f8fafc' : '#1e293b',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? '#e2e8f0' : '#334155',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.radii.lg,
          backgroundColor: isLight ? '#f1f5f9' : '#1f2937',
          color: isLight ? '#0f172a' : '#ffffff',
          '& input::placeholder': {
            color: isLight ? '#94a3b8' : '#64748b',
            opacity: 1,
          },
          '&.MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: isLight ? '#e2e8f0' : '#334155',
            },
            '&:hover fieldset': {
              borderColor: isLight ? '#cbd5e1' : '#475569',
            },
            '&.Mui-focused fieldset': {
              borderColor: designSystem.colors.primary,
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444',
            },
          },
        },
      },
    },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: designSystem.spacing,
        },
      },
    },
      MuiDivider: {
      styleOverrides: {
        root: {
            borderColor: colors.border.default,
          },
        },
      },
    },
  };
};

// Create light and dark themes
export const talendigThemeLight = createTheme(createThemeOptions('light'));
export const talendigThemeDark = createTheme(createThemeOptions('dark'));

// Default export (light theme for now, can be made dynamic)
export const talendigTheme = talendigThemeLight;

export type TalendigTheme = typeof talendigTheme;
