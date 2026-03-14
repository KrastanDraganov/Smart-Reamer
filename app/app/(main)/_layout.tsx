import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

export default function MainLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.app },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
