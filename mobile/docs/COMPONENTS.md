# Component API Reference

All 33 shared components live in `src/common/components/`. Import from the barrel:

```typescript
import { Button, Text, Card } from '@/common/components';
```

All components follow this file structure:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.styles.ts
└── index.ts
```

All components use the **unistyles variants API** for declarative variant/size/state styling. Styles are always in a separate `.styles.ts` file with `variants` blocks and `UnistylesVariants` type export. Interactive components (Button, IconButton, Card, Chip, ListItem) include press animations via `useAnimatedPress`.

---

## Action Components

### Button

**File:** `src/common/components/Button/Button.tsx`

A pressable button with four visual variants, three sizes, loading state, and optional icon slots. Fully accessible with ARIA roles and states.

**Props**

| Prop        | Type                                               | Default     | Description                             |
| ----------- | -------------------------------------------------- | ----------- | --------------------------------------- |
| `title`     | `string`                                           | required    | Button label text                       |
| `variant`   | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style variant                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                             | `'md'`      | Button size                             |
| `loading`   | `boolean`                                          | `false`     | Shows ActivityIndicator, disables press |
| `disabled`  | `boolean`                                          | `false`     | Disables the button                     |
| `fullWidth` | `boolean`                                          | `false`     | Stretches to fill container width       |
| `leftIcon`  | `ReactNode`                                        | `undefined` | Icon node rendered left of title        |
| `rightIcon` | `ReactNode`                                        | `undefined` | Icon node rendered right of title       |
| `style`     | `StyleProp<ViewStyle>`                             | `undefined` | Additional container styles             |
| `onPress`   | `() => void`                                       | `undefined` | Press handler (from PressableProps)     |
| `...rest`   | `PressableProps`                                   | -           | All other Pressable props forwarded     |

**Usage**

```typescript
import { Button } from '@/common/components/Button';
import { Icon } from '@/common/components/Icon';

// Primary CTA
<Button title={t('auth.login')} onPress={handleLogin} />

// Secondary with loading
<Button
  title={t('actions.save')}
  variant="secondary"
  loading={isSaving}
  onPress={handleSave}
/>

// Outline with icon
<Button
  title={t('actions.share')}
  variant="outline"
  size="sm"
  leftIcon={<Icon name="share-outline" size={16} />}
  onPress={handleShare}
/>

// Ghost full width
<Button
  title={t('actions.cancel')}
  variant="ghost"
  fullWidth
  onPress={handleCancel}
/>
```

---

### IconButton

**File:** `src/common/components/IconButton/IconButton.tsx`

A circular/square pressable containing only an icon. `accessibilityLabel` is required.

**Props**

| Prop                 | Type                                               | Default     | Description                                   |
| -------------------- | -------------------------------------------------- | ----------- | --------------------------------------------- |
| `icon`               | `ComponentProps<typeof Ionicons>['name']`          | required    | Ionicons icon name                            |
| `accessibilityLabel` | `string`                                           | required    | Screen reader label (required)                |
| `variant`            | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'ghost'`   | Visual style                                  |
| `size`               | `'sm' \| 'md' \| 'lg'`                             | `'md'`      | Size (sm: 32px, md: 40px, lg: 48px container) |
| `disabled`           | `boolean`                                          | `false`     | Disables the button                           |
| `loading`            | `boolean`                                          | `false`     | Shows ActivityIndicator                       |
| `onPress`            | `() => void`                                       | `undefined` | Press handler                                 |

**Usage**

```typescript
import { IconButton } from '@/common/components/IconButton';

<IconButton
  icon="close-outline"
  accessibilityLabel={t('actions.close')}
  onPress={onDismiss}
/>

<IconButton
  icon="heart-outline"
  variant="outline"
  size="sm"
  accessibilityLabel={t('actions.favorite')}
  onPress={toggleFavorite}
/>
```

---

## Data Display Components

### Text

**File:** `src/common/components/Text/Text.tsx`

Themed typography component. Use this instead of React Native's `Text` for all user-facing text to ensure consistent styling.

**Props**

| Prop       | Type                                                                                  | Default                     | Description                  |
| ---------- | ------------------------------------------------------------------------------------- | --------------------------- | ---------------------------- |
| `children` | `ReactNode`                                                                           | required                    | Text content                 |
| `variant`  | `'h1' \| 'h2' \| 'h3' \| 'body' \| 'bodySmall' \| 'caption' \| 'label' \| 'overline'` | `'body'`                    | Typography scale             |
| `weight`   | `'regular' \| 'medium' \| 'semibold' \| 'bold'`                                       | Variant default             | Font weight                  |
| `color`    | `string`                                                                              | `theme.colors.text.primary` | Text color (use theme token) |
| `align`    | `'left' \| 'center' \| 'right'`                                                       | `'left'`                    | Text alignment               |
| `style`    | `StyleProp<TextStyle>`                                                                | `undefined`                 | Additional styles            |
| `...rest`  | `TextProps`                                                                           | -                           | All RN TextProps forwarded   |

