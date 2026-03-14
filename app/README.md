<div align="center">

# RNCopilot

### The AI-Friendly, Production-Ready React Native Template

**[Read the Documentation](https://docs.rncopilot.xyz)**

[![React Native](https://img.shields.io/badge/React%20Native-0.83.2-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-55-000020?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Build any mobile app — games, e-commerce, social, SaaS — on a battle-tested foundation.**

Works with **Claude Code** · **Cursor** · **Windsurf** · **Cline** · **GitHub Copilot** · **OpenAI Codex**

[Quick Start](#-quick-start) · [Features](#-whats-included) · [Components](#-component-library) · [AI Guide](#-ai-powered-development) · [Docs](#-documentation) · [Website](https://docs.rncopilot.xyz)

![RNCopilot showcasing iOS and Android apps in light and dark modes](docs/images/hero.jpg)

</div>

---

## Why This Template?

Most React Native templates give you a blank screen with routing. This one gives you **everything you need to ship a real app** — authentication, theming, internationalization, 30 production-ready components, API integration, and the most comprehensive AI agent instructions of any React Native template.

- **Start building features immediately** — auth, state management, forms, and storage are pre-wired
- **30 shared UI components** — Button, Card, Input, Dialog, and more — all themed, accessible, and ready to use
- **AI-first architecture** — instruction files for 6+ AI coding tools so your AI assistant understands the codebase instantly
- **Clean migration path** — run one command to reset and start customizing for your use case

---

## What's Included

| Category                 | Details                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Authentication**       | Zustand-based auth store, Supabase integration, login/register forms, route protection |
| **30 UI Components**     | Button, Card, Input, Dialog, Avatar, Badge, Chip, Accordion, and 25 more               |
| **Theme System**         | Light/dark mode, semantic tokens, Indigo + Teal palette, responsive scaling            |
| **Internationalization** | English + Arabic, RTL support, enforced via ESLint                                     |
| **State Management**     | Zustand (client) + React Query (server) with MMKV persistence                          |
| **API Client**           | Axios with auth interceptors, auto-token attachment, error normalization               |
| **Forms & Validation**   | react-hook-form + Zod with i18n error messages                                         |
| **Storage**              | MMKV with typed keys, reactive hooks, encryption support                               |
| **Code Quality**         | ESLint 9, Prettier, Husky pre-commit hooks, Commitlint                                 |
| **Testing**              | Jest + jest-expo, module aliases, comprehensive mocks                                  |
| **AI Integration**       | Config files for Claude Code, Cursor, Windsurf, Cline, Copilot, Codex                  |

---

## Tech Stack

| Layer        | Technology                               |
| ------------ | ---------------------------------------- |
| Framework    | React Native 0.83.2 + Expo SDK 55        |
| Routing      | expo-router (file-based, typed routes)   |
| Language     | TypeScript 5.9 (strict)                  |
| Styling      | react-native-unistyles 3.x               |
| Server State | @tanstack/react-query + MMKV persistence |
| Client State | Zustand                                  |
| Backend      | Supabase (graceful degradation)          |
| API Client   | Axios with auth interceptors             |
| i18n         | react-i18next (EN/AR, RTL)               |
| Storage      | react-native-mmkv                        |
| Forms        | react-hook-form + Zod                    |
| Testing      | Jest 30 + jest-expo                      |
| Linting      | ESLint 9 flat config                     |

---

## Quick Start

```bash
# 1. Clone the template
git clone https://github.com/FouadMagdy01/RNCopilot.git my-app
cd my-app

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment (optional — app works without Supabase)
cp .env.example .env

# 4. Start developing
npm start
```

Then press `i` for iOS simulator or `a` for Android emulator.

> The app boots and works without Supabase configured. Just add credentials to `.env` when you're ready for auth and backend features.

---

## Project Structure

```
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout (providers, error boundary)
│   ├── +not-found.tsx            # 404 screen
│   └── (main)/(tabs)/            # Tab navigation
│       ├── _layout.tsx           # Tab bar configuration
│       ├── index.tsx             # Home tab
│       └── settings.tsx          # Settings screen
│
├── src/
│   ├── common/components/        # 30 shared UI components
│   ├── config/                   # Environment configuration
│   ├── features/                 # Feature modules
│   │   └── auth/                 # Authentication (hooks, services)
│   ├── hooks/                    # Global hooks
│   ├── i18n/                     # Translations (en.json, ar.json)
│   ├── integrations/             # Supabase client
│   ├── providers/                # Query provider, auth store
│   ├── services/api/             # Axios client
│   ├── theme/                    # Colors, metrics, fonts
│   ├── types/                    # Global TypeScript types
│   └── utils/storage/            # MMKV utilities
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Architecture overview
│   ├── COMPONENTS.md             # Component API reference
│   ├── AI-GUIDE.md               # Pattern cookbook for AI agents
│   ├── MIGRATION.md              # Template migration guide
│   ├── SETUP.md                  # Setup guide
│   └── llms.txt                  # LLM context file
│
├── CLAUDE.md                     # Claude Code instructions
├── AGENTS.md                     # Universal AI agent instructions
├── CONVENTIONS.md                # Coding conventions
├── .cursorrules                  # Cursor IDE rules
├── .cursor/rules/project.mdc     # Cursor modern rules
├── .windsurfrules                # Windsurf rules
├── .clinerules                   # Cline rules
└── .github/copilot-instructions.md  # GitHub Copilot rules
```

**Path aliases:** `@/*` → `src/*` · `~/*` → `app/*`

---

## Component Library

30 production-ready, themed, accessible components. See the [full API reference](docs/COMPONENTS.md) or the [docs website](https://docs.rncopilot.xyz/components).

<details>
<summary><strong>Action</strong></summary>

| Component      | Variants                           | Sizes      |
| -------------- | ---------------------------------- | ---------- |
| **Button**     | primary, secondary, outline, ghost | sm, md, lg |
| **IconButton** | primary, secondary, outline, ghost | sm, md, lg |

</details>

<details>
<summary><strong>Data Display</strong></summary>

| Component    | Description                                           |
| ------------ | ----------------------------------------------------- |
| **Text**     | h1, h2, h3, body, bodySmall, caption, label, overline |
| **Avatar**   | Image, initials, or icon fallback (xs–xl)             |
| **Badge**    | solid, outline, dot with 5 color schemes              |
| **Card**     | default, elevated, outlined — pressable               |
| **Chip**     | solid, outline — selectable, closeable                |
| **ListItem** | Title, subtitle, left/right content, divider          |

</details>

<details>
<summary><strong>Form</strong></summary>

| Component            | Features                                          |
| -------------------- | ------------------------------------------------- |
| **Input**            | Label, error, helper text, icons, password toggle |
| **TextArea**         | Multi-line with character count                   |
| **Select**           | Bottom sheet dropdown                             |
| **Checkbox**         | With optional label                               |
| **Switch**           | With optional label                               |
| **RadioGroup**       | Vertical or horizontal                            |
| **SegmentedControl** | Animated with icon support                        |
| **SearchBar**        | Search icon, clear, loading state                 |
| **FormField**        | react-hook-form Controller wrapper                |

</details>

<details>
<summary><strong>Feedback</strong></summary>

| Component         | Features                                |
| ----------------- | --------------------------------------- |
| **Loading**       | Inline or fullscreen with message       |
| **ProgressBar**   | sm/md/lg, 5 colors, indeterminate       |
| **Skeleton**      | text, circle, rect with pulse animation |
| **Snackbar**      | default, success, error — auto-dismiss  |
| **EmptyState**    | Icon, message, action button            |
| **ErrorBoundary** | Crash recovery with retry               |

</details>

<details>
<summary><strong>Layout & Overlay</strong></summary>

| Component           | Description                             |
| ------------------- | --------------------------------------- |
| **ScreenContainer** | Safe area wrapper, scrollable option    |
| **Divider**         | Horizontal/vertical, bold, inset        |
| **Dialog**          | Modal with actions                      |
| **Menu**            | Dropdown with icons, destructive option |
| **Accordion**       | Single or multiple expand               |
| **Icon**            | Ionicons with 6 color variants          |

</details>

---

## AI-Powered Development

This template includes instruction files for **every major AI coding tool**:

| File                                         | Tool                     |
| -------------------------------------------- | ------------------------ |
| `CLAUDE.md`                                  | Claude Code              |
| `.cursorrules` + `.cursor/rules/project.mdc` | Cursor (legacy + modern) |
| `.windsurfrules`                             | Windsurf / Codeium       |
| `.clinerules`                                | Cline                    |
| `.github/copilot-instructions.md`            | GitHub Copilot           |
| `AGENTS.md`                                  | OpenAI Codex / Universal |
| `docs/llms.txt`                              | Any LLM                  |

Each file contains:

- Project architecture and file structure
- Exact code patterns with real examples
- Theme token reference
- Do's and don'ts specific to this codebase
- Component usage patterns
- State management rules

**Your AI assistant will understand this codebase from the first prompt.**

---

## Scripts

| Command                 | Description                             |
| ----------------------- | --------------------------------------- |
| `npm start`             | Start Expo dev server                   |
| `npm run ios`           | Run on iOS simulator                    |
| `npm run android`       | Run on Android emulator                 |
| `npm run type-check`    | TypeScript checking                     |
| `npm run lint`          | ESLint                                  |
| `npm run lint:fix`      | Auto-fix lint errors                    |
| `npm run format`        | Prettier format                         |
| `npm run validate`      | All checks (type-check + lint + format) |
| `npm test`              | Run tests                               |
| `npm run test:coverage` | Coverage report                         |
| `npm run migrate`       | Interactive migration wizard            |

---

## Customizing the Template

### Interactive Migration Wizard

The fastest way to get started — run the wizard and answer a few questions:

```bash
npm run migrate
```

The wizard walks you through:

1. Cleaning up example content (showcase, auth)
2. Setting app name, slug, and bundle identifier
3. Choosing a color palette (5 presets or custom)
4. Configuring languages and i18n
5. Setting up backend credentials
6. Adding navigation tabs
7. Scaffolding your first feature module
8. Configuring EAS builds

### Manual Customization

1. Update `app.json` — app name, slug, bundle ID
2. Update `package.json` — project name
3. Customize theme colors in `src/theme/light-theme.ts` and `dark-theme.ts`
4. Configure `.env` with your backend credentials
5. Update translations in `src/i18n/locales/`
6. Start building features in `src/features/`

See **[docs/MIGRATION.md](docs/MIGRATION.md)** for the complete step-by-step guide with code examples.

---

## Key Patterns

### Styling (react-native-unistyles)

```typescript
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.metrics.spacing.p16,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.md,
  },
}));
```

### State Management

```typescript
// Zustand for client state
const user = useAuthStore((s) => s.user);

// React Query for server state
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => api.get('/products').then((r) => r.data),
});
```

### Forms

```typescript
import { z } from 'zod/v4';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin'),
});
```

### i18n

```typescript
const { t } = useTranslation();
<Text>{t('home.welcome')}</Text>  // All UI text via translation keys
```

See **[docs/AI-GUIDE.md](docs/AI-GUIDE.md)** for 10+ complete recipes.

---

## Documentation

> **Full documentation website:** [**docs.rncopilot.xyz**](https://docs.rncopilot.xyz) — Getting started guides, component API reference, code recipes, conventions, and more.

| Document                                | Description                                |
| --------------------------------------- | ------------------------------------------ |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and key patterns       |
| [COMPONENTS.md](docs/COMPONENTS.md)     | Full API reference for all 30 components   |
| [AI-GUIDE.md](docs/AI-GUIDE.md)         | Pattern cookbook with copy-paste templates |
| [MIGRATION.md](docs/MIGRATION.md)       | Step-by-step template customization guide  |
| [SETUP.md](docs/SETUP.md)               | Environment setup and configuration        |
| [CONVENTIONS.md](CONVENTIONS.md)        | Comprehensive coding conventions           |

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes following [conventional commits](https://www.conventionalcommits.org/) (`feat(scope): add amazing feature`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Commit Format

```
<type>(<scope>): <subject>

Types: feat | fix | docs | style | refactor | perf | test | build | ci | chore
```

### Code Quality

All PRs must pass:

- `npm run type-check` — TypeScript strict mode
- `npm run lint` — ESLint with React Native + i18n rules
- `npm run format:check` — Prettier formatting

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with React Native + Expo + TypeScript**

If this template helped you, give it a star!

</div>
