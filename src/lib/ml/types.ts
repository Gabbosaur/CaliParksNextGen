/**
 * ML Layer Types — Pose Provider Interface (Agnostic)
 *
 * These types define the contract between the ML layer and the exercise engine.
 * Any pose estimation model (Teachable Machine, MoveNet, BlazePose, etc.)
 * must conform to the PoseProvider interface.
 */

/** A single detected body keypoint */
export interface Keypoint {
	/** Keypoint name (e.g., "left_shoulder", "right_hip") */
	name: string;
	/** Normalized X position (0-1, left to right) */
	x: number;
	/** Normalized Y position (0-1, top to bottom) */
	y: number;
	/** Detection confidence (0-1) */
	confidence: number;
}

/** Result of pose estimation on a single frame */
export interface PoseEstimation {
	/** Detected body keypoints */
	keypoints: Keypoint[];
	/** Overall pose detection confidence (0-1) */
	confidence: number;
	/** Timestamp of the estimation (ms) */
	timestamp: number;
}

/** Classification result for an exercise phase */
export interface ClassificationResult {
	/** Phase class name (e.g., "pu-start", "pu-end") */
	className: string;
	/** Classification probability (0-1) */
	probability: number;
}

/** Status of a PoseProvider */
export type ProviderStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

/**
 * Abstract Pose Provider Interface
 *
 * All ML pose estimation implementations must conform to this interface.
 * This allows swapping models without modifying the exercise counting logic.
 */
export interface PoseProvider {
	/** Human-readable provider name (for logging/debugging) */
	readonly name: string;

	/** Current provider status */
	readonly status: ProviderStatus;

	/** Initialize the provider and load model weights */
	initialize(modelPath: string): Promise<void>;

	/** Run pose estimation on a video frame */
	estimatePose(frame: HTMLCanvasElement | HTMLVideoElement): Promise<PoseEstimation>;

	/**
	 * Classify the current pose into exercise phases.
	 * Some providers do this in one step with estimatePose (e.g., Teachable Machine),
	 * others require a separate classification step.
	 */
	classify(poseData: PoseEstimation): Promise<ClassificationResult[]>;

	/** Clean up resources (tensors, memory) */
	dispose(): void;
}

/** Configuration for selecting a pose provider */
export interface PoseProviderConfig {
	/** Provider identifier (e.g., "teachable-machine", "movenet", "blazepose") */
	id: string;
	/** Path to model files (relative to static/) */
	modelPath: string;
	/** Optional provider-specific settings */
	options?: Record<string, unknown>;
}