**Variant Scale**

| Variant     | Size       | Weight   | Use Case                   |
| ----------- | ---------- | -------- | -------------------------- |
| `h1`        | 30px (3xl) | bold     | Page titles                |
| `h2`        | 24px (2xl) | bold     | Section headers            |
| `h3`        | 20px (xl)  | semibold | Card titles                |
| `body`      | 16px (md)  | regular  | Body copy                  |
| `bodySmall` | 14px (sm)  | regular  | Secondary body             |
| `caption`   | 12px (xs)  | regular  | Captions, metadata         |
| `label`     | 14px (sm)  | medium   | Form labels, tags          |
| `overline`  | 11px (xxs) | medium   | Category labels, uppercase |

**Usage**

```typescript
import { Text } from '@/common/components/Text';

<Text variant="h1">{t('home.welcome')}</Text>
<Text variant="body" color={theme.colors.text.secondary}>{t('home.subtitle')}</Text>
<Text variant="caption" align="center">{t('common.version', { version: '1.0.0' })}</Text>
<Text variant="label" weight="bold">{t('fields.email')}</Text>
```

---

### Avatar

**File:** `src/common/components/Avatar/Avatar.tsx`

Displays user or entity representation as an image, initials, or icon fallback.

**Props**

| Prop                 | Type                                   | Default     | Description               |
| -------------------- | -------------------------------------- | ----------- | ------------------------- |
| `source`             | `ImageSource` (expo-image)             | `undefined` | Image source              |
| `initials`           | `string`                               | `undefined` | Fallback text (e.g. "JD") |
| `icon`               | `ReactNode`                            | `undefined` | Fallback icon node        |
| `size`               | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Avatar size               |
| `accessibilityLabel` | `string`                               | `undefined` | Screen reader label       |

**Size Reference**

| Size | Pixels |
| ---- | ------ |
| `xs` | 24px   |
| `sm` | 32px   |
| `md` | 40px   |
| `lg` | 56px   |
| `xl` | 80px   |

**Usage**

```typescript
import { Avatar } from '@/common/components/Avatar';

// With image
<Avatar source={{ uri: user.avatarUrl }} size="md" accessibilityLabel={user.name} />

// With initials fallback
<Avatar initials="JD" size="lg" />

// With icon fallback
<Avatar icon={<Icon name="person-outline" />} size="sm" />
```

---

### Badge

**File:** `src/common/components/Badge/Badge.tsx`

Status indicator or count display. Supports solid fill, outline, and dot variants.

**Props**

| Prop          | Type                                                       | Default     | Description                          |
| ------------- | ---------------------------------------------------------- | ----------- | ------------------------------------ |
| `variant`     | `'solid' \| 'outline' \| 'dot'`                            | `'solid'`   | Visual style                         |
| `size`        | `'sm' \| 'md'`                                             | `'md'`      | Badge size                           |
| `colorScheme` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Color scheme                         |
| `count`       | `number`                                                   | `undefined` | Numeric count to display             |
| `maxCount`    | `number`                                                   | `99`        | Max number before showing "99+"      |
| `children`    | `ReactNode`                                                | `undefined` | Label content (alternative to count) |

**Usage**

```typescript
import { Badge } from '@/common/components/Badge';

// Count badge
<Badge count={notifications} maxCount={99} colorScheme="error" />

// Status badge
<Badge colorScheme="success">Active</Badge>

// Dot indicator
<Badge variant="dot" colorScheme="warning" />

// Outline style
<Badge variant="outline" colorScheme="info" size="sm">New</Badge>
```

---

### Card

**File:** `src/common/components/Card/Card.tsx`

Container with themed background, padding, and optional press behavior.

**Props**

| Prop        | Type                                   | Default     | Description                        |
| ----------- | -------------------------------------- | ----------- | ---------------------------------- |
| `children`  | `ReactNode`                            | required    | Card content                       |
| `variant`   | `'filled' \| 'elevated' \| 'outlined'` | `'filled'`  | Visual style                       |
| `pressable` | `boolean`                              | `false`     | Makes the card tappable            |
| `onPress`   | `() => void`                           | `undefined` | Press handler (requires pressable) |
| `style`     | `StyleProp<ViewStyle>`                 | `undefined` | Additional styles                  |
| `...rest`   | `ViewProps`                            | -           | All ViewProps forwarded            |

**Usage**

