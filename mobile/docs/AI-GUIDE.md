# AI Agent Guide

This guide is the master reference for AI coding agents working in this codebase. Read it completely before making any changes. Every pattern here is prescriptive - follow exactly as shown.

**Tech stack at a glance:** React Native 0.83.2, Expo SDK 55, expo-router, TypeScript 5.9 strict, react-native-unistyles 3.x, TanStack Query, Zustand, Supabase, Axios, react-i18next, react-native-mmkv, react-hook-form + Zod.

**Path aliases:** `@/*` = `src/*`, `~/*` = `app/*`

---

## Quick Start

### Creating a new screen

Screens live in `app/`. File name becomes the route.

```typescript
// app/(main)/(tabs)/products.tsx
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';

export default function ProductsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable>
      <Text variant="h1">{t('products.title')}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  // styles here
}));
```

### Creating a new feature

```
src/features/products/
├── components/          # ProductCard.tsx, ProductList.tsx
├── services/            # productService.ts
├── hooks/               # useProducts.ts, useCreateProduct.ts
├── stores/              # productStore.ts (if needed)
├── types/               # index.ts (Product, CreateProductData)
├── schemas/             # productSchema.ts
└── constants/           # index.ts
```

### Adding a translation key

Always update BOTH files at the same time:

```json
// src/i18n/locales/en.json
{
  "products": {
    "title": "Products",
    "empty": "No products found",
    "addNew": "Add Product"
  }
}

// src/i18n/locales/ar.json
{
  "products": {
    "title": "المنتجات",
    "empty": "لا توجد منتجات",
    "addNew": "إضافة منتج"
  }
}
```

---

## Pattern Cookbook

### Recipe 1: Feature with API data (list screen)

**Step 1 - Define types**

```typescript
// src/features/products/types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CreateProductData {
  name: string;
  price: number;
  category: string;
}
```

**Step 2 - Create the service**

```typescript
// src/features/products/services/productService.ts
import { api } from '@/services/api';
import type { Product, CreateProductData } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

export async function createProduct(payload: CreateProductData): Promise<Product> {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
```

**Step 3 - Create query hooks**

```typescript
// src/features/products/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, deleteProduct } from '../services/productService';
import type { CreateProductData } from '../types';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  list: () => [...PRODUCT_KEYS.all, 'list'] as const,
  detail: (id: string) => [...PRODUCT_KEYS.all, 'detail', id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(),
    queryFn: fetchProducts,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}
```

**Step 4 - Create the screen**

```typescript
// app/(main)/(tabs)/products.tsx
import { FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { EmptyState } from '@/common/components/EmptyState';
import { Loading } from '@/common/components/Loading';
import { Text } from '@/common/components/Text';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductCard } from '@/features/products/components/ProductCard';
import type { Product } from '@/features/products/types';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <Loading fullScreen />;
  if (error) return (
    <ScreenContainer>
      <Text variant="body" color={theme.colors.state.error}>{t('errors.generic')}</Text>
    </ScreenContainer>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <EmptyState title={t('products.empty')} />
        }
        contentContainerStyle={styles.list}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    gap: theme.metrics.spacingV.p16,
    paddingBottom: theme.metrics.spacingV.p32,
  },
}));
```

---

### Recipe 2: Form with validation

```typescript
// src/features/products/schemas/productSchema.ts
import { z } from 'zod/v4';

export const productSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  price: z.number().min(0, 'validation.priceMin'),
  category: z.string().min(1, 'validation.required'),
  description: z.string().max(500, 'validation.descriptionMax').optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
```

```typescript
// src/features/products/components/CreateProductForm.tsx
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/common/components/Button';
import { FormField } from '@/common/components/FormField';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { useCreateProduct } from '../hooks/useProducts';
import { productSchema, type ProductFormData } from '../schemas/productSchema';

export function CreateProductForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const createProduct = useCreateProduct();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: 0, category: '' },
  });

  const onSubmit = async (data: ProductFormData) => {
    await createProduct.mutateAsync(data);
    onSuccess();
  };

  return (
    <View style={styles.form}>
      <FormField name="name" control={control} label={t('fields.productName')} required>
        <Input />
      </FormField>
      <FormField name="category" control={control} label={t('fields.category')} required>
        <Select options={CATEGORY_OPTIONS} />
      </FormField>
      <Button
        title={t('actions.createProduct')}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting || createProduct.isPending}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  form: {
    gap: theme.metrics.spacingV.p16,
  },
}));
```

