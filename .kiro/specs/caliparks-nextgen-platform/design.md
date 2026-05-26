# Technical Design Document

## System Architecture Overview

CaliParksNextGen is a distributed system with three main components communicating via REST APIs and WebSockets:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLOUD (Backend)                              │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │ Auth API │  │ Sessions API │  │ Parks API  │  │ WebSocket   │  │
│  │          │  │              │  │            │  │ (Challenges)│  │
│  └────┬─────┘  └──────┬───────┘  └─────┬──────┘  └──────┬──────┘  │
│       │                │                │                │          │
│       └────────────────┴────────────────┴────────────────┘          │
│                              │                                      │
│                    ┌─────────┴─────────┐                            │
│                    │    Database        │                            │
│                    │   (PostgreSQL)     │                            │
│                    └───────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
          ▲                                          ▲
          │ REST + WebSocket                         │ REST
          ▼                                          ▼
┌─────────────────────────┐              ┌─────────────────────────┐
│   Kiosk_Device (Park)   │              │      Mobile_App         │
│                         │              │   (separate repo)       │
│  ┌───────────────────┐  │              └─────────────────────────┘
│  │   Kiosk_App       │  │
│  │   (SvelteKit)     │  │
│  └────────┬──────────┘  │
│           │ HTTP local   │
│  ┌────────┴──────────┐  │
│  │  Hardware Service │  │
│  │  (FastAPI/Python) │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## Component 1: Kiosk App (This Repository — Primary Focus)

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | SvelteKit (static adapter) | Lightweight, fast runtime, minimal JS bundle for Raspberry Pi |
| Language | TypeScript | Type safety, better DX, refactoring confidence |
| Build | Vite | Fast builds, HMR, native to SvelteKit |
| ML Runtime | TensorFlow.js | Mature browser ML, supports WebGL acceleration |
| Audio | Web Audio API | Native, no dependencies, low latency |
| State | Svelte stores | Built-in reactivity, no extra library needed |
| Styling | Tailwind CSS | Utility-first, consistent design system, small bundle with purge |
| Fonts | Montserrat (display), Inter (body), JetBrains Mono (HUD labels) | Per Stitch UI prototypes and PRD |
| Icons | Google Material Symbols Outlined | Variable weight/fill, comprehensive icon set |
| QR Generation | qrcode (npm) | Lightweight, no external service needed |
| Local Storage | IndexedDB (via idb) | Structured storage for Sync_Queue, survives restarts |
| Deployment | Chromium kiosk mode | Fullscreen, no browser chrome, auto-start on boot |

### Project Structure