```typescript
import { Card } from '@/common/components/Card';

// Static content card (filled is the default)
<Card variant="elevated">
  <Text variant="h3">{item.title}</Text>
  <Text variant="bodySmall" color={theme.colors.text.secondary}>{item.description}</Text>
</Card>

// Pressable card with press animation
<Card variant="outlined" pressable onPress={() => router.push(`/items/${item.id}`)}>
  <Text variant="label">{item.name}</Text>
</Card>
```

---

### Chip

**File:** `src/common/components/Chip/Chip.tsx`

Compact interactive tag/filter element with optional close button.

**Props**

| Prop       | Type                   | Default     | Description                  |
| ---------- | ---------------------- | ----------- | ---------------------------- |
| `label`    | `string`               | required    | Chip text                    |
| `variant`  | `'solid' \| 'outline'` | `'solid'`   | Visual style                 |
| `size`     | `'sm' \| 'md'`         | `'md'`      | Chip size                    |
| `selected` | `boolean`              | `false`     | Selected/active state        |
| `onPress`  | `() => void`           | `undefined` | Tap handler                  |
| `onClose`  | `() => void`           | `undefined` | Shows X button when provided |
| `icon`     | `ReactNode`            | `undefined` | Leading icon                 |
| `disabled` | `boolean`              | `false`     | Disabled state               |

**Usage**

```typescript
import { Chip } from '@/common/components/Chip';

// Filter chip
<Chip
  label={t('filters.sports')}
  selected={activeFilter === 'sports'}
  onPress={() => setActiveFilter('sports')}
/>

// Removable tag
<Chip
  label={tag.name}
  variant="outline"
  onClose={() => removeTag(tag.id)}
/>
```

---

### ListItem

**File:** `src/common/components/ListItem/ListItem.tsx`

Row component for list/menu items with title, subtitle, left/right slots, press animation, and breakpoint-responsive padding.

**Props**

| Prop       | Type                   | Default     | Description                             |
| ---------- | ---------------------- | ----------- | --------------------------------------- |
| `title`    | `string`               | required    | Primary text                            |
| `subtitle` | `string`               | `undefined` | Secondary text below title              |
| `left`     | `ReactNode`            | `undefined` | Leading element (icon, avatar)          |
| `right`    | `ReactNode`            | `undefined` | Trailing element (icon, badge, switch)  |
| `onPress`  | `() => void`           | `undefined` | Makes row tappable with press animation |
| `divider`  | `boolean`              | `false`     | Shows bottom divider                    |
| `disabled` | `boolean`              | `false`     | Disabled state                          |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`      | Row height and text size                |

**Usage**

```typescript
import { ListItem } from '@/common/components/ListItem';
import { Icon } from '@/common/components/Icon';
import { Badge } from '@/common/components/Badge';

<ListItem
  title={t('settings.notifications')}
  subtitle={t('settings.notificationsSubtitle')}
  left={<Icon name="notifications-outline" variant="primary" />}
  right={<Icon name="chevron-forward-outline" variant="muted" />}
  onPress={() => router.push('/settings/notifications')}
  divider
/>

<ListItem
  title={t('settings.messages')}
  left={<Icon name="mail-outline" variant="primary" />}
  right={<Badge count={unreadCount} colorScheme="error" />}
  onPress={() => router.push('/messages')}
/>
```

---

## Disclosure Components

### Accordion

**File:** `src/common/components/Accordion/Accordion.tsx`

Expandable/collapsible content sections. Supports single or multiple simultaneous expansions.

**Props**

| Prop              | Type              | Default  | Description                       |
| ----------------- | ----------------- | -------- | --------------------------------- |
| `items`           | `AccordionItem[]` | required | Array of accordion items          |
| `multiple`        | `boolean`         | `false`  | Allow multiple items open at once |
| `defaultExpanded` | `string[]`        | `[]`     | IDs of items expanded on mount    |

**AccordionItem Shape**

| Field      | Type        | Required | Description              |
| ---------- | ----------- | -------- | ------------------------ |
| `id`       | `string`    | yes      | Unique identifier        |
| `title`    | `string`    | yes      | Header text              |
| `content`  | `ReactNode` | yes      | Expanded content         |
| `disabled` | `boolean`   | no       | Disables expand/collapse |

**Usage**

```typescript
import { Accordion } from '@/common/components/Accordion';

const faqItems = [
  {
    id: 'shipping',
    title: t('faq.shipping.title'),
    content: <Text variant="body">{t('faq.shipping.content')}</Text>,
  },
  {
    id: 'returns',
    title: t('faq.returns.title'),
    content: <Text variant="body">{t('faq.returns.content')}</Text>,
  },
];