---

### Recipe 3: Zustand store for client state

```typescript
// src/features/cart/stores/cartStore.ts
import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        items: [...state.items, { productId: product.id, product, quantity }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
```

Usage in components:

```typescript
// Always use selectors - never destructure the whole store
const items = useCartStore((s) => s.items);
const addItem = useCartStore((s) => s.addItem);
const total = useCartStore((s) => s.totalPrice());
```

---

### Recipe 4: Protected route with auth check

```typescript
// src/hooks/useProtectedRoute.ts (already exists - do not recreate)
// Usage in a screen:
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function DashboardScreen() {
  useProtectedRoute(); // Redirects to /(auth)/login if not authenticated
  // ... rest of screen
}
```

To add a new auth screen:

```
app/(auth)/forgot-password.tsx
```

```typescript
// app/(auth)/forgot-password.tsx
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <Text variant="h2">{t('auth.forgotPassword')}</Text>
    </ScreenContainer>
  );
}
```

---

### Recipe 5: MMKV persistent storage

```typescript
import { useStorage, useStorageBoolean } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

// String value
function LanguageSelector() {
  const { value: language, setValue: setLanguage } = useStorage<string>(
    STORAGE_KEYS.preferences.language,
    { defaultValue: 'en' }
  );

  return (
    <Select
      value={language ?? 'en'}
      onChange={setLanguage}
      options={[
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
      ]}
    />
  );
}

// Boolean toggle
function NotificationsToggle() {
  const { value: enabled, toggle } = useStorageBoolean(
    STORAGE_KEYS.preferences.notificationsEnabled,
    { defaultValue: true }
  );

  return <Switch value={enabled ?? true} onValueChange={toggle} />;
}
```

---

### Recipe 6: Custom hook with query + local state

```typescript
// src/features/search/hooks/useProductSearch.ts
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Product } from '../types';

export function useProductSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const updateQuery = useCallback((text: string) => {
    setQuery(text);
    // In a real app, use a debounce utility here
    setDebouncedQuery(text);
  }, []);

  const clearQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const { data: results, isLoading } = useQuery({
    queryKey: ['products', 'search', debouncedQuery],
    queryFn: () =>
      api.get<Product[]>('/products/search', { params: { q: debouncedQuery } }).then((r) => r.data),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    query,
    results: results ?? [],
    isLoading,
    updateQuery,
    clearQuery,
  };
}
```

---

### Recipe 7: Dialog confirmation pattern

```typescript
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/common/components/Dialog';
import { Button } from '@/common/components/Button';
import { useDeleteProduct } from '@/features/products/hooks/useProducts';

export function DeleteProductButton({ productId }: { productId: string }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const deleteProduct = useDeleteProduct();

  const handleConfirm = async () => {
    await deleteProduct.mutateAsync(productId);
    setVisible(false);
  };

  return (
    <>
      <Button
        title={t('actions.delete')}
        variant="outline"
        onPress={() => setVisible(true)}
      />
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        title={t('dialogs.deleteProductTitle')}
        message={t('dialogs.deleteProductMessage')}
        actions={[
          { label: t('actions.cancel'), onPress: () => setVisible(false), variant: 'ghost' },
          { label: t('actions.delete'), onPress: handleConfirm, variant: 'primary' },
        ]}
      />
    </>
  );
}
```

---

### Recipe 8: Loading and empty state handling

```typescript
import { FlatList, View } from 'react-native';
import { Loading } from '@/common/components/Loading';
import { EmptyState } from '@/common/components/EmptyState';
import { Skeleton } from '@/common/components/Skeleton';
import { ErrorBoundary } from '@/common/components/ErrorBoundary';
import { useProducts } from '@/features/products/hooks/useProducts';

function ProductListContent() {
  const { t } = useTranslation();
  const { data: products, isLoading, error, refetch } = useProducts();

  // Skeleton loading
  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.skeletonItem}>
            <Skeleton variant="rect" height={120} />
            <Skeleton variant="text" width="70%" height={16} />
            <Skeleton variant="text" width="40%" height={14} />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <EmptyState
        title={t('errors.generic')}
        message={error.message}
        actionLabel={t('actions.retry')}
        onAction={refetch}
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListEmptyComponent={<EmptyState title={t('products.empty')} />}
    />
  );
}

export function ProductListScreen() {
  return (
    <ScreenContainer>
      <ErrorBoundary>
        <ProductListContent />
      </ErrorBoundary>
    </ScreenContainer>
  );
}
```