```
kiosk-app/
├── src/
│   ├── lib/
│   │   ├── components/          # UI Components
│   │   │   ├── Webcam.svelte
│   │   │   ├── Timer.svelte
│   │   │   ├── Counter.svelte
│   │   │   ├── ConfidenceBars.svelte
│   │   │   ├── Leaderboard.svelte
│   │   │   ├── QRCode.svelte
│   │   │   ├── ExerciseCard.svelte
│   │   │   ├── GameModeSelector.svelte
│   │   │   └── PairingConfirmation.svelte
│   │   │
│   │   ├── ml/                  # ML Layer (Agnostic)
│   │   │   ├── types.ts                 # PoseProvider interface, Keypoint types
│   │   │   ├── pose-provider.ts         # Abstract PoseProvider contract
│   │   │   ├── providers/
│   │   │   │   ├── teachable-machine.ts # TM Pose implementation
│   │   │   │   ├── movenet.ts           # MoveNet implementation (future)
│   │   │   │   └── blazepose.ts         # BlazePose implementation (future)
│   │   │   └── provider-factory.ts      # Factory to instantiate providers by config
│   │   │
│   │   ├── exercises/           # Exercise Engine
│   │   │   ├── types.ts                 # Exercise config types
│   │   │   ├── exercise-engine.ts       # Core counting/detection logic
│   │   │   ├── modes/
│   │   │   │   ├── amrap.ts             # AMRAP mode logic
│   │   │   │   └── iso.ts              # Isometric hold logic
│   │   │   └── registry.ts             # Exercise registry (loads from config)
│   │   │
│   │   ├── audio/               # Sound Engine
│   │   │   ├── audio-engine.ts          # Web Audio API wrapper
│   │   │   └── sounds.ts               # Sound definitions (rep, hold, countdown)
│   │   │
│   │   ├── hardware/            # IoT Communication
│   │   │   ├── hardware-service.ts      # HTTP client for Raspberry Pi service
│   │   │   └── types.ts                 # Hardware action types
│   │   │
│   │   ├── sync/                # Data Synchronization
│   │   │   ├── sync-queue.ts            # IndexedDB-backed queue
│   │   │   ├── sync-manager.ts          # Background sync logic
│   │   │   └── api-client.ts            # Backend API client (abstract)
│   │   │
│   │   ├── auth/                # Authentication
│   │   │   ├── qr-manager.ts            # QR code generation + token rotation
│   │   │   └── session.ts              # Current user session state
│   │   │
│   │   ├── stores/              # Svelte Stores (Global State)
│   │   │   ├── session.ts              # Active workout session state
│   │   │   ├── user.ts                 # Current user (guest or authenticated)
│   │   │   ├── leaderboard.ts          # Leaderboard data
│   │   │   └── device.ts              # Device/park configuration
│   │   │
│   │   └── config/              # Configuration
│   │       ├── device.ts               # Device ID, park ID, hardware IP
│   │       └── exercises.ts            # Exercise definitions loader
│   │
│   ├── routes/                  # SvelteKit Pages
│   │   ├── +layout.svelte              # Root layout (fullscreen, dark theme)
│   │   ├── +page.svelte                # Idle/Welcome screen
│   │   ├── select/
│   │   │   └── +page.svelte            # Exercise + mode selection
│   │   ├── session/
│   │   │   └── +page.svelte            # Active workout session
│   │   ├── results/
│   │   │   └── +page.svelte            # Session results
│   │   └── leaderboard/
│   │       └── +page.svelte            # Full leaderboard view
│   │
│   └── static/
│       ├── models/              # ML Models (one folder per exercise)
│       │   └── pull-up/
│       │       ├── model.json
│       │       ├── metadata.json
│       │       └── weights.bin
│       └── fonts/
│
├── exercises/                   # Exercise Configuration (JSON)
│   ├── pull-up.json
│   ├── push-up.json
│   └── dip.json
│
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### Key Interfaces

#### PoseProvider Interface (ML Agnostic Layer)

```typescript
// src/lib/ml/types.ts

interface Keypoint {
  name: string;          // e.g., "left_shoulder", "right_hip"
  x: number;            // normalized 0-1
  y: number;            // normalized 0-1
  confidence: number;   // 0-1
}

interface PoseEstimation {
  keypoints: Keypoint[];
  confidence: number;   // overall pose confidence
  timestamp: number;
}

interface ClassificationResult {
  className: string;    // e.g., "pu-start", "pu-end"
  probability: number;  // 0-1
}

interface PoseProvider {
  /** Initialize the provider, load model weights */
  initialize(modelPath: string): Promise<void>;

  /** Run pose estimation on a video frame */
  estimatePose(frame: HTMLCanvasElement | HTMLVideoElement): Promise<PoseEstimation>;

  /** Classify the pose into exercise phases (if supported) */
  classify(poseData: PoseEstimation): Promise<ClassificationResult[]>;

  /** Clean up resources */
  dispose(): void;

  /** Provider name for logging/debugging */
  readonly name: string;
}
```

#### Exercise Configuration

```typescript
// src/lib/exercises/types.ts

interface ExercisePhase {
  name: string;              // e.g., "pu-start"
  label: string;             // e.g., "Pull up - Start" (display)
  confidenceThreshold: number; // e.g., 0.95
}

interface ExerciseConfig {
  id: string;                // e.g., "pull-up"
  name: string;              // e.g., "Pull Up"
  icon: string;              // icon identifier or path
  phases: ExercisePhase[];
  supportedModes: GameMode[];  // ["amrap", "iso"] or ["amrap"]
  
  // AMRAP config
  repSequence: string[];     // phase sequence that counts as 1 rep, e.g., ["pu-start", "pu-end"]
  
  // ISO config (optional)
  holdPhase?: string;        // which phase = "holding", e.g., "pu-end"
  
