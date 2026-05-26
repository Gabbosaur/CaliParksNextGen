# Requirements Document

## Introduction

CaliParksNextGen is a distributed platform that transforms public calisthenics workout parks into connected, interactive fitness environments. The platform restructures an existing single-page web app (webcam-based pull-up counter using TensorFlow.js) into a multi-component system consisting of IoT kiosk devices installed in parks, a cloud backend for data persistence and user management, and a mobile app for user engagement. The system enables ML-powered exercise counting, cross-park competitions, leaderboards, and gamified progression through a level system.

### Scope

This repository contains the **Kiosk_App** and **Backend** implementations. Requirements referencing the Mobile_App define the backend API contracts and expected interaction patterns that the backend must support. The Mobile_App implementation resides in a separate repository and is out of scope for this codebase. Requirements marked with *[Interface Requirement]* specify behavior that the Backend must enable but whose client-side implementation belongs to the Mobile_App repository.

## Glossary

- **Kiosk_Device**: A Raspberry Pi-based hardware unit with screen and webcam installed at a calisthenics park, running a local web application in Chromium kiosk mode
- **Kiosk_App**: The SvelteKit web application running locally on the Kiosk_Device, responsible for ML pose detection, exercise counting, and user interaction
- **Mobile_App**: The mobile application used by registered users to manage profiles, view history, scan QR codes, and participate in challenges
- **Backend**: The cloud-based server infrastructure handling authentication, data persistence, park management, leaderboards, and real-time communication
- **Pose_Model**: A TensorFlow.js machine learning model trained via Teachable Machine Pose to detect exercise phases for a single exercise type
- **Exercise_Phase**: A discrete stage within an exercise repetition cycle (e.g., pu-start, pu-mid, pu-end for pull-ups)
- **Rep**: A single completed repetition of an exercise, detected when the user transitions through all required Exercise_Phases
- **Workout_Session**: A timed period during which a user performs exercises at a Kiosk_Device, producing a record of exercise type, game mode, performance metric, and duration
- **Guest_Mode**: An operational mode allowing users to use the Kiosk_Device without authentication or account creation
- **Game_Mode**: The type of workout challenge selected by the user. Supported modes are AMRAP (As Many Reps As Possible within a countdown timer) and ISO (Isometric hold, measuring how long the user maintains a static position)
- **Park**: A physical calisthenics park location containing one or more Kiosk_Devices
- **QR_Code**: A machine-readable code displayed on the Kiosk_Device screen that allows a Mobile_App user to associate their account with the active Workout_Session
- **Leaderboard**: A ranked list of users ordered by performance metrics, scoped to a specific Park or globally across all Parks
- **Challenge**: A real-time competitive event between two or more users performing exercises simultaneously at different Kiosk_Devices
- **Level_System**: A progression mechanism that assigns skill levels to users based on cumulative workout performance
- **Sync_Queue**: A local data store on the Kiosk_Device that buffers Workout_Session data for transmission to the Backend when connectivity is available

## Requirements

### Requirement 1: ML Pose Detection and Exercise Counting

**User Story:** As a park user, I want the kiosk to accurately count my exercise repetitions using camera-based pose detection, so that I can track my workout performance without manual input.

#### Acceptance Criteria

1. WHEN a user positions themselves in front of the Kiosk_Device webcam and begins exercising, THE Kiosk_App SHALL detect the user's body pose using TensorFlow.js and the loaded Pose_Model
2. WHEN the Pose_Model classifies the user's pose through all required Exercise_Phases in sequence with confidence above 0.95, THE Kiosk_App SHALL increment the Rep count by one
3. THE Kiosk_App SHALL support loading exactly one Pose_Model per exercise type from a local model directory
4. WHEN a new exercise type is added to the system, THE Kiosk_App SHALL load the corresponding Pose_Model without requiring changes to the counting logic
5. THE Kiosk_App SHALL render the webcam feed with pose keypoints and skeleton overlay on a canvas element in real time
6. IF the Pose_Model fails to load, THEN THE Kiosk_App SHALL display an error message indicating the model is unavailable and disable the exercise counting feature

