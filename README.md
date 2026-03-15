# Smart Reamer

A smart lock system consisting of ESP32 firmware, a React Native mobile app, and an optional cloud backend. The mobile app discovers locks on the local network via mDNS, connects over a secure WebSocket (wss://), and controls locking/unlocking in real time.

## Architecture

```
┌──────────────┐       mDNS discovery        ┌─────────────────┐
│  Mobile App  │ ◄──────────────────────────► │  ESP32 Firmware  │
│  (React      │       WebSocket (wss://)     │  (Smart Lock)    │
│   Native)    │ ◄──────────────────────────► │                  │
└──────┬───────┘                              └──────────────────┘
       │
       │ optional
       ▼
┌──────────────┐
│   Backend    │
│  (Upstash    │
│   Redis)     │
└──────────────┘
```

**Discovery** — The firmware advertises `_smartlock._tcp` via mDNS on port 443. The mobile app uses Zeroconf to find devices on the local network.

**Communication** — The app connects to the lock at `wss://<ip>:443/ws` using self-signed TLS certificates. JSON messages handle lock/unlock commands, status updates, and token-based authentication.

**Pairing** — The lock enters pair mode via a physical button. The app obtains and stores a token for future authenticated connections. Up to 10 devices can be paired.

## Repository Structure

```
Smart-Reamer/
├── firmware/           # ESP32 firmware (C/C++, ESP-IDF)
│   ├── main_esp32/     # ESP-IDF main component (WiFi, WebSocket, mDNS)
│   └── lib/            # Shared library (motor, sensors, lock logic)
├── mobile/             # React Native Expo app
│   ├── app/            # Screens (Expo Router, file-based routing)
│   ├── src/            # Features, components, services, hooks, theme
│   ├── native/         # Native modules (self-signed cert handling)
│   └── plugins/        # Expo config plugins
├── backend/            # Serverless API (Upstash Redis)
├── boards/             # KiCad PCB design files
└── docs/               # Project documentation
```

## Prerequisites

| Component | Requirement                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Firmware  | [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/) (v5.x), CMake, Ninja |
| Mobile    | Node.js 18+, npm/yarn, Expo CLI, Xcode (iOS) or Android Studio (Android)                                 |
| Backend   | Node.js 18+                                                                                              |

## Setup

### Firmware

1. Install [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/):

```bash
# Set the IDF_PATH environment variable to your esp-idf installation
export IDF_PATH=/path/to/esp-idf
```

2. Build the firmware:

```bash
cd firmware/main_esp32
./build.sh
```

3. Flash to the ESP32:

```bash
./flash.sh            # flash only
./flash.sh monitor    # flash and open serial monitor
```

The firmware starts a WiFi access point (`Smart-Reamer`) and listens for WebSocket connections on port 443 with mDNS hostname `smartreamer`.

### Mobile App

1. Install dependencies:

```bash
cd mobile
npm install
```

2. Configure environment variables:

```bash
# Create .env from the example (if available), or set at minimum:
echo "EXPO_PUBLIC_APP_ENV=development" > .env
```

3. Start the development server:

```bash
npm start
```

4. Run on a device or simulator:

```bash
npm run ios       # iOS simulator (requires Xcode)
npm run android   # Android emulator (requires Android Studio)
```

The app requires local network permissions to discover locks via mDNS. On iOS, accept the local network prompt when it appears.

### Backend (Optional)

The backend is a minimal serverless API that stores lock state in Upstash Redis. It's not required for local lock control.

1. Install dependencies:

```bash
cd backend
npm install
```

2. Set Upstash Redis credentials as environment variables (see [Upstash docs](https://upstash.com/docs/redis/overall/getstarted)).

3. Deploy as serverless functions (e.g., Vercel).

## Mobile App Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator/device
npm run type-check     # TypeScript type checking (tsc --noEmit)
npm run lint           # ESLint
npm run lint:fix       # Auto-fix lint issues
npm run format         # Prettier format
npm run format:check   # Check formatting
npm run validate       # Run all checks (type-check + lint + format + i18n)
npm test               # Run tests
npm run test:coverage  # Coverage report
```

## Hardware

The PCB design files are in `boards/schema/` (KiCad format). The hardware uses:

- **ESP32** microcontroller with WiFi
- **Stepper motor** (RS485/UART) for the lock mechanism
- **Magnetic sensor** for lock position detection
- **Physical buttons** for pairing and manual control

## Tech Stack

**Firmware:** C23/C++20, ESP-IDF, CMake + Ninja, mDNS, WebSocket over TLS

**Mobile:** React Native 0.83, Expo SDK 55, TypeScript 5.9, expo-router, react-native-unistyles, TanStack Query, Zustand, react-native-zeroconf, react-native-mmkv

**Backend:** Node.js, Upstash Redis

## Presentation

https://docs.google.com/presentation/d/1CJHD37SnOY2IarPdmYYmFTQDSxiSsTZ49IzXwv2TkE4/edit?usp=sharing