  // ML config
  poseProvider: string;      // provider ID, e.g., "teachable-machine"
  modelPath: string;         // relative path to model files
}

type GameMode = "amrap" | "iso";

interface WorkoutSession {
  id: string;                // UUID, generated at creation
  exerciseId: string;
  gameMode: GameMode;
  userId: string | null;     // null for guest
  parkId: string;
  deviceId: string;
  startedAt: string;         // ISO timestamp
  endedAt: string;           // ISO timestamp
  result: {
    reps?: number;           // for AMRAP
    holdTimeMs?: number;     // for ISO (milliseconds)
  };
  timerDurationSec?: number; // for AMRAP
  synced: boolean;
}
```

#### Exercise Engine (Mode Logic)

```typescript
// src/lib/exercises/exercise-engine.ts

interface ExerciseEngine {
  /** Start a session with given exercise and mode */
  start(exercise: ExerciseConfig, mode: GameMode): void;

  /** Process a new classification result from the pose provider */
  processClassification(results: ClassificationResult[]): void;

  /** Get current session metrics (reactive via Svelte store) */
  readonly metrics: Readable<SessionMetrics>;

  /** Stop the session and return final results */
  stop(): WorkoutSession;
}

interface SessionMetrics {
  reps: number;
  holdTimeMs: number;
  isHolding: boolean;
  currentPhase: string | null;
  phaseConfidences: Map<string, number>;
}
```

---

## Component 2: Hardware Service (Raspberry Pi)

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | FastAPI (Python) | Lightweight, async, easy GPIO access |
| GPIO | RPi.GPIO or gpiozero | Standard Raspberry Pi GPIO control |
| Audio | pygame.mixer | Simple audio playback |
| Process Manager | systemd | Auto-start on boot, restart on crash |

### API Endpoints

```
GET  /health                    → { "status": "ok", "device_id": "..." }
PATCH /gpio/{pin}               → { "on": bool } → controls LED
POST /audio/play                → { "sound": "rep" | "hold_start" | "hold_end" }
GET  /config                    → returns current hardware config
```

### Deployment

- Runs as a systemd service on the Raspberry Pi
- Listens on `localhost:8123` (or configurable port)
- CORS enabled for local Kiosk_App requests
- Config file: `/etc/caliparks/hardware.json`

---

## Component 3: Backend (Cloud)

### Tech Stack (Free Tier Optimized)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | Node.js + Express (or Hono) | Lightweight, JS ecosystem consistency |
| Database | Supabase (PostgreSQL) | Free tier generous, real-time subscriptions, auth built-in |
| Auth | Supabase Auth | Free, handles JWT, email/password, social login |
| Real-time | Supabase Realtime (WebSocket) | Built-in, no extra infra for challenges |
| Hosting | Supabase Edge Functions or Railway free tier | Serverless, auto-scale |
| Alternative | Firebase (Firestore + Auth + Functions) | If Supabase limits are hit |

### Database Schema (PostgreSQL)

```sql
-- Parks
CREATE TABLE parks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location POINT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Devices
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID REFERENCES parks(id),
  name TEXT,
  status TEXT DEFAULT 'offline', -- 'online' | 'offline'
  last_seen_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}'
);

-- Users (managed by Supabase Auth, extended here)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_reps INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY,  -- generated by kiosk
  user_id UUID REFERENCES user_profiles(id),
  park_id UUID REFERENCES parks(id),
  device_id UUID REFERENCES devices(id),
  exercise_id TEXT NOT NULL,
  game_mode TEXT NOT NULL, -- 'amrap' | 'iso'
  reps INTEGER,
  hold_time_ms INTEGER,
  timer_duration_sec INTEGER,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboards (materialized view or table updated on session insert)
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  park_id UUID REFERENCES parks(id), -- NULL for global
  exercise_id TEXT NOT NULL,
  game_mode TEXT NOT NULL,
  score INTEGER NOT NULL, -- reps for AMRAP, hold_time_ms for ISO
  period TEXT NOT NULL, -- 'daily' | 'weekly' | 'alltime'
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, park_id, exercise_id, game_mode, period)
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id TEXT NOT NULL,
  game_mode TEXT NOT NULL,
  timer_duration_sec INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'active' | 'completed' | 'cancelled'
  winner_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Challenge Participants
