import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUnistyles } from 'react-native-unistyles';

export default function AddLockLayout() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: theme.colors.text.primary,
        headerStyle: { backgroundColor: theme.colors.background.app },
        contentStyle: { backgroundColor: theme.colors.background.app },
      }}
    >
      <Stack.Screen
        name="scan"
        options={{ title: t('discovery.scan.title') }}
      />
      <Stack.Screen
        name="select"
        options={{ title: t('discovery.select.title') }}
      />
      <Stack.Screen
        name="name"
        options={{ title: t('discovery.name.title') }}
      />
      <Stack.Screen
        name="wifi"
        options={{ title: t('discovery.wifi.title') }}
      />
    </Stack>
  );
}