### Requirement 2: Workout Session Management

**User Story:** As a park user, I want to start a timed workout session at the kiosk, so that I can perform exercises within a structured time window and have my results recorded.

#### Acceptance Criteria

1. WHEN a user initiates a Workout_Session, THE Kiosk_App SHALL start the session according to the selected Game_Mode and begin exercise detection
2. WHEN the session ends (timer expiry for AMRAP, or user exits hold for ISO), THE Kiosk_App SHALL stop exercise detection, stop the webcam feed, and record the final Workout_Session data including exercise type, game mode, performance metric (reps or hold time), and session duration
3. WHILE a Workout_Session is active, THE Kiosk_App SHALL display the relevant metrics on screen (remaining time + rep count for AMRAP, or elapsed hold time for ISO)
4. WHILE a Workout_Session is active, THE Kiosk_App SHALL provide audio feedback on relevant events (rep counted for AMRAP, hold start/stop for ISO)
5. THE Kiosk_App SHALL prevent starting a new Workout_Session while one is already in progress
6. THE Kiosk_App SHALL allow the user to configure the countdown timer duration before starting an AMRAP session (predefined options: 30s, 60s, 90s, 120s)

### Requirement 3: Guest Mode Operation

**User Story:** As a first-time park visitor, I want to try the kiosk without creating an account, so that I can experience the system before committing to registration.

#### Acceptance Criteria

1. THE Kiosk_App SHALL allow users to start a Workout_Session without authentication by operating in Guest_Mode
2. WHEN a Guest_Mode Workout_Session completes, THE Kiosk_App SHALL display the results and prompt the user to download the Mobile_App to save their progress
3. WHEN a Guest_Mode Workout_Session completes, THE Kiosk_App SHALL store the session data locally with a guest identifier
4. WHILE operating in Guest_Mode, THE Kiosk_App SHALL provide the same exercise counting and timer functionality as authenticated sessions

### Requirement 4: QR Code Authentication and Session Association

**User Story:** As a registered user, I want to scan a QR code on the kiosk with my phone, so that my workout session is linked to my account without typing credentials on the kiosk.

#### Acceptance Criteria

1. WHILE no authenticated user is associated with the Kiosk_Device, THE Kiosk_App SHALL display a QR_Code on screen containing a unique session pairing token
2. WHEN a Mobile_App user scans the QR_Code, THE Backend SHALL associate the user's account with the Kiosk_Device session identified by the pairing token
3. WHEN the Backend confirms the association, THE Kiosk_App SHALL display the authenticated user's name and transition from Guest_Mode to authenticated mode
4. THE QR_Code SHALL refresh with a new pairing token every 60 seconds to prevent stale token usage
5. IF the QR_Code scan fails or the pairing token has expired, THEN THE Mobile_App SHALL display an error message and prompt the user to scan again

### Requirement 5: Offline-First Kiosk Operation

**User Story:** As a park operator, I want the kiosk to function fully for exercise counting even without internet connectivity, so that users are never blocked from working out.

#### Acceptance Criteria

1. THE Kiosk_App SHALL perform all ML pose detection and exercise counting locally without requiring network connectivity
2. WHILE the Kiosk_Device has no network connectivity, THE Kiosk_App SHALL store completed Workout_Session data in the Sync_Queue
3. WHEN network connectivity is restored, THE Kiosk_App SHALL transmit all Workout_Session data from the Sync_Queue to the Backend in chronological order
4. WHEN a Workout_Session is successfully transmitted to the Backend, THE Kiosk_App SHALL remove the session from the Sync_Queue
5. IF transmission of a Workout_Session fails, THEN THE Kiosk_App SHALL retain the session in the Sync_Queue and retry transmission after 30 seconds

### Requirement 6: User Registration and Authentication *[Interface Requirement]*

