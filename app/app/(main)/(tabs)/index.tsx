import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenContainer, Text } from '@/common/components';

export default function HomeTab() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text variant="h1" align="center">
          {t('home.welcome')}
        </Text>
        <Text variant="body" align="center" color="secondary">
          {t('home.subtitle')}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.metrics.spacing.p32,
    gap: theme.metrics.spacingV.p8,
  },
}));
