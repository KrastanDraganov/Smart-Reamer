import Toast from 'react-native-toast-message';

interface ToastOptions {
  title?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

export const toast = {
  success(message: string, options?: ToastOptions) {
    Toast.show({
      type: 'success',
      text1: options?.title,
      text2: message,
      visibilityTime: options?.duration ?? 3000,
      position: options?.position ?? 'top',
    });
  },

  error(message: string, options?: ToastOptions) {
    Toast.show({
      type: 'error',
      text1: options?.title,
      text2: message,
      visibilityTime: options?.duration ?? 4000,
      position: options?.position ?? 'top',
    });
  },

  info(message: string, options?: ToastOptions) {
    Toast.show({
      type: 'info',
      text1: options?.title,
      text2: message,
      visibilityTime: options?.duration ?? 3000,
      position: options?.position ?? 'top',
    });
  },

  warning(message: string, options?: ToastOptions) {
    Toast.show({
      type: 'error',
      text1: options?.title ?? '⚠',
      text2: message,
      visibilityTime: options?.duration ?? 4000,
      position: options?.position ?? 'top',
    });
  },

  hide() {
    Toast.hide();
  },
};