**User Story:** As a new user, I want to create an account through the mobile app, so that I can track my workout history and participate in competitions.

#### Acceptance Criteria

1. THE Mobile_App SHALL allow users to register with an email address and password
2. THE Backend SHALL validate that the email address is unique and properly formatted before creating the account
3. WHEN a user submits valid registration credentials, THE Backend SHALL create the user account and return an authentication token
4. WHEN a user submits valid login credentials, THE Backend SHALL return an authentication token valid for session management
5. IF a user submits invalid credentials, THEN THE Backend SHALL return an error response without revealing whether the email or password was incorrect
6. THE Backend SHALL use industry-standard password hashing for stored credentials

### Requirement 7: Workout History and Progress Tracking *[Interface Requirement]*

**User Story:** As a registered user, I want to view my workout history and track my progress over time, so that I can monitor my fitness improvements.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a chronological list of the user's completed Workout_Sessions including date, park name, exercise type, and rep count
2. WHEN a new Workout_Session is synced from a Kiosk_Device, THE Backend SHALL associate the session with the authenticated user's profile
3. THE Mobile_App SHALL display aggregate statistics including total reps, total sessions, and average reps per session for each exercise type
4. WHEN the user opens the workout history view, THE Mobile_App SHALL retrieve the latest session data from the Backend

### Requirement 8: Park and Device Management

**User Story:** As a platform administrator, I want to register and manage multiple parks and devices, so that the system can scale across different locations.

#### Acceptance Criteria

1. THE Backend SHALL support registration of multiple Parks, each with a unique identifier, name, and geographic location
2. THE Backend SHALL support registration of multiple Kiosk_Devices per Park, each with a unique device identifier
3. WHEN a Kiosk_Device starts up, THE Kiosk_App SHALL identify itself to the Backend using its configured device identifier and Park association
4. THE Backend SHALL track the online/offline status of each registered Kiosk_Device
5. WHEN a Workout_Session is recorded, THE Backend SHALL associate the session with the specific Park and Kiosk_Device where it occurred

### Requirement 9: Leaderboard System

**User Story:** As a competitive user, I want to see how my performance ranks against other users at my park and globally, so that I can stay motivated and compete.

#### Acceptance Criteria

1. THE Backend SHALL maintain a per-Park Leaderboard ranking users by total reps for each exercise type
2. THE Backend SHALL maintain a global Leaderboard ranking users by total reps for each exercise type across all Parks
3. WHEN a Workout_Session is recorded, THE Backend SHALL update the relevant Leaderboards within 5 seconds
4. THE Mobile_App SHALL display both per-Park and global Leaderboards with user rank, name, and rep count
5. THE Kiosk_App SHALL display the per-Park Leaderboard for the current exercise type on the idle screen

### Requirement 10: Cross-Park Real-Time Challenges

**User Story:** As an advanced user, I want to challenge other users at different parks to a real-time competition, so that I can test my skills against others regardless of location.

#### Acceptance Criteria

1. WHEN a user initiates a Challenge, THE Backend SHALL match the user with an available opponent at a different Park
2. WHILE a Challenge is active, THE Backend SHALL relay Rep counts between participants in real time with latency below 2 seconds
3. WHEN both participants complete the Challenge timer, THE Backend SHALL determine the winner based on total reps and notify both participants
4. THE Kiosk_App SHALL display the opponent's name, park, and live Rep count during an active Challenge
5. IF a participant disconnects during a Challenge, THEN THE Backend SHALL notify the remaining participant and end the Challenge without declaring a winner

### Requirement 11: Level System and Challenge Unlocking *[Interface Requirement]*

**User Story:** As a user, I want to progress through skill levels based on my workout performance, so that I can unlock advanced features like cross-park challenges.

#### Acceptance Criteria