<Accordion items={faqItems} multiple defaultExpanded={['shipping']} />
```

---

## Feedback Components

### EmptyState

**File:** `src/common/components/EmptyState/EmptyState.tsx`

Full-area empty state display for lists and search results, with three sizes.

**Props**

| Prop          | Type                   | Default     | Description            |
| ------------- | ---------------------- | ----------- | ---------------------- |
| `title`       | `string`               | required    | Primary message        |
| `message`     | `string`               | `undefined` | Supporting description |
| `icon`        | `ReactNode`            | `undefined` | Illustration or icon   |
| `actionLabel` | `string`               | `undefined` | CTA button label       |
| `onAction`    | `() => void`           | `undefined` | CTA button handler     |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`      | Spacing and text size  |

**Usage**

```typescript
import { EmptyState } from '@/common/components/EmptyState';
import { Icon } from '@/common/components/Icon';

<EmptyState
  title={t('search.noResults')}
  message={t('search.noResultsMessage')}
  icon={<Icon name="search-outline" size={48} variant="muted" />}
  actionLabel={t('search.clearFilters')}
  onAction={clearFilters}
/>
```

---

### ErrorBoundary

**File:** `src/common/components/ErrorBoundary/ErrorBoundary.tsx`

React class component error boundary. Catches render errors in its subtree. Styles are extracted to a separate file but applied via style arrays (class components cannot use `useVariants` hook).

**Props**

| Prop       | Type                                           | Default           | Description                |
| ---------- | ---------------------------------------------- | ----------------- | -------------------------- |
| `children` | `ReactNode`                                    | required          | Protected subtree          |
| `fallback` | `ReactNode`                                    | Built-in error UI | Custom fallback UI         |
| `onError`  | `(error: Error, errorInfo: ErrorInfo) => void` | `undefined`       | Error callback for logging |

**Usage**

```typescript
import { ErrorBoundary } from '@/common/components/ErrorBoundary';

// Wrap risky sections
<ErrorBoundary>
  <MyDataComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<Text>{t('errors.sectionFailed')}</Text>}>
  <Chart data={data} />
</ErrorBoundary>
```

---

### Loading

**File:** `src/common/components/Loading/Loading.tsx`

Loading indicator with optional message and full-screen mode.

**Props**

| Prop                 | Type                 | Default     | Description                            |
| -------------------- | -------------------- | ----------- | -------------------------------------- |
| `message`            | `string`             | `undefined` | Text below spinner                     |
| `fullScreen`         | `boolean`            | `false`     | Centers in full screen with background |
| `size`               | `'small' \| 'large'` | `'large'`   | ActivityIndicator size                 |
| `accessibilityLabel` | `string`             | `'Loading'` | Screen reader label                    |

**Usage**

```typescript
import { Loading } from '@/common/components/Loading';

// Inline loading
{isLoading && <Loading size="small" />}

// Full-screen loading
<Loading fullScreen message={t('common.loading')} />
```

---

### ProgressBar

**File:** `src/common/components/ProgressBar/ProgressBar.tsx`

Horizontal progress indicator supporting determinate and indeterminate modes.

**Props**

| Prop                 | Type                                                       | Default     | Description                             |
| -------------------- | ---------------------------------------------------------- | ----------- | --------------------------------------- |
| `value`              | `number`                                                   | `0`         | Progress value 0-100                    |
| `size`               | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | Bar height (sm: 4px, md: 8px, lg: 12px) |
| `colorScheme`        | `'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'primary'` | Fill color                              |
| `indeterminate`      | `boolean`                                                  | `false`     | Animated indeterminate mode             |
| `accessibilityLabel` | `string`                                                   | `undefined` | Screen reader description               |

**Usage**

```typescript
import { ProgressBar } from '@/common/components/ProgressBar';

// Determinate
<ProgressBar value={uploadProgress} colorScheme="primary" />

// Indeterminate loading
<ProgressBar indeterminate size="sm" />

// Success state
<ProgressBar value={100} colorScheme="success" />
```

---

### Skeleton

**File:** `src/common/components/Skeleton/Skeleton.tsx`

Animated placeholder for loading states. Use to match the shape of content before it loads.

**Props**

| Prop       | Type                           | Default  | Description              |
| ---------- | ------------------------------ | -------- | ------------------------ |
| `variant`  | `'text' \| 'circle' \| 'rect'` | `'rect'` | Shape type               |
| `width`    | `DimensionValue`               | `'100%'` | Width                    |
| `height`   | `DimensionValue`               | `16`     | Height                   |
| `animated` | `boolean`                      | `true`   | Enable shimmer animation |

**Usage**

```typescript
import { Skeleton } from '@/common/components/Skeleton';

// Card skeleton
<View>
  <Skeleton variant="rect" height={200} />
  <Skeleton variant="text" width="60%" height={20} />
  <Skeleton variant="text" width="40%" height={16} />
</View>

// Avatar with text
<View style={{ flexDirection: 'row', gap: 12 }}>
  <Skeleton variant="circle" width={40} height={40} />
  <View style={{ flex: 1 }}>
    <Skeleton variant="text" width="70%" height={16} />
    <Skeleton variant="text" width="50%" height={14} />
  </View>
</View>
```

