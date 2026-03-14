import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/common/components/Text';
import { styles } from './ErrorBoundary.styles';

// ErrorBoundary is a class component that cannot use hooks like useTranslation.
// These fallback strings are intentionally hardcoded as a last-resort crash screen.
// They will only show if something catastrophically breaks before i18n loads.
/** Hardcoded fallback strings shown when an unrecoverable render error occurs. */
const FALLBACK_TEXT = {
  icon: '!',
  title: 'Something went wrong',
  message: 'The app ran into an unexpected error.',
  retry: 'Try Again',
} as const;

/** Props for the {@link ErrorBoundary} component. */
interface Props {
  /** Child components to render when no error is present. */
  children: ReactNode;
  /** Custom fallback UI to display instead of the default error screen. */
  fallback?: ReactNode;
  /** Callback invoked when an error is caught, useful for external logging. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/** Internal state for the ErrorBoundary component. */
interface State {
  /** Whether an error has been caught. */
  hasError: boolean;
  /** The caught error instance, if any. */
  error: Error | null;
}

/**
 * Error boundary that catches render errors and displays a fallback UI.
 *
 * Note: Class component -- cannot use hooks such as useVariants.
 * Styles are extracted to a separate file but applied via style arrays.
 *
 * @example
 * ```tsx
 * <ErrorBoundary onError={(err) => logToService(err)}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container} accessibilityRole="alert">
          <Text variant="h1" style={styles.icon}>
            {FALLBACK_TEXT.icon}
          </Text>
          <Text variant="h3" align="center" style={styles.title}>
            {FALLBACK_TEXT.title}
          </Text>
          <Text variant="body" align="center" style={styles.message}>
            {FALLBACK_TEXT.message}
          </Text>
          {__DEV__ && this.state.error && (
            <Text variant="caption" align="center" style={styles.errorDetail}>
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            style={styles.button}
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel={FALLBACK_TEXT.retry}
          >
            <Text variant="body" weight="semibold" style={styles.buttonText}>
              {FALLBACK_TEXT.retry}
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
