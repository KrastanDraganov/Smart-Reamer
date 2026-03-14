import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Loading } from '@/common/components/Loading';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { LockControl } from '@/features/locks/components/LockControl';
import { LockStatusIndicator } from '@/features/locks/components/LockStatusIndicator';
import { useLock, useLockEvents } from '@/features/locks/hooks/useLock';
import {
  useLockToggle,
  useDeleteLock,
  useRenameLock,
} from '@/features/locks/hooks/useLockControl';
import type { LockEvent } from '@/features/locks/types';

export default function LockDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { data: lock, isLoading } = useLock(id);
  const { data: events } = useLockEvents(id);
  const toggleMutation = useLockToggle();
  const deleteMutation = useDeleteLock();
  const renameMutation = useRenameLock();

  const handleToggle = useCallback(() => {
    if (!lock) return;
    toggleMutation.mutate({
      id: lock.id,
      action: lock.isLocked ? 'unlock' : 'lock',
    });
  }, [lock, toggleMutation]);

  const handleDelete = useCallback(() => {
    if (!lock) return;
    Alert.alert(t('locks.delete.title'), t('locks.delete.message'), [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('actions.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync(lock.id);
          router.back();
        },
      },
    ]);
  }, [lock, deleteMutation, router, t]);

  const handleRename = useCallback(() => {
    if (!lock) return;
    Alert.prompt(
      t('locks.rename.title'),
      t('locks.rename.message'),
      [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.save'),
          onPress: (newName: string | undefined) => {
            if (newName && newName.trim().length > 0) {
              renameMutation.mutate({ id: lock.id, name: newName.trim() });
            }
          },
        },
      ],
      'plain-text',
      lock.name
    );
  }, [lock, renameMutation, t]);

  if (isLoading || !lock) return <Loading fullScreen />;

  return (
    <ScreenContainer scrollable padded edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <IconButton
          icon="arrow-back"
          variant="secondary"
          size="md"
          onPress={() => router.back()}
          accessibilityLabel={t('actions.back')}
        />
        <IconButton
          icon="trash-outline"
          variant="secondary"
          size="md"
          onPress={handleDelete}
          accessibilityLabel={t('actions.delete')}
        />
      </View>

      <Pressable onPress={handleRename} style={styles.nameSection}>
        <Text variant="h1" align="center">{lock.name}</Text>
        <Icon name="pencil-outline" variant="muted" size={16} />
      </Pressable>

      <View style={styles.controlSection}>
        <LockControl
          isLocked={lock.isLocked}
          isOnline={lock.isOnline}
          isToggling={toggleMutation.isPending}
          onToggle={handleToggle}
        />
      </View>

      <LockStatusIndicator
        isOnline={lock.isOnline}
        batteryLevel={lock.batteryLevel}
        isLocked={lock.isLocked}
      />

      <Divider />

      <View style={styles.historySection}>
        <Text variant="h3">{t('locks.history.title')}</Text>
        {events && events.length > 0 ? (
          events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))
        ) : (
          <Text variant="bodySmall" color="muted">
            {t('locks.history.empty')}
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}

function EventRow({ event }: { event: LockEvent }) {
  const { t } = useTranslation();
  const date = new Date(event.timestamp);
  const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateString = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.eventRow}>
      <Icon
        name={event.action === 'lock' ? 'lock-closed' : 'lock-open'}
        variant={event.action === 'lock' ? 'primary' : 'accent'}
        size={18}
      />
      <View style={styles.eventContent}>
        <Text variant="body">
          {event.action === 'lock' ? t('locks.history.locked') : t('locks.history.unlocked')}
        </Text>
        <Text variant="caption" color="muted">
          {t(`locks.history.source.${event.source}`)}
        </Text>
      </View>
      <View style={styles.eventTime}>
        <Text variant="caption" color="tertiary">{timeString}</Text>
        <Text variant="caption" color="muted">{dateString}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacingV.p8,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacing.p8,
    marginBottom: theme.metrics.spacingV.p8,
  },
  controlSection: {
    alignItems: 'center',
    paddingVertical: theme.metrics.spacingV.p24,
  },
  historySection: {
    gap: theme.metrics.spacingV.p12,
    paddingTop: theme.metrics.spacingV.p16,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p8,
  },
  eventContent: {
    flex: 1,
  },
  eventTime: {
    alignItems: 'flex-end',
  },
}));