---

### Snackbar

**File:** `src/common/components/Snackbar/Snackbar.tsx`

Temporary notification bar with auto-dismiss and optional action.

**Props**

| Prop        | Type                                | Default     | Description                               |
| ----------- | ----------------------------------- | ----------- | ----------------------------------------- |
| `visible`   | `boolean`                           | required    | Controls visibility                       |
| `message`   | `string`                            | required    | Notification text                         |
| `onDismiss` | `() => void`                        | required    | Called when dismissed or duration expires |
| `variant`   | `'neutral' \| 'success' \| 'error'` | `'neutral'` | Visual style                              |
| `duration`  | `number`                            | `3000`      | Auto-dismiss delay in ms                  |
| `action`    | `SnackbarAction`                    | `undefined` | Optional CTA button                       |

**SnackbarAction Shape**

| Field     | Type         | Description    |
| --------- | ------------ | -------------- |
| `label`   | `string`     | Button label   |
| `onPress` | `() => void` | Action handler |

**Usage**

```typescript
import { Snackbar } from '@/common/components/Snackbar';

const [snackbarVisible, setSnackbarVisible] = useState(false);

<Snackbar
  visible={snackbarVisible}
  message={t('actions.itemSaved')}
  variant="success"
  onDismiss={() => setSnackbarVisible(false)}
/>

// With action
<Snackbar
  visible={showUndo}
  message={t('actions.itemDeleted')}
  variant="neutral"
  duration={5000}
  action={{ label: t('actions.undo'), onPress: handleUndo }}
  onDismiss={() => setShowUndo(false)}
/>
```

---

## Form Components

### Checkbox

**File:** `src/common/components/Checkbox/Checkbox.tsx`

Controlled checkbox with optional label, indeterminate state, animated check mark, and three sizes.

**Props**

| Prop            | Type                         | Default     | Description                         |
| --------------- | ---------------------------- | ----------- | ----------------------------------- |
| `checked`       | `boolean`                    | required    | Controlled checked state            |
| `onChange`      | `(checked: boolean) => void` | required    | Change handler                      |
| `label`         | `string`                     | `undefined` | Adjacent label text                 |
| `disabled`      | `boolean`                    | `false`     | Disabled state                      |
| `indeterminate` | `boolean`                    | `false`     | Shows minus icon instead of check   |
| `size`          | `'sm' \| 'md' \| 'lg'`       | `'md'`      | Checkbox size (sm:18, md:22, lg:28) |

**Usage**

```typescript
import { Checkbox } from '@/common/components/Checkbox';

const [agreed, setAgreed] = useState(false);

<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label={t('auth.agreeToTerms')}
/>

// Indeterminate (e.g., parent checkbox with partial selection)
<Checkbox
  checked={someChecked}
  indeterminate={someChecked && !allChecked}
  onChange={toggleAll}
  label={t('actions.selectAll')}
/>

// Small size
<Checkbox checked={value} onChange={setValue} size="sm" />
```

---

### FormField

**File:** `src/common/components/FormField/FormField.tsx`

React Hook Form controller wrapper. Handles `control`, error display, and label rendering.

**Props**

| Prop       | Type           | Default     | Description                         |
| ---------- | -------------- | ----------- | ----------------------------------- |
| `name`     | `FieldPath<T>` | required    | Field name (typed from form schema) |
| `control`  | `Control<T>`   | required    | RHF control object                  |
| `children` | `ReactElement` | required    | The form input element              |
| `label`    | `string`       | `undefined` | Field label                         |
| `required` | `boolean`      | `false`     | Shows required indicator            |

**Usage**

```typescript
import { FormField } from '@/common/components/FormField';
import { Input } from '@/common/components/Input';
import { useForm } from 'react-hook-form';

const { control } = useForm<MyFormData>({ resolver: zodResolver(schema) });

<FormField name="email" control={control} label={t('fields.email')} required>
  <Input placeholder={t('fields.emailPlaceholder')} keyboardType="email-address" />
</FormField>
```

---

### Input

**File:** `src/common/components/Input/Input.tsx`

Themed text input with label, helper text, error/focused/disabled state variants, icon slots, and three sizes.

**Props**

| Prop         | Type                   | Default     | Description                     |
| ------------ | ---------------------- | ----------- | ------------------------------- |
| `label`      | `string`               | `undefined` | Label above the input           |
| `error`      | `string`               | `undefined` | Error message (turns input red) |
| `helperText` | `string`               | `undefined` | Helper text below input         |
| `disabled`   | `boolean`              | `false`     | Disabled state                  |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`      | Input height and font size      |
| `leftIcon`   | `ReactNode`            | `undefined` | Leading icon inside input       |
| `rightIcon`  | `ReactNode`            | `undefined` | Trailing icon inside input      |
| `...rest`    | `TextInputProps`       | -           | All RN TextInputProps forwarded |

**Usage**

```typescript
import { Input } from '@/common/components/Input';

