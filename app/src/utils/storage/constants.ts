export const STORAGE_KEYS = {
  preferences: {
    theme: 'user_theme_preference',
    themePreset: 'user_theme_preset',
    language: 'user_language',
    onboardingCompleted: 'onboarding_completed',
    notificationsEnabled: 'notifications_enabled',
  },
  auth: {
    lastEmail: 'auth_last_email',
  },
  app: {
    lastVersion: 'app_last_version',
    launchCount: 'app_launch_count',
  },
} as const;