1. THE Backend SHALL assign a skill level to each user based on cumulative workout performance metrics
2. THE Backend SHALL define level thresholds based on total reps completed across all exercise types
3. WHEN a user's cumulative reps exceed the threshold for the next level, THE Backend SHALL promote the user to that level
4. WHILE a user's level is below the minimum required level for Challenges, THE Mobile_App SHALL display the Challenge feature as locked with progress toward unlocking
5. WHEN a user reaches the minimum required level, THE Mobile_App SHALL notify the user that Challenges are now available

### Requirement 12: Kiosk Display and User Interface

**User Story:** As a park user, I want the kiosk to have a clear, readable interface optimized for outdoor use, so that I can easily interact with it during my workout.

#### Acceptance Criteria

1. THE Kiosk_App SHALL run in full-screen kiosk mode without browser navigation elements
2. THE Kiosk_App SHALL display large, high-contrast text and UI elements readable from 2 meters distance
3. WHILE idle, THE Kiosk_App SHALL display the park name, available exercises, the per-Park Leaderboard, and the QR_Code for login
4. WHILE a Workout_Session is active, THE Kiosk_App SHALL display the webcam feed, current Rep count, remaining time, and exercise phase indicators
5. THE Kiosk_App SHALL support touch-based interaction for starting sessions and selecting exercises

### Requirement 13: Mobile App QR Code Scanning *[Interface Requirement]*

**User Story:** As a registered user, I want to scan the kiosk QR code with my mobile app, so that I can quickly connect my account to the park device.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a QR code scanner accessible from the main navigation
2. WHEN the Mobile_App scans a valid QR_Code from a Kiosk_Device, THE Mobile_App SHALL send the pairing token to the Backend for session association
3. WHEN the Backend confirms successful pairing, THE Mobile_App SHALL display a confirmation with the park name and device identifier
4. IF the scanned QR_Code contains an invalid or expired token, THEN THE Mobile_App SHALL display an error message indicating the code is no longer valid

### Requirement 14: Backend Scalability and Cost Constraints

**User Story:** As the platform owner, I want the backend to use free-tier cloud services that can scale as the user base grows, so that initial costs remain zero while supporting future growth.

#### Acceptance Criteria

1. THE Backend SHALL be deployable using free-tier offerings from major cloud providers
2. THE Backend SHALL use a serverless or container-based architecture that scales horizontally with demand
3. THE Backend SHALL use a database solution that supports the expected data model without per-query costs at the free tier
4. WHEN the platform exceeds free-tier limits, THE Backend SHALL support migration to paid tiers without architectural changes

### Requirement 15: Data Synchronization Integrity

**User Story:** As a registered user, I want my workout data to be accurately synced between the kiosk and the cloud, so that I never lose my workout records.

#### Acceptance Criteria

1. THE Kiosk_App SHALL assign a unique identifier to each Workout_Session at creation time to prevent duplicate records during sync
2. WHEN the Backend receives a Workout_Session with an identifier that already exists, THE Backend SHALL reject the duplicate and respond with a success status
3. THE Sync_Queue SHALL persist Workout_Session data to local storage so that data survives Kiosk_Device restarts
4. WHEN syncing multiple sessions, THE Kiosk_App SHALL transmit sessions in the order they were created

### Requirement 16: ML-Agnostic Pose Provider Architecture

**User Story:** As a platform developer, I want the pose estimation layer to be decoupled from the exercise counting logic, so that I can swap or upgrade ML models without modifying the core application.

#### Acceptance Criteria

1. THE Kiosk_App SHALL define an abstract Pose_Provider interface with a standardized contract for pose estimation (input: video frame, output: normalized keypoints with confidence scores)
2. THE Kiosk_App SHALL support multiple concrete Pose_Provider implementations (e.g., Teachable Machine Pose, MoveNet, BlazePose) that conform to the abstract interface
3. WHEN a Pose_Provider is swapped for a different implementation, THE exercise counting logic SHALL continue to function without modification
4. THE Kiosk_App SHALL allow configuring which Pose_Provider to use per exercise type, enabling different models for different exercises
5. THE Pose_Provider interface SHALL normalize keypoint output to a common format regardless of the underlying ML framework (TensorFlow.js, ONNX Runtime, etc.)
6. IF a Pose_Provider fails to initialize, THEN THE Kiosk_App SHALL attempt to fall back to an alternative configured provider before displaying an error