<Input
  label={t('fields.email')}
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={emailError ? t(emailError) : undefined}
  keyboardType="email-address"
  autoCapitalize="none"
  leftIcon={<Icon name="mail-outline" variant="muted" />}
/>

<Input
  label={t('fields.password')}
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  rightIcon={
    <IconButton
      icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
      accessibilityLabel={t('actions.togglePassword')}
      onPress={() => setShowPassword((s) => !s)}
    />
  }
/>
```

---

### RadioGroup

**File:** `src/common/components/RadioGroup/RadioGroup.tsx`

Controlled radio button group with animated selection dot and three sizes.

**Props**

| Prop          | Type                         | Default      | Description              |
| ------------- | ---------------------------- | ------------ | ------------------------ |
| `value`       | `string`                     | required     | Currently selected value |
| `onChange`    | `(value: string) => void`    | required     | Selection handler        |
| `options`     | `RadioOption[]`              | required     | Array of options         |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction         |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`       | Radio button size        |

**RadioOption Shape**

| Field      | Type      | Required | Description          |
| ---------- | --------- | -------- | -------------------- |
| `value`    | `string`  | yes      | Option value         |
| `label`    | `string`  | yes      | Display label        |
| `disabled` | `boolean` | no       | Disables this option |

**Usage**

```typescript
import { RadioGroup } from '@/common/components/RadioGroup';

const [plan, setPlan] = useState('free');

<RadioGroup
  value={plan}
  onChange={setPlan}
  options={[
    { value: 'free', label: t('plans.free') },
    { value: 'pro', label: t('plans.pro') },
    { value: 'enterprise', label: t('plans.enterprise') },
  ]}
/>
```

---

### SearchBar

**File:** `src/common/components/SearchBar/SearchBar.tsx`

Search input with clear button, loading indicator, and three sizes.

**Props**

| Prop           | Type                     | Default       | Description                          |
| -------------- | ------------------------ | ------------- | ------------------------------------ |
| `value`        | `string`                 | required      | Controlled input value               |
| `onChangeText` | `(text: string) => void` | required      | Change handler                       |
| `placeholder`  | `string`                 | `'Search...'` | Placeholder text                     |
| `onSubmit`     | `() => void`             | `undefined`   | Called on keyboard submit            |
| `onClear`      | `() => void`             | `undefined`   | Called when X is pressed             |
| `loading`      | `boolean`                | `false`       | Shows spinner instead of search icon |
| `autoFocus`    | `boolean`                | `false`       | Focuses on mount                     |
| `size`         | `'sm' \| 'md' \| 'lg'`   | `'md'`        | Search bar height and font size      |

**Usage**

```typescript
import { SearchBar } from '@/common/components/SearchBar';

<SearchBar
  value={query}
  onChangeText={setQuery}
  placeholder={t('search.placeholder')}
  loading={isSearching}
  onClear={() => setQuery('')}
  onSubmit={handleSearch}
/>
```

---

### SegmentedControl

**File:** `src/common/components/SegmentedControl/SegmentedControl.tsx`

Horizontal segmented picker for mutually exclusive options.

**Props**

| Prop       | Type                      | Default  | Description            |
| ---------- | ------------------------- | -------- | ---------------------- |
| `value`    | `string`                  | required | Selected segment value |
| `onChange` | `(value: string) => void` | required | Change handler         |
| `options`  | `SegmentOption[]`         | required | Array of segments      |
| `size`     | `'sm' \| 'md'`            | `'md'`   | Control size           |
| `disabled` | `boolean`                 | `false`  | Disables all segments  |

**SegmentOption Shape**

| Field   | Type        | Required | Description           |
| ------- | ----------- | -------- | --------------------- |
| `value` | `string`    | yes      | Option value          |
| `label` | `string`    | yes      | Display text          |
| `icon`  | `ReactNode` | no       | Optional leading icon |

**Usage**

```typescript
import { SegmentedControl } from '@/common/components/SegmentedControl';

<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'grid', label: t('view.grid'), icon: <Icon name="grid-outline" size={14} /> },
    { value: 'list', label: t('view.list'), icon: <Icon name="list-outline" size={14} /> },
  ]}
/>
```

---

### Select

**File:** `src/common/components/Select/Select.tsx`

Dropdown picker with label, placeholder, error state, and three sizes.

**Props**

