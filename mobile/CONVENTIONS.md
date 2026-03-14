# Coding Conventions

This is the single source of truth for all coding conventions in this project. Every AI agent, contributor, and tool MUST follow these rules exactly. When in doubt, look at an existing file and match its patterns.

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [File Organization and Imports](#file-organization-and-imports)
3. [Component Architecture](#component-architecture)
4. [Styling Rules](#styling-rules)
5. [State Management](#state-management)
6. [API and Data Fetching](#api-and-data-fetching)
7. [Forms and Validation](#forms-and-validation)
8. [i18n Requirements](#i18n-requirements)
9. [Error Handling](#error-handling)
10. [Testing](#testing)
11. [Git Workflow](#git-workflow)

---

## Naming Conventions

### Files and Directories

| Item                | Convention                     | Example                         |
| ------------------- | ------------------------------ | ------------------------------- |
| Component directory | PascalCase                     | `src/common/components/Button/` |
| Component file      | PascalCase.tsx                 | `Button.tsx`                    |
| Component styles    | PascalCase.styles.ts           | `Button.styles.ts`              |
| Component types     | PascalCase.types.ts            | `Button.types.ts`               |
| Component barrel    | lowercase                      | `index.ts`                      |
| Hook file           | camelCase, starts with `use`   | `useBottomPadding.ts`           |
| Store file          | camelCase, ends with `Store`   | `authStore.ts`                  |
| Service file        | camelCase, ends with `Service` | `authService.ts`                |
| Schema file         | camelCase, ends with `Schema`  | `loginSchema.ts`                |
| Screen file (app/)  | lowercase with hyphens         | `forgot-password.tsx`           |
| Layout file (app/)  | underscore prefix              | `_layout.tsx`                   |
| Constants file      | camelCase                      | `constants.ts`                  |
| i18n locale files   | lowercase                      | `en.json`, `ar.json`            |

### Components

- Component names are always PascalCase: `Button`, `UserProfileCard`, `SearchBar`
- Component props interfaces are named `{ComponentName}Props`: `ButtonProps`, `CardProps`
- Named exports for components, never default exports from component files
  - Exception: Expo Router screen files in `app/` MUST use default exports

```typescript
// CORRECT - named export in src/common/components/
export function Button({ ... }: ButtonProps) { ... }

// CORRECT - default export in app/ screen files
export default function HomeScreen() { ... }

// WRONG - default export from component
export default function Button() { ... }
```

### Hooks

- Always starts with `use`: `useAuthStore`, `useNetworkStatus`, `useBottomPadding`
- Hook files named to match the exported hook: `useNetworkStatus.ts`
- Return objects (not arrays) unless it is a classic two-element state tuple

```typescript
// CORRECT
export function useScreenDimensions() {
  return { width, height, isLandscape };
}

// WRONG - returning unnamed array from custom hook
export function useScreenDimensions() {
  return [width, height];
}
```

### Stores

- Zustand stores exported as hooks: `useAuthStore`, `useMyFeatureStore`
- State interface named `{Feature}State`: `AuthState`, `MyFeatureState`
- File named `{feature}Store.ts`: `authStore.ts`

### TypeScript Types and Interfaces

- Interfaces for object shapes: `interface ButtonProps`
- Type aliases for unions, primitives, and mapped types: `type ButtonVariant = 'primary' | 'secondary'`
- All type-only imports use `import type`: `import type { ButtonProps } from './Button.types'`
- No `any` types. Use `unknown` and narrow, or define a proper type.

### Constants

- SCREAMING_SNAKE_CASE for true constants: `STORAGE_KEYS`, `AVATAR_SIZES`
- camelCase for config objects: `breakpoints`, `spacing`

---

## File Organization and Imports

### Path Aliases

Always use path aliases. Never use relative paths that climb more than one level.

```typescript
// CORRECT
import { Button } from '@/common/components/Button';
import { useAuthStore } from '@/providers/auth/authStore';
import { apiClient } from '@/services/api';

// WRONG - climbing relative paths
import { Button } from '../../../common/components/Button';
```

| Alias | Resolves To |
| ----- | ----------- |
| `@/*` | `src/*`     |
| `~/*` | `app/*`     |

### Import Order

Imports are grouped in this order with a blank line between each group:

1. React and React Native core
2. Expo and third-party libraries
3. Internal `@/` path alias imports (types last)
4. Relative imports within the same feature/directory (types last)

```typescript
import { useState } from 'react';
import { View, Pressable } from 'react-native';

import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/common/components/Button';
import { useAuthStore } from '@/providers/auth/authStore';
import type { MyProps } from '@/types';

import { localHelper } from './helpers';
import type { LocalType } from './types';
```

### Barrel Files

Every component directory has an `index.ts` that re-exports the public API:

```typescript
// src/common/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
```

Import from the barrel, not the implementation file:

```typescript
// CORRECT
import { Button } from '@/common/components/Button';

// WRONG
import { Button } from '@/common/components/Button/Button';
```

---

## Component Architecture

### Directory Structure

```
ComponentName/
├── ComponentName.tsx          # Required: component implementation
├── ComponentName.types.ts     # Optional: props and related types
├── ComponentName.styles.ts    # Optional: if styles are substantial
└── index.ts                   # Required: barrel export
```

### Component Template

```typescript
// src/common/components/MyComponent/MyComponent.tsx
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/common/components/Text';
import type { MyComponentProps } from './MyComponent.types';

export function MyComponent({ title, children, style }: MyComponentProps) {
  return (
    <View style={[styles.container, style]}>
      <Text variant="h3">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.metrics.spacing.p16,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.md,
  },
}));
```

### Feature Module Structure

```
src/features/<feature>/
├── components/        # Feature-specific UI components
├── services/          # API calls (no React, pure async functions)
├── hooks/             # Custom hooks for this feature
├── stores/            # Zustand stores
├── types/             # TypeScript types and interfaces
├── schemas/           # Zod validation schemas
└── constants/         # Feature-level constants
```

### Accessibility

- All interactive elements must have `accessibilityRole`
- All interactive elements must have `accessibilityLabel`
- Use `accessibilityState` for disabled, busy, selected states

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel={t('actions.submit')}
  accessibilityState={{ disabled, busy: loading }}
>
```

---

## Styling Rules

### The Three Laws

1. **Never use inline styles.** All styles go in `StyleSheet.create`.
2. **Never use color literals.** All colors come from `theme.colors.*`.
3. **Never hardcode numeric spacing.** Use `theme.metrics.spacing.*` or the helper functions.

### StyleSheet Pattern (with Variants)

All component styles MUST be in a separate `.styles.ts` file. Use the unistyles `variants` API for any style that changes based on props:

```typescript
// Component.styles.ts
import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: theme.metrics.borderRadius.lg,
    // Variants define style variations declaratively
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.brand.primary },
        secondary: { backgroundColor: theme.colors.background.surfaceAlt },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
      },
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
}));

export type MyComponentStyleVariants = UnistylesVariants<typeof styles>;
```

```typescript
// Component.tsx - call useVariants once, then use styles directly
styles.useVariants({ variant, size, disabled });
return <View style={styles.container} />;
```

**Key rules:**

- Call `styles.useVariants(...)` once per render, before accessing any style
- Use `compoundVariants` for styles that depend on multiple variant combinations
- Use boolean variants (`true`/`false` keys) for toggleable states like `disabled`, `focused`, `error`
- Use `miniRuntime` (second arg) for safe area insets and screen dimensions:
  ```typescript
  const styles = StyleSheet.create((theme, rt) => ({
    container: { paddingTop: rt.insets.top },
  }));
  ```
- Use breakpoint-responsive values for tablet adaptation:
  ```typescript
  padding: { xs: theme.metrics.spacing.p12, md: theme.metrics.spacing.p24 }
  ```

### Responsive Helpers

Import from `@/theme/metrics`:

```typescript
import { rf, hs, vs } from '@/theme/metrics';

// rf(n)  - responsive font size (scales with screen width)
// hs(n)  - horizontal scale (scales with screen width)
// vs(n)  - vertical scale (scales with screen height)
```

Use these helpers in `StyleSheet.create` callbacks for dynamic values not available from theme tokens:

```typescript
const styles = StyleSheet.create((theme) => ({
  customElement: {
    width: hs(120),
    height: vs(48),
    fontSize: rf(14),
  },
}));
```

### Theme Token Categories

```
theme.colors.brand.*       - primary, secondary, tertiary, primaryVariant, secondaryVariant
theme.colors.background.*  - app, surface, surfaceAlt, section, elevated, input, disabled, modal
theme.colors.text.*        - primary, secondary, tertiary, muted, inverse, accent, link, linkHover
theme.colors.border.*      - default, subtle, strong, focus, disabled
theme.colors.icon.*        - primary, secondary, tertiary, muted, inverse, accent
theme.colors.state.*       - success, successBg, warning, warningBg, error, errorBg, info, infoBg
theme.colors.overlay.*     - modal, pressed, hover, focus, ripple, shadow
theme.colors.gradient.*    - primary[], secondary[], accent[], success[], highlight[]
theme.colors.shadow.*      - color, elevation, elevationSmall, elevationMedium, elevationLarge
theme.colors.mode          - 'light' | 'dark'

theme.metrics.spacing.*    - p4 through p120 (horizontal via hs())
theme.metrics.spacingV.*   - p4 through p120 (vertical via vs())
theme.metrics.fontSize.*   - xxs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
theme.metrics.borderRadius.* - xs(4), sm(6), md(8), lg(12), xl(16), full(999)
theme.metrics.iconSize.*   - xs(14), sm(16), md(18), lg(20), xl(24)

theme.fonts.size.*         - xxs through 6xl (responsive via rf())
```

---

## State Management

### Two-Layer State Architecture

- **Server/async state**: `@tanstack/react-query` - data from APIs, loading states, caching
- **Client/UI state**: Zustand - user preferences, auth session, UI toggles

### Zustand Store Pattern

```typescript
// src/features/myFeature/stores/myFeatureStore.ts
import { create } from 'zustand';
import type { MyItem } from '../types';

interface MyFeatureState {
  // State shape
  items: MyItem[];
  selectedId: string | null;
  // Actions
  setItems: (items: MyItem[]) => void;
  selectItem: (id: string | null) => void;
  addItem: (item: MyItem) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  selectedId: null,
};

export const useMyFeatureStore = create<MyFeatureState>((set) => ({
  ...initialState,

  setItems: (items) => set({ items }),
  selectItem: (id) => set({ selectedId: id }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  reset: () => set(initialState),
}));
```

### Zustand Selector Pattern

Always use selectors - never subscribe to the whole store:

```typescript
// CORRECT - subscribes only to what is needed
const items = useMyFeatureStore((s) => s.items);
const addItem = useMyFeatureStore((s) => s.addItem);

// WRONG - subscribes to all state, causes unnecessary re-renders
const store = useMyFeatureStore();
```

### Auth Store

Auth is managed exclusively by `useAuthStore` in `src/providers/auth/authStore.ts`. Never create a React context for auth. Never manage session state locally in a component.

```typescript
import { useAuthStore } from '@/providers/auth/authStore';

// Reading auth state
const user = useAuthStore((s) => s.user);
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
const isLoading = useAuthStore((s) => s.isLoading);

// From outside React (e.g., in Axios interceptors)
const session = useAuthStore.getState().session;
```

---

## API and Data Fetching

### API Client

All HTTP requests go through `src/services/api/client.ts`. Import the `api` instance:

```typescript
import { api } from '@/services/api';
```

The client automatically attaches the Bearer token from `useAuthStore` and handles 401 responses by calling `clearSession()`.

### React Query Hooks

Place all query/mutation hooks in `src/features/<feature>/hooks/`:

```typescript
// src/features/products/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Product, CreateProductData } from '../types';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  list: (filters?: object) => [...PRODUCT_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...PRODUCT_KEYS.all, 'detail', id] as const,
};

export function useProducts(filters?: object) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => api.get<Product[]>('/products', { params: filters }).then((r) => r.data),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => api.get<Product>(`/products/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductData) =>
      api.post<Product>('/products', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}
```

### Query Key Convention

Use factory functions for query keys, not inline arrays. This enables precise cache invalidation.

---

## Forms and Validation

### Schema-First Approach

Define Zod schemas before writing form components:

```typescript
// src/features/myFeature/schemas/myFormSchema.ts
import { z } from 'zod/v4';

export const myFormSchema = z.object({
  name: z.string().min(1, 'validation.required'),
  email: z.email('validation.emailInvalid'),
  age: z.number().min(0, 'validation.ageMin').max(120, 'validation.ageMax'),
  bio: z.string().max(500, 'validation.bioMax').optional(),
});

export type MyFormData = z.infer<typeof myFormSchema>;
```

Validation message strings are i18n keys, not raw text.

### Form Component Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/common/components/FormField';
import { Input } from '@/common/components/Input';
import { Button } from '@/common/components/Button';
import { myFormSchema, type MyFormData } from '../schemas/myFormSchema';

export function MyForm() {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<MyFormData>({
    resolver: zodResolver(myFormSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (data: MyFormData) => {
    // handle submission
  };

  return (
    <>
      <FormField name="email" control={control} label={t('fields.email')} required>
        <Input keyboardType="email-address" autoCapitalize="none" />
      </FormField>
      <Button
        title={t('actions.submit')}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </>
  );
}
```

---

## i18n Requirements

### Every User-Facing String Must Be Translated

No hardcoded strings in JSX or component logic. This is a hard rule.

```typescript
// CORRECT
const { t } = useTranslation();
<Text>{t('home.welcome')}</Text>

// WRONG
<Text>Welcome to the app!</Text>
```

### Translation Files

Both files must be updated together:

- `src/i18n/locales/en.json` - English (primary)
- `src/i18n/locales/ar.json` - Arabic (RTL)

Keys use dot notation and semantic naming:

```json
{
  "home": {
    "welcome": "Welcome",
    "subtitle": "Get started below"
  },
  "auth": {
    "login": "Sign In",
    "logout": "Sign Out",
    "email": "Email address",
    "password": "Password"
  },
  "actions": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete"
  },
  "validation": {
    "required": "This field is required",
    "emailInvalid": "Enter a valid email address",
    "passwordMin": "Password must be at least 8 characters"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "network": "Network error. Check your connection."
  }
}
```

### RTL Support

RTL is handled at the app level in `app/_layout.tsx`. Do not manually flip layouts. Use `flexDirection` values normally - the RTL mirroring is applied globally.

---

## Error Handling

### Component-Level Errors

Use `ErrorBoundary` from `src/common/components/ErrorBoundary` to wrap sections that might throw:

```typescript
import { ErrorBoundary } from '@/common/components/ErrorBoundary';

<ErrorBoundary>
  <MyRiskyComponent />
</ErrorBoundary>
```

### Async Error Handling

Use try/catch in service functions and mutation handlers:

```typescript
// In a service function - throw the error, let the caller handle it
export async function fetchUser(id: string): Promise<User> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// In a mutation handler - handle errors where they affect UX
const mutation = useMutation({
  mutationFn: createUser,
  onError: (error: Error) => {
    // Show user-facing error via toast or state
    console.error('[createUser]', error.message);
  },
});
```

### API Errors

The Axios client in `src/services/api/client.ts` normalizes all API errors to `Error` with a human-readable message. Catch `Error` not `AxiosError` in calling code.

### Storage Operations

The storage utilities return a result object. Always check `.success`:

```typescript
const result = getItem<string>(STORAGE_KEYS.preferences.language);
if (result.success && result.data) {
  // use result.data
} else {
  // handle error or null
}
```

---

## Testing

### Test File Location

Tests live next to the files they test:

```
Button/
├── Button.tsx
├── Button.test.tsx    # Unit test
└── index.ts
```

Integration tests for features live in `src/features/<feature>/__tests__/`.

### Test Patterns

```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Submit" onPress={jest.fn()} />);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    render(<Button title="Submit" loading onPress={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAccessibilityState({ busy: true });
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Submit" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Test Commands

```bash
npm test                  # Run all tests
npm run test:coverage     # Coverage report
```

### Coverage Targets

- Shared UI components: aim for 80%+ coverage
- Feature services and hooks: aim for 70%+ coverage
- Utility functions: 100% coverage

---

## Git Workflow

### Commit Message Format

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Scope: The feature or area being changed: `auth`, `button`, `theme`, `i18n`, `api`

Examples:

```
feat(auth): add forgot password screen
fix(button): correct disabled state color in dark mode
docs(conventions): add i18n section
test(button): add accessibility tests
refactor(api): extract error normalization to helper
```

### Branch Naming

```
feat/<short-description>
fix/<short-description>
chore/<short-description>
```

Examples: `feat/product-listing`, `fix/rtl-badge-layout`, `chore/upgrade-expo-55`

### Pre-commit Checks

The project runs `validate` (type-check + lint + format) via Husky. All checks must pass before committing.

```bash
npm run validate   # Run manually before committing
```

---

## Forbidden Patterns

These patterns are banned from new code. Automated hooks block them for Claude Code; all contributors and agents must avoid them.

### Suppression Comments

| Forbidden Pattern                            | Alternative                                                           |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `// eslint-disable-next-line`                | Fix the lint violation in the code                                    |
| `/* eslint-disable */`                       | Fix all violations in the file, or restructure                        |
| `// @ts-ignore`                              | Use proper types, narrowing, or `@ts-expect-error` with a description |
| `// @ts-nocheck`                             | Type-check every file. Fix the errors.                                |
| `// @ts-expect-error` (bare, no description) | Add a description: `// @ts-expect-error -- reason`                    |

### Type Safety Bypasses

| Forbidden Pattern | Alternative                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `: any`           | Define a proper type or use `unknown` with type guards            |
| `as any`          | Use a specific type assertion (`as SpecificType`) or narrow first |
| `<any>`           | Use a generic parameter (`<T>`) or a concrete type                |

### Git Bypasses

| Forbidden Pattern        | Alternative                                             |
| ------------------------ | ------------------------------------------------------- |
| `git commit --no-verify` | Fix the pre-commit hook errors (run `npm run validate`) |
| `git push --no-verify`   | Fix the pre-push hook errors                            |

### Existing Exceptions

The following pre-approved usages exist in the codebase and are grandfathered in:

| File                               | Usage                                                                  | Reason                                                |
| ---------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `jest.setup.ts:1`                  | `/* eslint-disable @typescript-eslint/no-require-imports */`           | Jest setup requires CommonJS `require()` for mocking  |
| `src/utils/storage/storage.ts:38`  | `// eslint-disable-next-line @typescript-eslint/no-non-null-assertion` | MMKV instance is guaranteed initialized at this point |
| `src/utils/storage/storage.ts:170` | `// eslint-disable-next-line @typescript-eslint/no-non-null-assertion` | MMKV instance is guaranteed initialized at this point |

No new exceptions should be added without explicit approval from the project maintainer.
