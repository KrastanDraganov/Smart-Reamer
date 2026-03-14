import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';
import { Input } from '@/common/components/Input';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { lockWsClient } from '@/features/locks/services/websocketClient';

export default function WifiProvisionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigure = async () => {
    if (!ssid.trim()) return;

    setIsConfiguring(true);
    try {
      if (!lockWsClient.isConnected) {
        Alert.alert(t('errors.title'), t('discovery.wifi.failed'));
        return;
      }

      await lockWsClient.send('configure_wifi', {
        ssid: ssid.trim(),
        password,
      });
      Alert.alert(t('common.done'), t('discovery.wifi.success'));
      router.dismissAll();
    } catch {
      Alert.alert(t('errors.title'), t('discovery.wifi.failed'));
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleSkip = () => {
    router.dismissAll();
  };

  return (
    <ScreenContainer padded>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="wifi" variant="primary" size={40} />
        </View>

        <Text variant="body" color="tertiary" align="center">
          {t('discovery.wifi.subtitle')}
        </Text>

        <View style={styles.form}>
          <Text variant="label">{t('discovery.wifi.ssidLabel')}</Text>
          <Input
            placeholder={t('discovery.wifi.ssidPlaceholder')}
            value={ssid}
            onChangeText={setSsid}
            autoFocus
            autoCapitalize="none"
          />

          <Text variant="label">{t('discovery.wifi.passwordLabel')}</Text>
          <Input
            placeholder={t('discovery.wifi.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.actions}>
          <Button
            title={t('discovery.wifi.configure')}
            variant="primary"
            onPress={handleConfigure}
            loading={isConfiguring}
            disabled={!ssid.trim()}
          />
          <Button
            title={t('discovery.wifi.skip')}
            variant="ghost"
            onPress={handleSkip}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingTop: theme.metrics.spacingV.p32,
    gap: theme.metrics.spacingV.p24,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: theme.metrics.spacingV.p12,
  },
  actions: {
    gap: theme.metrics.spacingV.p12,
    marginTop: theme.metrics.spacingV.p16,
  },
}));
