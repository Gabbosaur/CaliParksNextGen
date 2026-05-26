/**
 * Hardware Service Types
 *
 * Types for communication with the Raspberry Pi hardware service
 * (LED control, audio playback).
 */

/** LED control action */
export interface LedAction {
	/** GPIO pin number */
	pin: number;
	/** Turn on (true) or off (false) */
	on: boolean;
}

/** Audio playback action */
export interface AudioAction {
	/** Sound identifier to play */
	sound: 'rep' | 'hold_start' | 'hold_end' | 'countdown_warning' | 'session_end';
}

/** Hardware service health status */
export interface HardwareHealth {
	status: 'ok' | 'error';
	deviceId?: string;
}

/** Hardware service configuration */
export interface HardwareConfig {
	/** Base URL of the hardware service (e.g., "http://localhost:8123") */
	baseUrl: string;
	/** LED GPIO pin number */
	ledPin: number;
	/** Whether hardware service is enabled */
	enabled: boolean;
}
