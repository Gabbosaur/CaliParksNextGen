/**
 * Session Store
 *
 * Global state for the active workout session.
 */

import { writable } from 'svelte/store';
import type { GameMode, ExerciseConfig } from '@exercises/types';

export type SessionState =
	| { status: 'idle' }
	| { status: 'selecting' }
	| { status: 'active'; exercise: ExerciseConfig; mode: GameMode; startedAt: number }
	| { status: 'completed'; exercise: ExerciseConfig; mode: GameMode; reps: number; holdTimeMs: number; durationMs: number };

export const sessionState = writable<SessionState>({ status: 'idle' });
