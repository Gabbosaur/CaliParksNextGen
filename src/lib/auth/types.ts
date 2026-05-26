/**
 * Authentication & QR Pairing Types
 *
 * Types for user authentication, QR code pairing,
 * and session management on the kiosk.
 */

/** User information (from backend after QR pairing) */
export interface User {
	id: string;
	displayName: string;
	avatarUrl?: string;
	level: number;
	totalReps: number;
}

/** Current kiosk user state */
export type KioskUserState =
	| { type: 'guest' }
	| { type: 'authenticated'; user: User }
	| { type: 'pairing'; pendingName?: string };

/** QR pairing token (displayed on kiosk, scanned by mobile app) */
export interface PairingToken {
	/** The token value encoded in the QR code */
	token: string;
	/** When this token expires (ISO timestamp) */
	expiresAt: string;
	/** Whether this token has been consumed */
	consumed: boolean;
}

/** Result of a pairing attempt */
export interface PairingResult {
	success: boolean;
	user?: User;
	error?: string;
}

/** QR code manager configuration */
export interface QRConfig {
	/** How often to rotate the token (milliseconds) */
	rotationIntervalMs: number;
	/** Token validity duration (milliseconds) */
	tokenTtlMs: number;
	/** Timeout for physical confirmation on kiosk (milliseconds) */
	confirmationTimeoutMs: number;
}