---

### Recipe 9: Snackbar notifications

```typescript
import { useState } from 'react';
import { Snackbar } from '@/common/components/Snackbar';
import { Button } from '@/common/components/Button';
import { useCreateProduct } from '@/features/products/hooks/useProducts';

export function SaveProductButton({ data }: { data: ProductFormData }) {
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; variant: 'success' | 'error' }>({
    visible: false,
    message: '',
    variant: 'success',
  });
  const createProduct = useCreateProduct();

  const handleSave = async () => {
    try {
      await createProduct.mutateAsync(data);
      setSnackbar({ visible: true, message: t('products.saved'), variant: 'success' });
    } catch (error) {
      setSnackbar({ visible: true, message: t('errors.generic'), variant: 'error' });
    }
  };

  return (
    <>
      <Button title={t('actions.save')} onPress={handleSave} loading={createProduct.isPending} />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
      />
    </>
  );
}
```

---

### Recipe 10: Adding a new tab

1. Create the screen file:

```typescript
// app/(main)/(tabs)/explore.tsx
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';

export default function ExploreTab() {
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <Text variant="h1">{t('explore.title')}</Text>
    </ScreenContainer>
  );
}
```

2. Register the tab in the layout:

```typescript
// app/(main)/(tabs)/_layout.tsx
<Tabs.Screen
  name="explore"
  options={{
    title: t('tabs.explore'),
    tabBarIcon: ({ color, size }) => (
      <Icon name="compass-outline" color={color} size={size} />
    ),
  }}
/>
```

---

## File Templates

### New Shared Component

```typescript
// src/common/components/MyComponent/MyComponent.types.ts
import type { ViewProps } from 'react-native';
import type { ComponentSize } from '../shared.types';
import type { MyComponentStyleVariants } from './MyComponent.styles';

export interface MyComponentProps extends ViewProps, MyComponentStyleVariants {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  size?: ComponentSize;
  disabled?: boolean;
}
```

```typescript
// src/common/components/MyComponent/MyComponent.styles.ts
import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    variants: {
      size: {
        sm: { padding: theme.metrics.spacing.p8 },
        md: { padding: theme.metrics.spacing.p12 },
        lg: { padding: theme.metrics.spacing.p16 },
      },
      disabled: {
        true: { opacity: 0.5 },
      },
    },
  },
  title: {
    variants: {
      size: {
        sm: { fontSize: theme.fonts.size.sm },
        md: { fontSize: theme.fonts.size.md },
        lg: { fontSize: theme.fonts.size.lg },
      },
    },
  },
}));

export type MyComponentStyleVariants = UnistylesVariants<typeof styles>;
```

```typescript
// src/common/components/MyComponent/MyComponent.tsx
import { View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '@/common/components/Text';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { styles } from './MyComponent.styles';
import type { MyComponentProps } from './MyComponent.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MyComponent({
  title,
  subtitle,
  onPress,
  size = 'md',
  disabled = false,
  style,
  ...rest
}: MyComponentProps) {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  styles.useVariants({ size, disabled });

  if (onPress) {
    return (
      <AnimatedPressable
        style={[styles.container, animatedStyle, style]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityRole="button"
        {...rest}
      >
        <Text variant="h3" style={styles.title}>{title}</Text>
        {subtitle && <Text variant="bodySmall" color="secondary">{subtitle}</Text>}
      </AnimatedPressable>
    );
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      <Text variant="h3" style={styles.title}>{title}</Text>
      {subtitle && <Text variant="bodySmall" color="secondary">{subtitle}</Text>}
    </View>
  );
}
```

```typescript
// src/common/components/MyComponent/index.ts
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent.types';
```

---

### New Screen

```typescript
// app/(main)/my-screen.tsx
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { ErrorBoundary } from '@/common/components/ErrorBoundary';

export default function MyScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable padded>
      <ErrorBoundary>
        <Text variant="h1">{t('myScreen.title')}</Text>
      </ErrorBoundary>
    </ScreenContainer>
  );
}
```

