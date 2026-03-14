import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/common/components/EmptyState';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Loading } from '@/common/components/Loading';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { LockCard } from '@/features/locks/components/LockCard';
import { useLockToggle } from '@/features/locks/hooks/useLockControl';
import { useLocks } from '@/features/locks/hooks/useLocks';
import type { Lock } from '@/features/locks/types';

export default function HomeTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: locks, isLoading, refetch } = useLocks();
  const lockToggle = useLockToggle();
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePress = useCallback(
    (lock: Lock) => {
      router.push(`/lock/${lock.id}`);
    },
    [router]
  );

  const handleToggle = useCallback(
    async (lock: Lock) => {
      setTogglingId(lock.id);
      try {
        await lockToggle.mutateAsync({
          id: lock.id,
          action: lock.isLocked ? 'unlock' : 'lock',
        });
      } finally {
        setTogglingId(null);
      }
    },
    [lockToggle]
  );

  if (isLoading) return <Loading fullScreen />;

  return (
    <ScreenContainer padded>
      <View style={styles.header}>
        <View>
          <Text variant="h1">{t('locks.title')}</Text>
          <Text variant="bodySmall" color="tertiary">
            {t('locks.subtitle', { count: locks?.length ?? 0 })}
          </Text>
        </View>
        <IconButton
          icon="add-circle"
          variant="primary"
          size="lg"
          onPress={() => router.push('/add-lock/scan')}
          accessibilityLabel={t('locks.addLock')}
        />
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={locks ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LockCard
              lock={item}
              onPress={handlePress}
              onToggle={handleToggle}
              isToggling={togglingId === item.id}
            />
          )}
          ItemSeparatorComponent={ListSeparator}
          ListEmptyComponent={
            <EmptyState
              title={t('locks.empty.title')}
              message={t('locks.empty.message')}
              icon={<Icon name="lock-closed-outline" variant="muted" size={48} />}
              actionLabel={t('locks.addLock')}
              onAction={() => router.push('/add-lock/scan')}
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScreenContainer>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.metrics.spacingV.p16,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.metrics.spacingV.p16,
  },
  separator: {
    height: theme.metrics.spacingV.p12,
  },
}));
