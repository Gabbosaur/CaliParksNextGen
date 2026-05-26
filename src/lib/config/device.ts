/**
 * Device Configuration
 *
 * Loads device config from environment or defaults.
 * In production, this would be read from a local config file on the Raspberry Pi.
 */

import type { DeviceConfig } from './types';

const DEFAULT_CONFIG: DeviceConfig = {
	deviceId: 'kiosk-dev-001',
	parkId: 'park-dev-001',
	parkName: 'CaliParks Dev Station',
	parkLocation: {
		lat: 41.9028,
		lng: 12.4964,
		address: 'Development Environment'
	},
	hardware: {
		baseUrl: 'http://localhost:8123',
		ledPin: 21,
		enabled: false
	},
	apiBaseUrl: 'http://localhost:3001',
	inactivityTimeoutMs: 120_000 // 2 minutes
};

let config: DeviceConfig = DEFAULT_CONFIG;

export function getDeviceConfig(): DeviceConfig {
	return config;
}

export function setDeviceConfig(newConfig: Partial<DeviceConfig>): void {
	config = { ...config, ...newConfig };
}