CREATE TABLE challenge_participants (
  challenge_id UUID REFERENCES challenges(id),
  user_id UUID REFERENCES user_profiles(id),
  park_id UUID REFERENCES parks(id),
  device_id UUID REFERENCES devices(id),
  score INTEGER DEFAULT 0,
  PRIMARY KEY (challenge_id, user_id)
);

-- Level Thresholds (config table)
CREATE TABLE level_thresholds (
  level INTEGER PRIMARY KEY,
  min_total_reps INTEGER NOT NULL,
  unlocks_challenges BOOLEAN DEFAULT false
);
```

### API Routes

```
POST   /auth/register           → create account
POST   /auth/login              → get JWT token

GET    /parks                   → list parks
GET    /parks/:id/leaderboard   → park leaderboard

POST   /sessions                → sync workout session from kiosk
GET    /sessions/me             → user's workout history

POST   /pairing/token           → generate QR pairing token (kiosk calls this)
POST   /pairing/confirm         → mobile app confirms scan
GET    /pairing/status/:token   → kiosk polls for pairing result

POST   /challenges              → initiate a challenge
GET    /challenges/available     → find available opponents
WS     /challenges/:id/live     → real-time score relay

GET    /users/me                → user profile + level
GET    /leaderboard/global      → global rankings
```

---

## Data Flow Diagrams

### Workout Session (AMRAP)

```
User selects exercise + AMRAP mode + timer duration
         │
         ▼
┌─ Kiosk_App ──────────────────────────────────────┐
│  1. Load PoseProvider for exercise                │
│  2. Start webcam                                  │
│  3. Start countdown timer                         │
│  4. Loop:                                         │
│     a. Capture frame                              │
│     b. PoseProvider.estimatePose(frame)           │
│     c. PoseProvider.classify(pose)                │
│     d. ExerciseEngine.processClassification()     │
│     e. If rep detected → increment counter        │
│        → play audio → trigger LED                 │
│     f. Update UI (counter, bars, skeleton)        │
│  5. Timer expires → stop session                  │
│  6. Save to IndexedDB (Sync_Queue)                │
│  7. If online → sync to Backend                   │
└──────────────────────────────────────────────────┘
```

### QR Code Pairing

```
┌─ Kiosk_App ─┐        ┌─ Backend ─┐        ┌─ Mobile_App ─┐
│              │        │           │        │              │
│ Generate     │        │           │        │              │
│ token every  │───────▶│ Store     │        │              │
│ 15-20s       │ POST   │ token     │        │              │
│              │/pairing│           │        │              │
│ Display QR   │        │           │        │              │
│              │        │           │        │ User scans   │
│              │        │           │◀───────│ QR code      │
│              │        │           │ POST   │              │
│              │        │ Validate  │/pairing│              │
│              │        │ + match   │/confirm│              │
│ Poll status  │───────▶│           │        │              │
│              │ GET    │ Return    │        │              │
│              │/status │ user info │        │              │
│              │        │           │        │              │
│ Show "Is     │        │           │        │              │
│ this you?"   │        │           │        │              │
│              │        │           │        │              │
│ User taps    │───────▶│ Confirm   │        │              │
│ YES          │ POST   │ pairing   │        │              │
│              │/confirm│           │        │              │
│ Session      │        │           │        │              │
│ linked ✓     │        │           │        │              │
└──────────────┘        └───────────┘        └──────────────┘
```

---

## Deployment Architecture

### Kiosk Device (Raspberry Pi)

```
┌─ Raspberry Pi 4/5 ──────────────────────────────┐
│                                                  │
│  ┌─ systemd services ────────────────────────┐   │
│  │                                           │   │
│  │  chromium-kiosk.service                   │   │
│  │  → Chromium --kiosk http://localhost:3000  │   │
│  │                                           │   │
│  │  kiosk-app.service                        │   │
│  │  → serves SvelteKit static build (nginx)  │   │
│  │                                           │   │
│  │  hardware-service.service                 │   │
│  │  → FastAPI on port 8123                   │   │
│  │                                           │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌─ Hardware ────────────────────────────────┐   │
│  │  USB Webcam                               │   │
│  │  GPIO → LED strip                         │   │
│  │  3.5mm audio out → speaker                │   │
│  │  Touchscreen (HDMI + USB touch)           │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌─ Network ─────────────────────────────────┐   │
│  │  WiFi / 4G dongle → Backend sync          │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### Setup Script (conceptual)

