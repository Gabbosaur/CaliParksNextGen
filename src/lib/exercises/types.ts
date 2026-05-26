/**
 * Exercise Engine Types
 *
 * Defines the configuration and runtime types for exercises,
 * game modes, and workout sessions.
 */

import type { PoseProviderConfig } from '@ml/types';

/** Supported game modes */
export type GameMode = 'amrap' | 'iso';

/** A single phase within an exercise repetition cycle */
export interface ExercisePhase {
	/** Internal phase name matching the model output (e.g., "pu-start") */
	name: string;
	/** Display label (e.g., "Pull Up - Start") */
	label: string;
	/** Minimum confidence threshold to consider this phase active (0-1) */
	confidenceThreshold: number;
}

/** Full configuration for an exercise type */
export interface ExerciseConfig {
	/** Unique exercise identifier (e.g., "pull-up") */
	id: string;
	/** Display name (e.g., "Pull Up") */
	name: string;
	/** Material Symbols icon name (e.g., "fitness_center") */
	icon: string;
	/** Description text */
	description: string;
	/** All detectable phases for this exercise */
	phases: ExercisePhase[];
	/** Which game modes this exercise supports */
	supportedModes: GameMode[];

	// --- AMRAP Configuration ---
	/**
	 * Ordered sequence of phase names that constitutes one complete rep.
	 * E.g., ["pu-start", "pu-end"] means: detect start, then detect end = 1 rep.
	 */
	repSequence: string[];

	// --- ISO Configuration ---
	/** Which phase name corresponds to the "hold" position for isometric mode */
	holdPhase?: string;

	// --- ML Configuration ---
	/** Pose provider configuration for this exercise */
	poseProvider: PoseProviderConfig;
}

/** Real-time metrics during a workout session */
export interface SessionMetrics {
	/** Current rep count (AMRAP mode) */
	reps: number;
	/** Current hold time in milliseconds (ISO mode) */
	holdTimeMs: number;
	/** Whether the user is currently in the hold position (ISO mode) */
	isHolding: boolean;
	/** Currently detected phase name (or null if none) */
	currentPhase: string | null;
	/** Confidence values for each phase */
	phaseConfidences: Map<string, number>;
}

/** A completed workout session record */
export interface WorkoutSession {
	/** Unique session ID (UUID, generated at creation) */
	id: string;
	/** Exercise type ID */
	exerciseId: string;
	/** Game mode used */
	gameMode: GameMode;
	/** User ID (null for guest) */
	userId: string | null;
	/** Park ID where the session occurred */
	parkId: string;
	/** Device ID of the kiosk */
	deviceId: string;
	/** ISO timestamp when session started */
	startedAt: string;
	/** ISO timestamp when session ended */
	endedAt: string;
	/** Session result */
	result: WorkoutResult;
	/** Timer duration in seconds (AMRAP only) */
	timerDurationSec?: number;
	/** Whether this session has been synced to backend */
	synced: boolean;
}

/** Result data for a completed session */
export interface WorkoutResult {
	/** Total reps completed (AMRAP mode) */
	reps?: number;
	/** Total hold time in milliseconds (ISO mode) */
	holdTimeMs?: number;
}

/** Available timer duration options for AMRAP mode (in seconds) */
export const AMRAP_TIMER_OPTIONS = [30, 60, 90, 120] as const;
export type AmrapTimerDuration = (typeof AMRAP_TIMER_OPTIONS)[number];
