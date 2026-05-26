/**
 * Hardware Service Client
 *
 * Communicates with the Raspberry Pi FastAPI service for LED and audio control.
 * Gracefully degrades if the service is unavailable.
 */

import type { HardwareConfig } from './types';

let config: HardwareConfig = {
	baseUrl: 'http://localhost:8123',
	ledPin: 21,
	enabled: false
};

let isAvailable = false;

/** Initialize the hardware service client */
export function initHardware(hwConfig: HardwareConfig): void {
	config = hwConfig;
	if (config.enabled) {
		checkHealth();
	}
}

/** Check if the hardware service is reachable */
async function checkHealth(): Promise<void> {
	try {
		const response = await fetch(`${config.baseUrl}/health`, {
			signal: AbortSignal.timeout(2000)
		});
		isAvailable = response.ok;
		console.log(`[Hardware] Service ${isAvailable ? 'available' : 'unavailable'}`);
	} catch {
		isAvailable = false;
		console.log('[Hardware] Service not reachable, running without hardware feedback');
	}
}

/** Turn LED on or off */
export async function setLed(on: boolean): Promise<void> {
	if (!config.enabled || !isAvailable) return;

	try {
		await fetch(`${config.baseUrl}/gpio/${config.ledPin}`, {
			method: 'PATCH',
			body: JSON.stringify({ on }),
			headers: { 'Content-Type': 'application/json' },
			signal: AbortSignal.timeout(1000)
		});
	} catch {
		// Silently fail — hardware feedback is non-critical
	}
}

/** Trigger audio on the Raspberry Pi */
export async function triggerAudio(sound: string): Promise<void> {
	if (!config.enabled || !isAvailable) return;

	try {
		await fetch(`${config.baseUrl}/audio/play`, {
			method: 'POST',
			body: JSON.stringify({ sound }),
			headers: { 'Content-Type': 'application/json' },
			signal: AbortSignal.timeout(1000)
		});
	} catch {
		// Silently fail
	}
}

/** Flash LED briefly (on then off after delay) */
export async function flashLed(durationMs: number = 200): Promise<void> {
	await setLed(true);
	setTimeout(() => setLed(false), durationMs);
}
