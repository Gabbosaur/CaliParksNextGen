# Implementation Tasks

## Phase 1: Project Scaffolding & Core Infrastructure

### Task 1: Initialize SvelteKit project with TypeScript and Tailwind
- [x] Create new SvelteKit project with static adapter
- [x] Configure TypeScript (strict mode)
- [x] Install and configure Tailwind CSS with the full M3 color system from ui-reference
- [x] Configure Vite for optimal Raspberry Pi build
- [x] Set up project folder structure as defined in design.md
- [x] Add base layout with fullscreen dark theme, tech-bg grid, scanlines overlay
- [x] Configure path aliases (@lib, @components, etc.)
- [x] Add .gitignore, .prettierrc, eslint config
- [x] Install Google Fonts: Montserrat (700-900+italic), Inter (400-900), JetBrains Mono (600)
- [x] Install Material Symbols Outlined icon font
- [x] Create shared CSS with animations (pulse-glow, data-sweep, float-hud, fade-up, flicker-in, breathe-glow, spin-slow)
- [x] Create reusable HUD overlay component (system status labels in corners)

### Task 2: Define core TypeScript types and interfaces
- [x] Create `src/lib/ml/types.ts` — PoseProvider interface, Keypoint, PoseEstimation, ClassificationResult
- [x] Create `src/lib/exercises/types.ts` — ExerciseConfig, ExercisePhase, GameMode, WorkoutSession, SessionMetrics
- [x] Create `src/lib/hardware/types.ts` — HardwareAction types
- [x] Create `src/lib/sync/types.ts` — SyncQueueItem, ApiClient interface
- [x] Create `src/lib/auth/types.ts` — User, PairingToken types
- [x] Create `src/lib/config/types.ts` — DeviceConfig types

### Task 3: Implement device configuration system
- [x] Create `src/lib/config/device.ts` — device ID, park ID, hardware service URL
- [x] Create `src/lib/config/exercises.ts` — exercise config loader from JSON files
- [x] Create `exercises/pull-up.json` — pull-up exercise configuration
- [x] Support loading config from environment variables or local JSON file
- [x] Validate config on startup, show error screen if invalid

---

## Phase 2: ML Layer (Pose Provider)

### Task 4: Implement PoseProvider interface and factory
- [x] Create `src/lib/ml/pose-provider.ts` — abstract interface definition
- [x] Create `src/lib/ml/provider-factory.ts` — factory that instantiates providers by config string
- [x] Add error handling and fallback logic (try alternative provider on failure)
- [x] Add provider initialization status tracking

### Task 5: Implement Teachable Machine Pose provider
- [x] Create `src/lib/ml/providers/teachable-machine.ts`
- [x] Implement `initialize()` — load model from local path
- [x] Implement `estimatePose()` — run PoseNet estimation, normalize keypoints
- [x] Implement `classify()` — run TM classification, return phase probabilities
- [x] Implement `dispose()` — clean up TF.js tensors
- [x] Copy existing pull-up model files to `static/models/pull-up/`
- [x] Test model loading and inference in browser

---

## Phase 3: Exercise Engine

### Task 6: Implement Exercise Engine core
- [x] Create `src/lib/exercises/exercise-engine.ts`
- [x] Implement phase transition detection with configurable thresholds
- [x] Implement rep counting (detect full phase sequence completion)
- [x] Expose reactive metrics via Svelte writable store
- [x] Support variable number of phases per exercise

### Task 7: Implement AMRAP mode
- [x] Create `src/lib/exercises/modes/amrap.ts`
- [x] Implement countdown timer with decisecond precision
- [x] Integrate with exercise engine for rep counting
- [x] Handle session start/stop lifecycle
- [x] Emit events on rep counted, timer expired

### Task 8: Implement ISO (Isometric Hold) mode
- [x] Create `src/lib/exercises/modes/iso.ts`
- [x] Implement hold detection (enter/exit hold phase)
- [x] Implement centisecond precision stopwatch
- [x] Handle session start/stop lifecycle
- [x] Emit events on hold start, hold end

### Task 9: Implement Exercise Registry
- [ ] Create `src/lib/exercises/registry.ts`
- [ ] Load exercise configs from JSON files at startup
- [ ] Validate exercise configs (required fields, valid phases, valid provider)
- [ ] Expose list of available exercises with their supported modes
- [ ] Map exercise to its PoseProvider instance

---

