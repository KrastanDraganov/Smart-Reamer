import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { I18nManager, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ErrorBoundary } from '@/common/components/ErrorBoundary';
import i18n from '@/i18n/config';
import { QueryProvider } from '@/providers';
import { useAuthStore } from '@/providers/auth/authStore';

SplashScreen.preventAutoHideAsync();

const isArabic = i18n.language === 'ar';
if (Platform.OS !== 'web') {
  I18nManager.allowRTL(isArabic);
  I18nManager.forceRTL(isArabic);
}

function useAuthInit() {
  const initialize = useAuthStore((s) => s.initialize);
  const cleanup = useAuthStore((s) => s.cleanup);

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);
}

function RootNavigator() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.app },
      }}
      initialRouteName="(main)"
    >
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

function AppContent() {
  useAuthInit();

  return (
    <View style={styles.appContainer}>
      <RootNavigator />
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.rootView} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <QueryProvider>
          <BottomSheetModalProvider>
            <AppContent />
          </BottomSheetModalProvider>
        </QueryProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create((theme) => ({
  rootView: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  appContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
}));
