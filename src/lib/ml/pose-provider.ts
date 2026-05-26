/**
 * Pose Provider Factory
 *
 * Creates the appropriate PoseProvider instance based on configuration.
 */

import type { PoseProvider, PoseProviderConfig } from './types';
import { TeachableMachinePoseProvider } from './providers/teachable-machine';

const providers: Map<string, () => PoseProvider> = new Map([
	['teachable-machine', () => new TeachableMachinePoseProvider()]
]);

/**
 * Create a PoseProvider instance from config.
 * Falls back to teachable-machine if the requested provider is not found.
 */
export function createPoseProvider(config: PoseProviderConfig): PoseProvider {
	const factory = providers.get(config.id);

	if (!factory) {
		console.warn(
			`PoseProvider "${config.id}" not found, falling back to teachable-machine`
		);
		return new TeachableMachinePoseProvider();
	}

	return factory();
}

/** Register a new provider factory */
export function registerPoseProvider(id: string, factory: () => PoseProvider): void {
	providers.set(id, factory);
}