## Phase 4: Audio & Hardware

### Task 10: Implement Audio Engine
- [x] Create `src/lib/audio/audio-engine.ts` — Web Audio API wrapper
- [x] Create `src/lib/audio/sounds.ts` — sound definitions (rep beep, hold start/stop, countdown warning)
- [x] Implement `playRepSound()`, `playHoldStart()`, `playHoldEnd()`, `playCountdownWarning()`
- [x] Handle AudioContext initialization (user gesture requirement)
- [x] Keep latency <10ms using oscillator approach

### Task 11: Implement Hardware Service client
- [x] Create `src/lib/hardware/hardware-service.ts`
- [x] Implement LED control (on/off) via HTTP PATCH
- [x] Implement audio trigger via HTTP POST
- [x] Implement health check endpoint polling
- [x] Graceful degradation: catch errors silently, log warnings
- [x] Make base URL configurable via device config

---

## Phase 5: UI Components

### Task 12: Implement Webcam component
- [ ] Create `src/lib/components/Webcam.svelte`
- [ ] Setup webcam stream via getUserMedia
- [ ] Render video feed on canvas with cyber frame border (rounded-[32px], primary-container/30 border, pulse-glow)
- [ ] Draw pose skeleton overlay in cyan (#00f0ff) with keypoint circles
- [ ] Support configurable size and flip
- [ ] Handle webcam permission errors gracefully
- [ ] Add scanlines overlay and data-sweep animation on top of feed

### Task 13: Implement Timer and Counter components
- [ ] Create `src/lib/components/Timer.svelte` — large display-xl number with secondary-container glow, "Time Elapsed" label-caps badge
- [ ] Create `src/lib/components/Counter.svelte` — huge display-xl rep number (140px) with primary-container glow, progress bar (segmented arcade style)
- [ ] Create `src/lib/components/HoldTimer.svelte` — stopwatch display (SS.cc format) with breathing glow while active
- [ ] Create `src/lib/components/ConfidenceBars.svelte` — phase confidence indicators (not needed in final HUD per Stitch, but useful for debug)
- [ ] Create `src/lib/components/FormAlert.svelte` — tertiary-colored alert panel with warning icon and message
- [ ] Create `src/lib/components/CalorieCounter.svelte` — small stat panel with fire icon and estimated kcal
- [ ] All components reactive to Svelte stores

### Task 14: Implement selection components
- [ ] Create `src/lib/components/ExerciseCard.svelte` — not used in current Stitch (mode selection is the main screen), but prepare for future exercise grid
- [ ] Create `src/lib/components/GameModeSelector.svelte` — two large full-height cards (AMRAP cyan / ISO lime) with orbiting icon, class badge, description, "Initiate Protocol" CTA
- [ ] Create `src/lib/components/TimerSelector.svelte` — duration chips (30s, 60s, 90s, 120s) shown after AMRAP selection
- [ ] Implement orbital animation on icon circles (spin-slow, orbiting particle dots)
- [ ] Implement hover states: border glow, bg fill, icon translate-y, sweep animation on CTA

### Task 15: Implement Leaderboard component
- [ ] Create `src/lib/components/Leaderboard.svelte`
- [ ] Implement rank row cards (rounded-3xl, avatar, name, location, score)
- [ ] Rank #1: secondary-container accent border + left glow bar + large rank number
- [ ] Current user row: primary-container border-2 + glow shadow + "CURRENT" badge
- [ ] Other ranks: subtle outline-variant border
- [ ] Support filtering by exercise and game mode
- [ ] Support time period tabs (Today, This Week, All-Time) as pill buttons in rounded container
- [ ] Scrollable list with custom cyan scrollbar

### Task 16: Implement QR Code and Pairing components
- [ ] Create `src/lib/components/QRCode.svelte` — renders QR code inside neon-box-glow panel with HUD brackets, coordinate text, "STATUS: LINK ACTIVE" indicator
- [ ] Create `src/lib/components/PairingConfirmation.svelte` — "Is this you?" modal with glassmorphism
- [ ] Auto-refresh QR code on token rotation
- [ ] Implement pulse-breathing animation on QR container

---

## Phase 6: Pages & Navigation

### Task 17: Implement Idle/Welcome page
- [ ] Create `src/routes/+page.svelte` (reference: `ui-reference/welcome.html`)
- [ ] Full dark background with tech-bg grid, scanlines, data-sweep
- [ ] Background image (muted athlete photo, 20% opacity, mix-blend-luminosity)
- [ ] Vignette gradient overlays (from-bottom + radial)
- [ ] Brand header: "CALIPARKS NEXTGEN" in display-xl italic with neon-glow text-shadow
- [ ] Subtitle: "ATHLETE_HUD // V2.4 ONLINE" with decorative lines
- [ ] Two-column glassmorphism panel:
  - Left: "Scan to Login" with QR code (neon-box-glow, pulse-breathing, HUD brackets)
  - Right: "No App?" guest mode with "Protocol: Guest" button (primary-container, rocket_launch icon)
- [ ] "Touch Anywhere to Start" CTA at bottom with pulse-slow animation
- [ ] Touch ripple effect on body click
- [ ] Auto-return to idle after inactivity timeout

### Task 18: Implement Exercise & Mode Selection page
- [ ] Create `src/routes/select/+page.svelte` (reference: `ui-reference/mode-selection.html`)
- [ ] "SELECT MODE" display-xl header with pulse-glow
- [ ] "Protocol Initialization Required" subtitle with decorative lines
- [ ] Two full-height mode cards side by side (flex-row, 600px height):
  - AMRAP card: primary-container theme, fitness_center icon, "Rep King" subtitle, orbiting particle
  - ISO card: secondary-container theme, accessibility_new icon, "Isometric" subtitle, reverse orbit
- [ ] Each card: class badge (Dynamic/Static), large icon circle with hover glow, description, "Initiate Protocol" rounded-full CTA
- [ ] Ambient background lighting (blurred circles)
- [ ] HUD corner overlays (coordinates, system status)
- [ ] Fade-up entrance animations with stagger delays

### Task 19: Implement Active Session page
- [ ] Create `src/routes/session/+page.svelte` (reference: `ui-reference/live-hud.html`)
- [ ] Full-screen webcam feed as background (inset-4, rounded-[32px] cyber frame)
- [ ] Skeleton overlay rendered on canvas (SVG lines + circles in cyan)
- [ ] HUD layout: main area is pointer-events-none, panels are pointer-events-auto
- [ ] Top-left: Form Alert panel (tertiary-fixed-dim border, warning icon, message)
- [ ] Top-right: Timer panel (secondary-container border, display-xl time, "Time Elapsed" badge)
- [ ] Bottom-left: Calorie stat panel (fire icon, display-lg number)
- [ ] Bottom-right: Rep Counter panel (primary-container border, display-xl 140px number, "/ X REPS" target, segmented progress bar)
- [ ] Handle AMRAP and ISO mode rendering differences
- [ ] "STOP" button accessible somewhere (or session ends automatically)
- [ ] Trigger audio and hardware on events

### Task 20: Implement Results page
- [ ] Create `src/routes/results/+page.svelte` (reference: `ui-reference/session-results.html`)
- [ ] "SESSION COMPLETE" display-xl with flicker-in animation
- [ ] "NEW PERSONAL BEST!" badge with emoji_events icon (if applicable)
- [ ] Three stat cards in a row (scale-up-fade with stagger):
  - Time Active (timer icon, primary color)
  - Total Reps/Hold Time (hero card, secondary-container, elevated with -translate-y-4, "Top X% Today" badge)
  - Calories (fire icon, primary color)
- [ ] Each card shows "+X vs avg" comparison
- [ ] Two action buttons: "Leaderboard" (primary outline) and "Done" (secondary, breathe-glow)
- [ ] CRT ripple overlay, ambient particles, ambient lighting
- [ ] Guest prompt to download app (if guest mode)
- [ ] Navigate back to idle after timeout

### Task 21: Implement Leaderboard page
- [ ] Create `src/routes/leaderboard/+page.svelte` (reference: `ui-reference/leaderboard.html`)
- [ ] Side navigation (320px, fixed left) with Workout/Leaderboard/Profile items + QUICK START button
- [ ] Top app bar (fixed, blurred, logo + action buttons + "End Session")
- [ ] "GLOBAL RANKINGS" display-xl header with park location subtitle
- [ ] Filter tabs (Today/This Week/All-Time) in pill container
- [ ] Leaderboard list with rank cards (fade-up staggered)
- [ ] Current user row highlighted with primary-container glow
- [ ] Custom scrollbar styling (cyan themed)

---

## Phase 7: State Management & Data Persistence

### Task 22: Implement Svelte stores
- [ ] Create `src/lib/stores/session.ts` — active workout session state
- [ ] Create `src/lib/stores/user.ts` — current user (guest or authenticated)
- [ ] Create `src/lib/stores/leaderboard.ts` — leaderboard data cache
- [ ] Create `src/lib/stores/device.ts` — device/park config store

### Task 23: Implement Sync Queue (offline-first)
- [ ] Create `src/lib/sync/sync-queue.ts` — IndexedDB-backed queue using `idb` library
- [ ] Implement `enqueue(session)`, `dequeue()`, `peek()`, `getAll()`
- [ ] Persist across page reloads and device restarts
- [ ] Assign UUID to each session at creation time

### Task 24: Implement Sync Manager
- [ ] Create `src/lib/sync/sync-manager.ts`
- [ ] Background sync: check connectivity, transmit queued sessions
- [ ] Retry logic with 30s backoff on failure
- [ ] Deduplicate on backend (idempotent by session UUID)
- [ ] Create `src/lib/sync/api-client.ts` — abstract backend API client

---

## Phase 8: Authentication & QR Pairing

### Task 25: Implement QR Manager
- [ ] Create `src/lib/auth/qr-manager.ts`
- [ ] Generate pairing tokens (crypto.randomUUID or similar)
- [ ] Rotate token every 15-20 seconds
- [ ] Invalidate token after single use
- [ ] Interface with backend to register/validate tokens

### Task 26: Implement Session/User management
- [ ] Create `src/lib/auth/session.ts`
- [ ] Handle guest mode (no auth, local-only)
- [ ] Handle authenticated mode (user info from backend after QR pairing)
- [ ] Physical confirmation flow (show name, wait for touch)
- [ ] Session timeout and return to guest/idle

---

## Phase 9: Backend (Supabase)

### Task 27: Set up Supabase project
- [ ] Create Supabase project
- [ ] Run database schema (tables from design.md)
- [ ] Configure Row Level Security policies
- [ ] Enable Supabase Auth (email/password)
- [ ] Configure Realtime for challenges table

### Task 28: Implement Backend API (Edge Functions or client SDK)
- [ ] Session sync endpoint (POST /sessions)
- [ ] Pairing token endpoints (POST /pairing/token, POST /pairing/confirm, GET /pairing/status)
- [ ] Leaderboard queries (per-park, global, by exercise/mode/period)
- [ ] User profile and level calculation
- [ ] Park and device registration

### Task 29: Implement real-time challenges (predisposition)
- [ ] Challenge creation and matchmaking logic
- [ ] Real-time score relay via Supabase Realtime subscriptions
- [ ] Challenge lifecycle (pending → active → completed/cancelled)
- [ ] Level check before allowing challenge participation

---

## Phase 10: Hardware Service (Raspberry Pi)

### Task 30: Implement FastAPI hardware service
- [ ] Create `hardware-service/main.py` — FastAPI app
- [ ] Implement GPIO control endpoints (LED on/off)
- [ ] Implement audio playback endpoint
- [ ] Add CORS middleware
- [ ] Add health check endpoint
- [ ] Externalize config (port, GPIO pins) to JSON file
- [ ] Create systemd service file
- [ ] Create requirements.txt

---

## Phase 11: Integration & Deployment

### Task 31: End-to-end integration
- [ ] Wire Kiosk_App to Hardware Service (LED + audio on rep/hold)
- [ ] Wire Kiosk_App to Backend (sync sessions, fetch leaderboard)
- [ ] Wire QR pairing flow end-to-end
- [ ] Test offline mode (disconnect network, verify queue + local operation)
- [ ] Test full session lifecycle (idle → select → session → results → idle)

### Task 32: Raspberry Pi deployment setup
- [ ] Create deployment script (install deps, copy files, configure services)
- [ ] Configure Chromium kiosk mode (fullscreen, no cursor, disable shortcuts)
- [ ] Configure nginx to serve static SvelteKit build
- [ ] Configure auto-start on boot (systemd)
- [ ] Test on actual Raspberry Pi 4/5 hardware

### Task 33: Performance optimization
- [ ] Measure FPS on Raspberry Pi, optimize if <15 FPS
- [ ] Optimize TF.js backend selection (WebGL vs CPU)
- [ ] Minimize bundle size (tree-shaking, code splitting)
- [ ] Lazy-load models only when exercise is selected
- [ ] Profile memory usage, fix leaks if any
