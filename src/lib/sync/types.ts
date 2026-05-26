/**
 * Sync Layer Types
 *
 * Types for the offline-first data synchronization system.
 * Workout sessions are queued locally and synced to the backend when online.
 */

import type { WorkoutSession } from '@exercises/types';

/** A queued item waiting to be synced */
export interface SyncQueueItem {
	/** The workout session data */
	session: WorkoutSession;
	/** Number of sync attempts made */
	attempts: number;
	/** Timestamp of last sync attempt (ISO string, or null if never attempted) */
	lastAttemptAt: string | null;
	/** Timestamp when the item was added to the queue */
	queuedAt: string;
}

/** Sync status for the queue manager */
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

/** Backend API response for session sync */
export interface SyncResponse {
	success: boolean;
	/** True if the session was a duplicate (already exists on backend) */
	duplicate?: boolean;
	error?: string;
}

/** Abstract API client interface for backend communication */
export interface ApiClient {
	/** Sync a workout session to the backend */
	syncSession(session: WorkoutSession): Promise<SyncResponse>;

	/** Check if the backend is reachable */
	isOnline(): Promise<boolean>;

	/** Fetch leaderboard data */
	fetchLeaderboard(params: LeaderboardParams): Promise<LeaderboardEntry[]>;
}

/** Parameters for leaderboard queries */
export interface LeaderboardParams {
	parkId?: string;
	exerciseId: string;
	gameMode: string;
	period: 'daily' | 'weekly' | 'alltime';
	limit?: number;
}

/** A single leaderboard entry */
export interface LeaderboardEntry {
	rank: number;
	userId: string;
	displayName: string;
	avatarUrl?: string;
	parkName?: string;
	score: number;
	/** Whether this entry is the current user */
	isCurrentUser?: boolean;
}