```bash
# Install dependencies
sudo apt update && sudo apt install -y chromium-browser nginx python3-pip

# Deploy kiosk app (static files)
cp -r kiosk-app/build/* /var/www/caliparks/

# Deploy hardware service
pip3 install fastapi uvicorn RPi.GPIO pygame
cp hardware-service/ /opt/caliparks/hardware/

# Configure systemd services
sudo systemctl enable chromium-kiosk hardware-service nginx
sudo systemctl start chromium-kiosk hardware-service nginx
```

---

## Key Design Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|------------------------|-----------|
| Frontend framework | SvelteKit | React, Vue, vanilla | Smallest runtime bundle, best perf on Pi |
| ML runtime | TensorFlow.js (browser) | TFLite (Python), ONNX | Stays in browser, no IPC overhead, WebGL accel |
| Backend | Supabase | Firebase, custom Node | Free tier, PostgreSQL, built-in auth + realtime |
| Local storage | IndexedDB | localStorage, SQLite | Structured data, larger capacity, async |
| Styling | Tailwind CSS | CSS modules, styled-components | Consistent design tokens, small purged bundle |
| QR library | qrcode (npm) | external service | Offline-capable, no network dependency |
| State management | Svelte stores | Redux, Zustand | Native to Svelte, zero overhead |
| Hardware comm | HTTP (local) | WebSocket, GPIO direct | Decoupled, testable without hardware |

---

## Performance Considerations

- **ML Inference**: Target ≥15 FPS. TensorFlow.js with WebGL backend on Raspberry Pi 4 achieves ~20 FPS with MobileNetV1 (257px input). If insufficient, fall back to CPU backend with reduced input resolution.
- **Bundle Size**: SvelteKit + Tailwind purged CSS → estimated <200KB gzipped (excluding TF.js which is loaded separately).
- **Memory**: TF.js model + webcam + canvas ≈ 200-300MB RAM. Raspberry Pi 4 (4GB) has plenty of headroom.
- **Startup**: Model loading is the bottleneck (~3-5s). Show loading animation during init.
- **Audio Latency**: Web Audio API oscillator approach (current) has <10ms latency. Keep it.

---

## Design System: Cyber-Arcade Kinetic System

The UI follows the "Cyber-Athletic" aesthetic defined in the PRD and validated through Stitch UI prototypes (see `ui-reference/` folder). The system uses a Material Design 3 extended color scheme with neon accents.

### Color System (Material Design 3 Extended)

The full color palette is derived from the Stitch prototypes. Key tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #e1fdff | Primary text on dark surfaces |
| `primary-container` | #00f2ff (Cyan Elettrico) | Primary actions, glow effects, active borders, skeleton overlay |
| `primary-fixed-dim` | #00dbe7 | Dimmed primary for labels, HUD text |
| `secondary-container` | #c3f400 (Verde Acido) | Success/accent, ISO mode color, rep achievements |
| `secondary-fixed` | #c3f400 | Leaderboard #1 highlight |
| `tertiary-fixed-dim` | #d1bcff (Viola) | Form alerts, calorie stats, warnings |
| `surface` | #111318 | Main background |
| `surface-container-low` | #1a1c20 | Card backgrounds, panels |
| `surface-container-lowest` | #0c0e12 | Deepest background layer |
| `on-surface` | #e2e2e8 | Primary text |
| `on-surface-variant` | #b9cacb | Secondary text, labels |
| `outline-variant` | #3a494b | Subtle borders |
| `error` | #ffb4ab | Error states |

### Typography

