/**
 * Exercise Configuration Loader
 *
 * Loads exercise configs from JSON files.
 * Each exercise is a separate JSON file in the exercises/ directory.
 */

import type { ExerciseConfig } from '@exercises/types';

// Static imports of exercise configs (bundled at build time)
import pullUpConfig from '../../../exercises/pull-up.json';

const exerciseRegistry: Map<string, ExerciseConfig> = new Map();

/** Initialize the exercise registry from config files */
export function initExerciseRegistry(): void {
	const configs: ExerciseConfig[] = [pullUpConfig as unknown as ExerciseConfig];

	for (const config of configs) {
		exerciseRegistry.set(config.id, config);
	}
}

/** Get all available exercises */
export function getExercises(): ExerciseConfig[] {
	return Array.from(exerciseRegistry.values());
}

/** Get a specific exercise by ID */
export function getExercise(id: string): ExerciseConfig | undefined {
	return exerciseRegistry.get(id);
}

/** Get exercises that support a specific game mode */
export function getExercisesByMode(mode: string): ExerciseConfig[] {
	return getExercises().filter((e) => e.supportedModes.includes(mode as 'amrap' | 'iso'));
}
