/**
 * Audio Engine
 *
 * Web Audio API wrapper for low-latency sound feedback.
 * Plays tones via oscillators for instant response (<10ms latency).
 */

let audioContext: AudioContext | null = null;

const VOLUME_CURVE = new Float32Array([1.0, 0.61, 0.37, 0.22, 0.14, 0.08, 0.05, 0.0]);

function getContext(): AudioContext {
	if (!audioContext) {
		audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
	}
	// Resume if suspended (browser autoplay policy)
	if (audioContext.state === 'suspended') {
		audioContext.resume();
	}
	return audioContext;
}

function playTone(frequency: number, type: OscillatorType = 'sine', duration: number = 0.3): void {
	const ctx = getContext();
	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();

	oscillator.connect(gain);
	gain.connect(ctx.destination);

	oscillator.type = type;
	oscillator.frequency.value = frequency;
	gain.gain.setValueCurveAtTime(VOLUME_CURVE, ctx.currentTime, duration);

	oscillator.start();
	oscillator.stop(ctx.currentTime + duration);
}

/** Play sound when a rep is counted */
export function playRepSound(): void {
	playTone(800, 'sine', 0.25);
}

/** Play sound when isometric hold starts */
export function playHoldStart(): void {
	playTone(400, 'sine', 0.4);
	setTimeout(() => playTone(600, 'sine', 0.3), 150);
}

/** Play sound when isometric hold ends */
export function playHoldEnd(): void {
	playTone(600, 'sine', 0.3);
	setTimeout(() => playTone(400, 'sine', 0.4), 150);
}

/** Play countdown warning (last 5 seconds) */
export function playCountdownWarning(): void {
	playTone(500, 'square', 0.1);
}

/** Play session end sound */
export function playSessionEnd(): void {
	playTone(300, 'sine', 0.5);
	setTimeout(() => playTone(450, 'sine', 0.5), 200);
	setTimeout(() => playTone(600, 'sine', 0.7), 400);
}

/** Initialize audio context (must be called from user gesture) */
export function initAudio(): void {
	getContext();
}
