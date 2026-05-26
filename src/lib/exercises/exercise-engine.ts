/**
 * Exercise Engine
 *
 * Core logic for detecting exercise repetitions and isometric holds.
 * Works with any PoseProvider through the ClassificationResult interface.
 */

import { writable, type Writable } from 'svelte/store';
import type { ExerciseConfig, SessionMetrics, GameMode } from './types';
import type { ClassificationResult } from '@ml/types';

export class ExerciseEngine {
	private exercise: ExerciseConfig;
	private mode: GameMode;
	private sequenceIndex = 0;
	private _metrics: Writable<SessionMetrics>;

	// ISO mode state
	private holdStartTime: number | null = null;
	private holdAccumulatedMs = 0;

	constructor(exercise: ExerciseConfig, mode: GameMode) {
		this.exercise = exercise;
		this.mode = mode;
		this._metrics = writable<SessionMetrics>({
			reps: 0,
			holdTimeMs: 0,
			isHolding: false,
			currentPhase: null,
			phaseConfidences: new Map()
		});
	}

	/** Reactive metrics store */
	get metrics(): Writable<SessionMetrics> {
		return this._metrics;
	}

	/** Process a new set of classification results from the pose provider */
	processClassification(results: ClassificationResult[]): void {
		// Update phase confidences
		const confidences = new Map<string, number>();
		for (const r of results) {
			confidences.set(r.className, r.probability);
		}

		// Find the dominant phase (highest confidence above threshold)
		let dominantPhase: string | null = null;
		let maxProb = 0;
		for (const phase of this.exercise.phases) {
			const prob = confidences.get(phase.name) ?? 0;
			if (prob > maxProb && prob >= phase.confidenceThreshold) {
				maxProb = prob;
				dominantPhase = phase.name;
			}
		}

		if (this.mode === 'amrap') {
			this.processAmrap(dominantPhase, confidences);
		} else {
			this.processIso(dominantPhase, confidences);
		}
	}

	private processAmrap(dominantPhase: string | null, confidences: Map<string, number>): void {
		const sequence = this.exercise.repSequence;
		const expectedPhase = sequence[this.sequenceIndex];

		if (dominantPhase === expectedPhase) {
			this.sequenceIndex++;

			if (this.sequenceIndex >= sequence.length) {
				// Full rep completed!
				this.sequenceIndex = 0;
				this._metrics.update((m) => ({
					...m,
					reps: m.reps + 1,
					currentPhase: dominantPhase,
					phaseConfidences: confidences
				}));
				return;
			}
		}

		this._metrics.update((m) => ({
			...m,
			currentPhase: dominantPhase,
			phaseConfidences: confidences
		}));
	}

	private processIso(dominantPhase: string | null, confidences: Map<string, number>): void {
		const holdPhase = this.exercise.holdPhase;
		const isInHoldPosition = dominantPhase === holdPhase;

		if (isInHoldPosition && !this.holdStartTime) {
			// Just entered hold position
			this.holdStartTime = performance.now();
		} else if (!isInHoldPosition && this.holdStartTime) {
			// Just exited hold position
			this.holdAccumulatedMs += performance.now() - this.holdStartTime;
			this.holdStartTime = null;
		}

		const currentHoldMs = this.holdStartTime
			? this.holdAccumulatedMs + (performance.now() - this.holdStartTime)
			: this.holdAccumulatedMs;

		this._metrics.update((m) => ({
			...m,
			holdTimeMs: currentHoldMs,
			isHolding: isInHoldPosition,
			currentPhase: dominantPhase,
			phaseConfidences: confidences
		}));
	}

	/** Reset the engine state */
	reset(): void {
		this.sequenceIndex = 0;
		this.holdStartTime = null;
		this.holdAccumulatedMs = 0;
		this._metrics.set({
			reps: 0,
			holdTimeMs: 0,
			isHolding: false,
			currentPhase: null,
			phaseConfidences: new Map()
		});
	}

	/** Get final results */
	getResults(): { reps: number; holdTimeMs: number } {
		let finalHoldMs = this.holdAccumulatedMs;
		if (this.holdStartTime) {
			finalHoldMs += performance.now() - this.holdStartTime;
		}
		let reps = 0;
		this._metrics.subscribe((m) => { reps = m.reps; })();
		return { reps, holdTimeMs: finalHoldMs };
	}
}
