import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenContainer, Text } from '@/common/components';

export default function SettingsTab() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text variant="h2">{t('settings.title')}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingTop: theme.metrics.spacingV.p16,
  },
}));
