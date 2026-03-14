import Constants from 'expo-constants';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Switch } from '@/common/components/Switch';
import { Text } from '@/common/components/Text';
import { getCurrentMode, toggleDarkMode } from '@/theme/themeManager';

export default function SettingsTab() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(getCurrentMode() === 'dark');

  const handleThemeToggle = useCallback((value: boolean) => {
    setIsDark(value);
    toggleDarkMode(value);
  }, []);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenContainer scrollable padded>
      <Text variant="h1" style={styles.title}>{t('settings.title')}</Text>

      <View style={styles.section}>
        <Text variant="label" color="tertiary" style={styles.sectionLabel}>
          {t('settings.appearance')}
        </Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="moon-outline" variant="secondary" size={20} />
            <Text variant="body">{t('settings.darkMode')}</Text>
          </View>
          <Switch value={isDark} onValueChange={handleThemeToggle} />
        </View>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text variant="label" color="tertiary" style={styles.sectionLabel}>
          {t('settings.about')}
        </Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="information-circle-outline" variant="secondary" size={20} />
            <Text variant="body">{t('settings.version')}</Text>
          </View>
          <Text variant="body" color="muted">{appVersion}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icon name="shield-checkmark-outline" variant="secondary" size={20} />
            <Text variant="body">{t('settings.appName')}</Text>
          </View>
          <Text variant="body" color="muted">{t('settings.appNameValue')}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  title: {
    paddingTop: theme.metrics.spacingV.p8,
    paddingBottom: theme.metrics.spacingV.p16,
  },
  section: {
    paddingVertical: theme.metrics.spacingV.p8,
  },
  sectionLabel: {
    marginBottom: theme.metrics.spacingV.p12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
  },
}));