---

### New Custom Hook

```typescript
// src/features/myFeature/hooks/useMyFeature.ts
import { useState, useCallback } from 'react';

export interface UseMyFeatureReturn {
  value: string;
  setValue: (v: string) => void;
  reset: () => void;
}

export function useMyFeature(initialValue = ''): UseMyFeatureReturn {
  const [value, setValueState] = useState(initialValue);

  const setValue = useCallback((v: string) => {
    setValueState(v);
  }, []);

  const reset = useCallback(() => {
    setValueState(initialValue);
  }, [initialValue]);

  return { value, setValue, reset };
}
```

---

### New Zustand Store

```typescript
// src/features/myFeature/stores/myFeatureStore.ts
import { create } from 'zustand';
import type { MyItem } from '../types';

interface MyFeatureState {
  items: MyItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: MyItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (item: MyItem) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  ...initialState,

  setItems: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  reset: () => set(initialState),
}));
```

---

### New API Service

```typescript
// src/features/myFeature/services/myFeatureService.ts
import { api } from '@/services/api';
import type { MyItem, CreateMyItemData, UpdateMyItemData } from '../types';

export async function fetchMyItems(): Promise<MyItem[]> {
  const { data } = await api.get<MyItem[]>('/my-items');
  return data;
}

export async function fetchMyItem(id: string): Promise<MyItem> {
  const { data } = await api.get<MyItem>(`/my-items/${id}`);
  return data;
}

export async function createMyItem(payload: CreateMyItemData): Promise<MyItem> {
  const { data } = await api.post<MyItem>('/my-items', payload);
  return data;
}

export async function updateMyItem(id: string, payload: UpdateMyItemData): Promise<MyItem> {
  const { data } = await api.patch<MyItem>(`/my-items/${id}`, payload);
  return data;
}

export async function deleteMyItem(id: string): Promise<void> {
  await api.delete(`/my-items/${id}`);
}
```

---

### New Zod Schema

```typescript
// src/features/myFeature/schemas/myItemSchema.ts
import { z } from 'zod/v4';

export const createMyItemSchema = z.object({
  name: z.string().min(1, 'validation.required').max(100, 'validation.nameTooLong'),
  email: z.email('validation.emailInvalid'),
  age: z.number({ message: 'validation.required' }).min(18, 'validation.ageMin'),
  role: z.enum(['admin', 'user', 'viewer']),
  tags: z.array(z.string()).min(1, 'validation.tagsRequired').optional(),
  bio: z.string().max(500, 'validation.bioMax').optional(),
});

export const updateMyItemSchema = createMyItemSchema.partial();

export type CreateMyItemData = z.infer<typeof createMyItemSchema>;
export type UpdateMyItemData = z.infer<typeof updateMyItemSchema>;
```

---

## Anti-Patterns

### 1. Inline styles

```typescript
// WRONG - never do this
<View style={{ padding: 16, backgroundColor: '#FFFFFF' }}>

// CORRECT
const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.metrics.spacing.p16,
    backgroundColor: theme.colors.background.surface,
  },
}));
<View style={styles.container}>
```

**Why:** Inline styles bypass the theme system, break dark mode, and break RTL.

---

### 2. Color literals

```typescript
// WRONG
<Text style={{ color: '#6366F1' }}>Hello</Text>
<View style={{ backgroundColor: 'white' }}>

// CORRECT
const styles = StyleSheet.create((theme) => ({
  text: { color: theme.colors.brand.primary },
  container: { backgroundColor: theme.colors.background.surface },
}));
```

**Why:** Color literals break dark mode and make theme changes require grep-and-replace instead of a single config change.

---

### 3. Hardcoded UI strings

```typescript
// WRONG
<Text>Welcome back!</Text>
<Button title="Sign In" onPress={handleLogin} />

// CORRECT
const { t } = useTranslation();
<Text>{t('home.welcome')}</Text>
<Button title={t('auth.login')} onPress={handleLogin} />
```

**Why:** The app supports English and Arabic. Any hardcoded string will not be translated.

---

### 4. `any` types