### Requirement 17: QR Code Security and Physical Presence Verification

**User Story:** As a platform operator, I want to ensure that only users physically present at the park can associate their account with a kiosk session, so that workout data cannot be faked remotely.

#### Acceptance Criteria

1. THE QR_Code displayed on the Kiosk_Device SHALL contain a cryptographically signed token that expires after 15-20 seconds
2. EACH QR_Code token SHALL be single-use: once scanned by one user, the token is invalidated and a new QR_Code is generated immediately
3. AFTER a Mobile_App user scans the QR_Code, THE Kiosk_App SHALL require a physical confirmation action on the Kiosk_Device touch screen (e.g., "Is this you, [Name]?" button) before completing the pairing
4. IF the physical confirmation is not received within 30 seconds of the QR scan, THEN THE pairing SHALL be cancelled and the token invalidated

### Requirement 18: Game Mode Selection

**User Story:** As a park user, I want to choose between different workout modes (repetitions or isometric hold), so that I can train different aspects of my fitness with the same exercise.

#### Acceptance Criteria

1. BEFORE starting a Workout_Session, THE Kiosk_App SHALL allow the user to select a Game_Mode: AMRAP (As Many Reps As Possible) or ISO (Isometric Hold)
2. WHEN AMRAP mode is selected, THE Kiosk_App SHALL count completed repetitions within a configurable countdown timer
3. WHEN ISO mode is selected, THE Kiosk_App SHALL measure the duration the user holds a static position (e.g., dead hang on pull-up bar)
4. THE Kiosk_App SHALL display mode-appropriate UI: countdown timer + rep counter for AMRAP, elapsed hold timer for ISO
5. THE Kiosk_App SHALL maintain separate Leaderboards per Game_Mode for each exercise type
6. NOT all exercises SHALL support all Game_Modes; the available modes SHALL be defined in the exercise configuration

### Requirement 19: Isometric Hold Detection

**User Story:** As a park user performing an isometric hold, I want the system to accurately detect when I start and stop holding the position, so that my hold time is measured precisely.

#### Acceptance Criteria

1. WHEN the Pose_Model detects the user entering the hold position (e.g., "pu-end" phase for dead hang) with confidence above the configured threshold, THE Kiosk_App SHALL start the isometric timer
2. WHEN the Pose_Model detects the user leaving the hold position (transitioning to a different phase) with confidence above the configured threshold, THE Kiosk_App SHALL stop the isometric timer
3. THE Kiosk_App SHALL display the elapsed hold time with centisecond precision (XX.XX format)
4. WHEN the hold ends, THE Kiosk_App SHALL provide audio feedback indicating the hold is complete
5. THE Kiosk_App SHALL record the final hold time as the session's performance metric
6. THE exercise configuration SHALL define which Exercise_Phase corresponds to the "hold" position for ISO mode

### Requirement 20: Raspberry Pi Hardware Service

**User Story:** As a platform operator, I want the Raspberry Pi to expose a local service for controlling hardware peripherals (LED, audio), so that the Kiosk_App can trigger physical feedback during workouts.

#### Acceptance Criteria

1. THE Kiosk_Device SHALL run a local HTTP service that exposes endpoints for controlling GPIO pins (LED on/off) and playing audio feedback
2. THE Kiosk_App SHALL communicate with the hardware service via HTTP requests to the local network
3. THE hardware service SHALL support CORS to allow requests from the locally-served Kiosk_App
4. IF the hardware service is unavailable, THE Kiosk_App SHALL continue functioning normally without physical feedback (graceful degradation)
5. THE hardware service configuration (IP, port, GPIO pins) SHALL be externalized and not hardcoded