| Prop          | Type                      | Default     | Description           |
| ------------- | ------------------------- | ----------- | --------------------- |
| `value`       | `string`                  | required    | Selected option value |
| `onChange`    | `(value: string) => void` | required    | Selection handler     |
| `options`     | `SelectOption[]`          | required    | Array of options      |
| `label`       | `string`                  | `undefined` | Label above picker    |
| `placeholder` | `string`                  | `undefined` | Placeholder text      |
| `error`       | `string`                  | `undefined` | Error message         |
| `disabled`    | `boolean`                 | `false`     | Disabled state        |
| `size`        | `'sm' \| 'md' \| 'lg'`    | `'md'`      | Picker height         |

**SelectOption Shape**

| Field      | Type      | Required | Description          |
| ---------- | --------- | -------- | -------------------- |
| `label`    | `string`  | yes      | Display text         |
| `value`    | `string`  | yes      | Option value         |
| `disabled` | `boolean` | no       | Disables this option |

**Usage**

```typescript
import { Select } from '@/common/components/Select';

<Select
  label={t('fields.country')}
  value={country}
  onChange={setCountry}
  placeholder={t('fields.countryPlaceholder')}
  options={countries.map((c) => ({ label: c.name, value: c.code }))}
  error={countryError ? t(countryError) : undefined}
/>
```

---

### Switch

**File:** `src/common/components/Switch/Switch.tsx`

Toggle switch with optional label and three sizes. Uses native RN Switch with size scaling via transform.

**Props**

| Prop            | Type                       | Default     | Description                            |
| --------------- | -------------------------- | ----------- | -------------------------------------- |
| `value`         | `boolean`                  | required    | Controlled on/off state                |
| `onValueChange` | `(value: boolean) => void` | required    | Change handler                         |
| `label`         | `string`                   | `undefined` | Adjacent label text                    |
| `disabled`      | `boolean`                  | `false`     | Disabled state                         |
| `size`          | `'sm' \| 'md' \| 'lg'`     | `'md'`      | Switch size (sm:0.8x, md:1x, lg:1.15x) |

**Usage**

```typescript
import { Switch } from '@/common/components/Switch';

<Switch
  value={notificationsEnabled}
  onValueChange={setNotificationsEnabled}
  label={t('settings.enableNotifications')}
/>
```

---

### TextArea

**File:** `src/common/components/TextArea/TextArea.tsx`

Multi-line text input with optional character count. Extends `InputProps`.

**Props**

Inherits all `InputProps` (except `secureTextEntry`) plus:

| Prop            | Type      | Default     | Description             |
| --------------- | --------- | ----------- | ----------------------- |
| `numberOfLines` | `number`  | `4`         | Visible lines           |
| `maxLength`     | `number`  | `undefined` | Max character count     |
| `showCount`     | `boolean` | `false`     | Shows character counter |

**Usage**

```typescript
import { TextArea } from '@/common/components/TextArea';

<TextArea
  label={t('fields.bio')}
  value={bio}
  onChangeText={setBio}
  placeholder={t('fields.bioPlaceholder')}
  numberOfLines={5}
  maxLength={500}
  showCount
/>
```

---

## Layout Components

### Divider

**File:** `src/common/components/Divider/Divider.tsx`

Visual separator line.

**Props**

| Prop          | Type                         | Default        | Description               |
| ------------- | ---------------------------- | -------------- | ------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Line direction            |
| `bold`        | `boolean`                    | `false`        | Thicker line (2px vs 1px) |
| `inset`       | `boolean`                    | `false`        | Adds horizontal padding   |

**Usage**

```typescript
import { Divider } from '@/common/components/Divider';

<Divider />
<Divider bold />
<Divider inset />
<Divider orientation="vertical" />  {/* Use in a flex row */}
```

---

### ScreenContainer

**File:** `src/common/components/ScreenContainer/ScreenContainer.tsx`

Root container for every screen. Handles safe area insets, scroll, and padding.

**Props**

| Prop         | Type                    | Default             | Description                 |
| ------------ | ----------------------- | ------------------- | --------------------------- |
| `children`   | `ReactNode`             | required            | Screen content              |
| `scrollable` | `boolean`               | `false`             | Wraps content in ScrollView |
| `padded`     | `boolean`               | `true`              | Applies horizontal padding  |
| `edges`      | `('top' \| 'bottom')[]` | `['top', 'bottom']` | Safe area edges to respect  |
| `style`      | `ViewStyle`             | `undefined`         | Additional container styles |

**Usage**

```typescript
import { ScreenContainer } from '@/common/components/ScreenContainer';

// Standard screen
export default function ProfileScreen() {
  return (
    <ScreenContainer scrollable>
      <Text variant="h1">{t('profile.title')}</Text>
      {/* content */}
    </ScreenContainer>
  );
}

// No top padding (e.g., has custom header)
<ScreenContainer edges={['bottom']}>
  {/* content */}
</ScreenContainer>
```