```typescript
// WRONG
const data: any = response.data;
function processItem(item: any) {}

// CORRECT
const data: Product[] = response.data;
function processItem(item: Product) {}
// Or if truly unknown:
const data: unknown = response.data;
if (isProduct(data)) {
  /* use data */
}
```

**Why:** TypeScript strict mode is enabled. `any` defeats the entire purpose of TypeScript.

---

### 5. React Context for auth

```typescript
// WRONG - do not create auth context
const AuthContext = createContext<AuthState | null>(null);
export function AuthProvider({ children }) { ... }

// CORRECT - use the existing Zustand store
import { useAuthStore } from '@/providers/auth/authStore';
const user = useAuthStore((s) => s.user);
```

**Why:** Auth state is managed by `useAuthStore`. The store is already initialized in the root layout via `useAuthInit()`. Creating a parallel context creates inconsistency and potential infinite loops.

---

### 6. Subscribing to the entire Zustand store

```typescript
// WRONG - re-renders on every state change
const { items, addItem, removeItem } = useMyStore();

// CORRECT - only re-renders when items changes
const items = useMyStore((s) => s.items);
const addItem = useMyStore((s) => s.addItem);
```

---

### 7. Default exports from component files

```typescript
// WRONG
export default function Button() { ... }

// CORRECT - named export in src/
export function Button() { ... }

// Exception: Expo Router screen files in app/ MUST use default exports
// app/(main)/(tabs)/products.tsx
export default function ProductsScreen() { ... }
```

---

### 8. Relative imports climbing multiple levels

```typescript
// WRONG
import { Button } from '../../../common/components/Button';
import { useAuthStore } from '../../providers/auth/authStore';

// CORRECT
import { Button } from '@/common/components/Button';
import { useAuthStore } from '@/providers/auth/authStore';
```

---

### 9. Skipping barrel files

```typescript
// WRONG - importing from implementation file
import { Button } from '@/common/components/Button/Button';
import type { ButtonProps } from '@/common/components/Button/Button.types';

// CORRECT - importing from barrel
import { Button, type ButtonProps } from '@/common/components/Button';
```

---

### 10. Putting API calls directly in components

```typescript
// WRONG
export function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts);
  }, []);
}

// CORRECT - use service + React Query hook
export function ProductList() {
  const { data: products } = useProducts(); // from src/features/products/hooks/useProducts.ts
}
```

---

### 11. Creating custom navigation state management

```typescript
// WRONG
const [currentScreen, setCurrentScreen] = useState('home');

// CORRECT - use expo-router
import { router } from 'expo-router';
router.push('/products');
router.replace('/(auth)/login');
```

---

### 12. Updating only one translation file

```typescript
// WRONG - only updating en.json
// en.json: { "products": { "new": "New Product" } }
// ar.json: (not updated)

// CORRECT - always update both files simultaneously
// en.json: { "products": { "new": "New Product" } }
// ar.json: { "products": { "new": "منتج جديد" } }
```

---

## Theme Token Quick Reference