| Role | Font | Sizes | Usage |
|------|------|-------|-------|
| Display XL | Montserrat (italic, 900) | 120px/-0.04em | Page titles ("SESSION COMPLETE", "SELECT MODE") |
| Display LG | Montserrat (italic, 800) | 80px/-0.02em | Large stats, timer, rep counter |
| Headline LG | Montserrat (700) | 48px | Section headers |
| Headline MD | Montserrat (700) | 32px | Card titles, form alerts |
| Label XL | Inter (700) | 20px/0.1em | Buttons, badges, uppercase labels |
| Label Caps | JetBrains Mono (600) | 12px/0.1em | HUD micro-labels, status indicators |
| Body LG | Inter (500) | 24px | Descriptions, secondary text |
| Body MD | Inter/Lexend (400) | 18px | Body text |
| Stats Num | Montserrat (800) | 64px | Numeric stats |

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro gaps |
| `sm` | 12px | Tight spacing, HUD elements |
| `md` | 24px | Standard padding |
| `lg` | 48px | Section gaps |
| `xl` | 80px | Major section separation |
| `safe-margin` | 64px | Page edge padding (kiosk safe area) |
| `touch-target-min` | 72px | Minimum touch target size |

### Shape Language

- **Border radius**: Cards use `rounded-3xl` (24px) or `rounded-[32px]` for large panels
- **Buttons**: `rounded-full` (pill shape) for primary actions
- **HUD corners**: Decorative corner brackets (2px borders, positioned absolute)
- **Neon borders**: 2px solid with color glow (`box-shadow: 0 0 20px rgba(...)`)

### Visual Effects & Overlays

1. **Tech Grid Background**: 40x40px grid lines at 5% opacity (`tech-bg` class)
2. **Scanlines**: 4px repeating gradient overlay, `mix-blend-overlay`
3. **Data Sweep**: Full-height gradient that animates vertically (8s loop)
4. **Ambient Lighting**: Large blurred circles (800px, `blur-[150px]`) with `mix-blend-screen`
5. **CRT Ripple**: Subtle RGB shift + scanline animation on results page
6. **Particles**: Floating dots on celebratory screens

### Animation System

| Animation | Duration | Usage |
|-----------|----------|-------|
| `pulse-glow` | 4s ease-in-out | Breathing opacity on active elements |
| `data-sweep` | 8s linear | Vertical scan line across screen |
| `float-hud` | 6s ease-in-out | Subtle float on HUD labels |
| `fade-up` | 1s cubic-bezier | Page entry animations (staggered with delays) |
| `flicker-in` | 0.8s | CRT-style text appearance (results page) |
| `scale-up-fade` | 0.8s | Card entrance with scale |
| `breathe-glow` | 3s | Box-shadow pulse on highlighted buttons |
| `spin-slow` | 12s linear | Orbiting particles on mode selection |

Stagger delays: `.delay-100` through `.delay-500` (100ms increments)

### Glassmorphism Panels

```css
.glass-panel {
  background: rgba(28, 27, 28, 0.8); /* surface-container-low/80 */
  backdrop-filter: blur(12px);
  border: 2px solid rgba(0, 242, 255, 0.2); /* primary-container/20 */
  border-radius: 24px;
}
```

### Component Patterns (from Stitch references)

1. **HUD Overlays**: Fixed-position micro-labels (10px, JetBrains Mono, uppercase, tracking-widest) showing system status, coordinates
2. **Neon Box Glow**: `box-shadow: 0 0 20px rgba(0, 242, 255, 0.3), inset 0 0 10px rgba(0, 242, 255, 0.2)` + `border: 2px solid rgba(0, 242, 255, 0.5)`
3. **Action Buttons**: Full-width pill buttons with border-2, hover fills with color, sweep animation overlay (`translate-x` white/20 gradient)
4. **Stat Cards**: Glassmorphism panel + icon + label-caps header + large display number + comparison badge
5. **Leaderboard Rows**: Rounded-3xl cards with rank number, avatar, name, location, score. #1 gets secondary-container accent, current user gets primary-container glow border
6. **Mode Selection Cards**: Full-height cards with orbiting icon circle, class badge, description, and "Initiate Protocol" CTA

### Navigation (Leaderboard/Full App)

- **Top App Bar**: Fixed, blurred background, logo left, action buttons right
- **Side Nav**: Fixed left, 320px wide, rounded-r-3xl, with icon+label nav items and "QUICK START" CTA at bottom
- **Active nav item**: `bg-primary-container/10 border border-primary-container` with left accent bar

### Tailwind Config (from Stitch prototypes)

