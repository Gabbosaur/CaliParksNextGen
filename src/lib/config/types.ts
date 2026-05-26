/**
 * Device & Park Configuration Types
 */

import type { HardwareConfig } from '@hardware/types';

/** Configuration for this specific kiosk device */
export interface DeviceConfig {
	/** Unique device identifier */
	deviceId: string;
	/** Park this device belongs to */
	parkId: string;
	/** Park display name */
	parkName: string;
	/** Park location (for HUD display) */
	parkLocation: {
		lat: number;
		lng: number;
		address?: string;
	};
	/** Hardware service configuration */
	hardware: HardwareConfig;
	/** Backend API base URL */
	apiBaseUrl: string;
	/** Inactivity timeout before returning to idle screen (ms) */
	inactivityTimeoutMs: number;
}