```
COLORS
  Brand:       theme.colors.brand.primary         (#6366F1 indigo)
               theme.colors.brand.secondary       (#1E293B dark slate)
               theme.colors.brand.tertiary        (#14B8A6 teal)
               theme.colors.brand.primaryVariant  (#4F46E5 darker indigo)

  Background:  theme.colors.background.app        (page background)
               theme.colors.background.surface    (cards, sheets)
               theme.colors.background.surfaceAlt (alternate surface)
               theme.colors.background.elevated   (elevated elements)
               theme.colors.background.input      (input fields)
               theme.colors.background.modal      (modal background)
               theme.colors.background.disabled   (disabled elements)

  Text:        theme.colors.text.primary          (headings, body)
               theme.colors.text.secondary        (supporting text)
               theme.colors.text.tertiary         (metadata)
               theme.colors.text.muted            (placeholder, hints)
               theme.colors.text.inverse          (text on dark/primary)
               theme.colors.text.accent           (teal accent text)
               theme.colors.text.link             (links)

  Border:      theme.colors.border.default        (standard borders)
               theme.colors.border.subtle         (very light borders)
               theme.colors.border.strong         (prominent borders)
               theme.colors.border.focus          (input focus ring)
               theme.colors.border.disabled       (disabled borders)

  Icon:        theme.colors.icon.primary          (primary icons)
               theme.colors.icon.secondary        (secondary icons)
               theme.colors.icon.muted            (subtle icons)
               theme.colors.icon.accent           (teal accent icons)
               theme.colors.icon.inverse          (icons on dark bg)

  State:       theme.colors.state.success         (#10B981)
               theme.colors.state.successBg       (#ECFDF5)
               theme.colors.state.error           (#EF4444)
               theme.colors.state.errorBg         (rgba red)
               theme.colors.state.warning         (#F59E0B)
               theme.colors.state.warningBg       (rgba amber)
               theme.colors.state.info            (#3B82F6)
               theme.colors.state.infoBg          (rgba blue)

  Overlay:     theme.colors.overlay.modal         (rgba black 0.5)
               theme.colors.overlay.pressed       (rgba indigo 0.12)
               theme.colors.overlay.ripple        (rgba white 0.25)

  Mode:        theme.colors.mode                  ('light' | 'dark')

SPACING (horizontal)
  theme.metrics.spacing.p4   = hs(4)
  theme.metrics.spacing.p8   = hs(8)
  theme.metrics.spacing.p12  = hs(12)
  theme.metrics.spacing.p16  = hs(16)
  theme.metrics.spacing.p20  = hs(20)
  theme.metrics.spacing.p24  = hs(24)
  theme.metrics.spacing.p32  = hs(32)
  theme.metrics.spacing.p48  = hs(48)
  theme.metrics.spacing.p64  = hs(64)

SPACING (vertical)
  theme.metrics.spacingV.p4  = vs(4)  ... same keys as spacing

FONT SIZES (responsive)
  theme.fonts.size.xxs = rf(10)
  theme.fonts.size.xs  = rf(12)
  theme.fonts.size.sm  = rf(14)
  theme.fonts.size.md  = rf(16)
  theme.fonts.size.lg  = rf(18)
  theme.fonts.size.xl  = rf(20)
  theme.fonts.size.2xl = rf(24)
  theme.fonts.size.3xl = rf(30)
  theme.fonts.size.4xl = rf(36)

BORDER RADIUS
  theme.metrics.borderRadius.xs   = hs(4)
  theme.metrics.borderRadius.sm   = hs(6)
  theme.metrics.borderRadius.md   = hs(8)
  theme.metrics.borderRadius.lg   = hs(12)
  theme.metrics.borderRadius.xl   = hs(16)
  theme.metrics.borderRadius.full = 999

ICON SIZES
  theme.metrics.iconSize.xs = hs(14)
  theme.metrics.iconSize.sm = hs(16)
  theme.metrics.iconSize.md = hs(18)  <- default
  theme.metrics.iconSize.lg = hs(20)
  theme.metrics.iconSize.xl = hs(24)
```

---

## Common Mistakes AI Agents Make in This Codebase

1. **Using `import { StyleSheet } from 'react-native'`** instead of `import { StyleSheet } from 'react-native-unistyles'`. The unistyles version receives a theme callback.

2. **Writing `StyleSheet.create({ ... })` without the theme callback.** The correct form is `StyleSheet.create((theme) => ({ ... }))`.

3. **Importing `Text` from `'react-native'`** instead of `'@/common/components/Text'`. Always use the project's Text component for user-facing strings.

4. **Using `useAuthStore()` without a selector.** You MUST pass a selector function: `useAuthStore((s) => s.user)`.

5. **Forgetting to add i18n keys to both `en.json` and `ar.json`** when adding new UI text.

6. **Creating screens without `export default`.** Expo Router requires default exports for all files in `app/`.

7. **Importing from `zod` instead of `zod/v4`.** This project uses `import { z } from 'zod/v4'`.

8. **Putting business logic in components** instead of in `services/` and `hooks/`. Components should only render and call hooks.

9. **Using numeric spacing literals** like `padding: 16` instead of `theme.metrics.spacing.p16`.

10. **Skipping `accessibilityRole` and `accessibilityLabel`** on interactive elements. All buttons, links, and inputs need these.

11. **Using `console.log` in production code.** Use `if (__DEV__) { console.log(...) }` or remove entirely.

12. **Calling `useAuthStore.getState()` inside React components.** Use `useAuthStore((s) => s.fieldName)` in components. `getState()` is only for non-React code like Axios interceptors.