---

## Overlay Components

### Dialog

**File:** `src/common/components/Dialog/Dialog.tsx`

Modal dialog with title, message, action buttons, and three sizes.

**Props**

| Prop        | Type                   | Default     | Description                           |
| ----------- | ---------------------- | ----------- | ------------------------------------- |
| `visible`   | `boolean`              | required    | Controls visibility                   |
| `onDismiss` | `() => void`           | required    | Called on backdrop press or dismiss   |
| `title`     | `string`               | `undefined` | Dialog title                          |
| `message`   | `string`               | `undefined` | Dialog body text                      |
| `actions`   | `DialogAction[]`       | `undefined` | Array of action buttons               |
| `children`  | `ReactNode`            | `undefined` | Custom content (replaces message)     |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`      | Dialog width (sm:320, md:400, lg:520) |

**DialogAction Shape**

| Field     | Type            | Default   | Description         |
| --------- | --------------- | --------- | ------------------- |
| `label`   | `string`        | required  | Button label        |
| `onPress` | `() => void`    | required  | Press handler       |
| `variant` | `ButtonVariant` | `'ghost'` | Button visual style |

**Usage**

```typescript
import { Dialog } from '@/common/components/Dialog';

<Dialog
  visible={showDeleteConfirm}
  onDismiss={() => setShowDeleteConfirm(false)}
  title={t('dialogs.deleteTitle')}
  message={t('dialogs.deleteMessage')}
  actions={[
    {
      label: t('actions.cancel'),
      onPress: () => setShowDeleteConfirm(false),
      variant: 'ghost',
    },
    {
      label: t('actions.delete'),
      onPress: handleDelete,
      variant: 'primary',
    },
  ]}
/>
```

---

### Menu

**File:** `src/common/components/Menu/Menu.tsx`

Context menu anchored to a trigger element.

**Props**

| Prop        | Type         | Default  | Description             |
| ----------- | ------------ | -------- | ----------------------- |
| `visible`   | `boolean`    | required | Controls visibility     |
| `onDismiss` | `() => void` | required | Called when menu closes |
| `anchor`    | `ReactNode`  | required | Trigger element         |
| `items`     | `MenuItem[]` | required | Array of menu items     |

**MenuItem Shape**

| Field         | Type                | Required | Description             |
| ------------- | ------------------- | -------- | ----------------------- |
| `label`       | `string`            | yes      | Item label              |
| `onPress`     | `() => void`        | yes      | Press handler           |
| `icon`        | `IconProps['name']` | no       | Ionicons icon name      |
| `disabled`    | `boolean`           | no       | Disables this item      |
| `destructive` | `boolean`           | no       | Red destructive styling |

**Usage**

```typescript
import { Menu } from '@/common/components/Menu';
import { IconButton } from '@/common/components/IconButton';

const [menuVisible, setMenuVisible] = useState(false);

<Menu
  visible={menuVisible}
  onDismiss={() => setMenuVisible(false)}
  anchor={
    <IconButton
      icon="ellipsis-vertical-outline"
      accessibilityLabel={t('actions.moreOptions')}
      onPress={() => setMenuVisible(true)}
    />
  }
  items={[
    { label: t('actions.edit'), icon: 'pencil-outline', onPress: handleEdit },
    { label: t('actions.share'), icon: 'share-outline', onPress: handleShare },
    { label: t('actions.delete'), icon: 'trash-outline', onPress: handleDelete, destructive: true },
  ]}
/>
```

---

## Typography Components

### Icon

**File:** `src/common/components/Icon/Icon.tsx`

Themed Ionicons wrapper with semantic color variants.

**Props**

| Prop                 | Type                                                                         | Default                          | Description                      |
| -------------------- | ---------------------------------------------------------------------------- | -------------------------------- | -------------------------------- |
| `name`               | `ComponentProps<typeof Ionicons>['name']`                                    | required                         | Ionicons icon name               |
| `variant`            | `'primary' \| 'secondary' \| 'tertiary' \| 'muted' \| 'inverse' \| 'accent'` | `'primary'`                      | Semantic color                   |
| `size`               | `number`                                                                     | `theme.metrics.iconSize.md` (18) | Icon size in pixels              |
| `color`              | `string`                                                                     | Variant default                  | Override color (use theme token) |
| `accessibilityLabel` | `string`                                                                     | `undefined`                      | Screen reader label              |

**Usage**

```typescript
import { Icon } from '@/common/components/Icon';

<Icon name="home-outline" variant="primary" />
<Icon name="alert-circle-outline" variant="accent" size={24} />
<Icon name="checkmark-circle-outline" color={theme.colors.state.success} />
<Icon name="close-outline" variant="muted" size={20} accessibilityLabel={t('actions.close')} />
```
