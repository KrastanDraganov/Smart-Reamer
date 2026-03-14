import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/common/components/Button';
import { FormField } from '@/common/components/FormField';
import { Icon } from '@/common/components/Icon';
import { Input } from '@/common/components/Input';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { useAddLock } from '@/features/locks/hooks/useAddLock';
import { lockNameSchema, type LockNameFormData } from '@/features/locks/schemas/lockSchema';
import { useAddLockFlowStore } from '@/features/locks/stores/addLockFlowStore';

export default function NameScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const selectedDevice = useAddLockFlowStore((s) => s.selectedDevice);
  const resetFlow = useAddLockFlowStore((s) => s.reset);
  const addLockMutation = useAddLock();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LockNameFormData>({
    resolver: zodResolver(lockNameSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (data: LockNameFormData) => {
    if (!selectedDevice) return;
    await addLockMutation.mutateAsync({
      name: data.name,
      device: selectedDevice,
    });
    resetFlow();
    router.push('/add-lock/wifi');
  };

  return (
    <ScreenContainer padded>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="lock-closed" variant="primary" size={40} />
        </View>

        {selectedDevice && (
          <Text variant="bodySmall" color="tertiary" align="center">
            {selectedDevice.name} ({selectedDevice.ipAddress})
          </Text>
        )}

        <FormField
          name="name"
          control={control}
          label={t('discovery.name.label')}
          required
        >
          <Input
            placeholder={t('discovery.name.placeholder')}
            autoFocus
            maxLength={30}
          />
        </FormField>

        <Button
          title={t('discovery.name.confirm')}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting || addLockMutation.isPending}
        />
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
}));