```javascript
// tailwind.config.js — key extensions from ui-reference
theme: {
  extend: {
    colors: {
      "primary": "#e1fdff",
      "primary-container": "#00f2ff",
      "primary-fixed": "#74f5ff",
      "primary-fixed-dim": "#00dbe7",
      "on-primary": "#00363a",
      "on-primary-container": "#006a71",
      "secondary": "#ffffff",
      "secondary-container": "#c3f400",
      "secondary-fixed": "#c3f400",
      "secondary-fixed-dim": "#abd600",
      "on-secondary": "#283500",
      "on-secondary-container": "#556d00",
      "tertiary": "#fff6f1",
      "tertiary-container": "#ffd3af",
      "tertiary-fixed-dim": "#ffb778",
      "surface": "#111318",
      "surface-dim": "#111318",
      "surface-container-lowest": "#0c0e12",
      "surface-container-low": "#1a1c20",
      "surface-container": "#1e2024",
      "surface-container-high": "#282a2e",
      "surface-container-highest": "#333539",
      "surface-variant": "#333539",
      "on-surface": "#e2e2e8",
      "on-surface-variant": "#b9cacb",
      "outline": "#849495",
      "outline-variant": "#3a494b",
      "error": "#ffb4ab",
      "error-container": "#93000a",
      "background": "#111318",
      "on-background": "#e2e2e8",
    },
    spacing: {
      "touch-target-min": "72px",
      "base": "8px",
      "xs": "4px",
      "sm": "12px",
      "md": "24px",
      "lg": "48px",
      "safe-margin": "64px",
      "xl": "80px",
    },
    fontFamily: {
      "display-xl": ["Montserrat"],
      "display-lg": ["Montserrat"],
      "headline-lg": ["Montserrat"],
      "headline-md": ["Montserrat"],
      "stats-num": ["Montserrat"],
      "label-xl": ["Inter"],
      "label-caps": ["JetBrains Mono"],
      "body-lg": ["Inter"],
      "body-md": ["Inter"],
    },
    fontSize: {
      "display-xl": ["120px", { lineHeight: "110px", letterSpacing: "-0.04em", fontWeight: "900" }],
      "display-lg": ["80px", { lineHeight: "88px", letterSpacing: "-0.02em", fontWeight: "800" }],
      "headline-lg": ["48px", { lineHeight: "56px", fontWeight: "700" }],
      "headline-md": ["32px", { lineHeight: "40px", fontWeight: "700" }],
      "stats-num": ["64px", { lineHeight: "64px", fontWeight: "800" }],
      "label-xl": ["20px", { lineHeight: "24px", letterSpacing: "0.1em", fontWeight: "700" }],
      "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
      "body-lg": ["24px", { lineHeight: "32px", fontWeight: "500" }],
      "body-md": ["18px", { lineHeight: "26px", fontWeight: "400" }],
    },
    borderRadius: {
      "DEFAULT": "0.25rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "3xl": "24px",
      "full": "9999px",
    },
  },
}
```

### Icon System

- **Google Material Symbols Outlined** (variable weight/fill)
- Key icons used: `fitness_center`, `accessibility_new`, `timer`, `local_fire_department`, `leaderboard`, `emoji_events`, `military_tech`, `rocket_launch`, `touch_app`, `smartphone`, `bolt`, `person`, `map`, `trending_up`, `arrow_upward`, `check_circle`, `warning`, `signal_cellular_alt`, `account_circle`
- Fill variant (`font-variation-settings: 'FILL' 1`) for active/emphasized icons

### Fonts to Include

1. **Montserrat** (700, 800, 900 + italic variants) — Display/Headlines
2. **Inter** (400, 500, 700, 900) — Body/Labels
3. **JetBrains Mono** (600) — HUD micro-labels
4. **Anybody** (700, 800) — Alternative headline (per PRD, used in some HUD contexts)

---

## Security Considerations

- QR tokens: HMAC-signed, 15-20s expiry, single-use
- Backend API: JWT auth for all authenticated endpoints
- Hardware service: localhost only, no external exposure
- Kiosk mode: disable keyboard shortcuts, right-click, dev tools
- Data in transit: HTTPS for all backend communication
- Passwords: bcrypt via Supabase Auth (industry standard)
