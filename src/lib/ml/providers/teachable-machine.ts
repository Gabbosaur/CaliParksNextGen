/**
 * Teachable Machine Pose Provider
 *
 * Implementation of PoseProvider using Google's Teachable Machine Pose library.
 * Uses PoseNet (MobileNetV1) for pose estimation and a custom classifier for exercise phases.
 */

import type {
	PoseProvider,
	PoseEstimation,
	ClassificationResult,
	Keypoint,
	ProviderStatus
} from '../types';

// Teachable Machine Pose types (loaded from CDN)
declare const tmPose: {
	load(modelURL: string, metadataURL: string): Promise<TMModel>;
	Webcam(width: number, height: number, flip: boolean): TMWebcam;
	drawKeypoints(keypoints: TMKeypoint[], minConfidence: number, ctx: CanvasRenderingContext2D): void;
	drawSkeleton(keypoints: TMKeypoint[], minConfidence: number, ctx: CanvasRenderingContext2D): void;
};

interface TMModel {
	estimatePose(input: HTMLCanvasElement | HTMLVideoElement): Promise<{ pose: TMPose; posenetOutput: unknown }>;
	predict(posenetOutput: unknown): Promise<TMPrediction[]>;
	getTotalClasses(): number;
}

interface TMPose {
	keypoints: TMKeypoint[];
	score: number;
}

interface TMKeypoint {
	position: { x: number; y: number };
	part: string;
	score: number;
}

interface TMPrediction {
	className: string;
	probability: number;
}

interface TMWebcam {
	setup(): Promise<void>;
	play(): Promise<void>;
	stop(): void;
	update(): void;
	canvas: HTMLCanvasElement;
}

export class TeachableMachinePoseProvider implements PoseProvider {
	readonly name = 'Teachable Machine Pose';
	private model: TMModel | null = null;
	private _status: ProviderStatus = 'uninitialized';
	private lastPosenetOutput: unknown = null;

	get status(): ProviderStatus {
		return this._status;
	}

	async initialize(modelPath: string): Promise<void> {
		this._status = 'loading';

		try {
			// Ensure tmPose is available (loaded from CDN in app.html)
			if (typeof tmPose === 'undefined') {
				throw new Error('tmPose library not loaded. Ensure the Teachable Machine Pose script is included.');
			}

			const modelURL = modelPath + 'model.json';
			const metadataURL = modelPath + 'metadata.json';

			this.model = await tmPose.load(modelURL, metadataURL);
			this._status = 'ready';
			console.log(`[TM Pose] Model loaded from ${modelPath}`);
		} catch (error) {
			this._status = 'error';
			console.error('[TM Pose] Failed to initialize:', error);
			throw error;
		}
	}

	async estimatePose(frame: HTMLCanvasElement | HTMLVideoElement): Promise<PoseEstimation> {
		if (!this.model) {
			throw new Error('Model not initialized. Call initialize() first.');
		}

		const { pose, posenetOutput } = await this.model.estimatePose(frame);
		this.lastPosenetOutput = posenetOutput;

		// Normalize keypoints to 0-1 range
		const width = frame instanceof HTMLCanvasElement ? frame.width : frame.videoWidth;
		const height = frame instanceof HTMLCanvasElement ? frame.height : frame.videoHeight;

		const keypoints: Keypoint[] = pose?.keypoints?.map((kp: TMKeypoint) => ({
			name: kp.part,
			x: kp.position.x / width,
			y: kp.position.y / height,
			confidence: kp.score
		})) ?? [];

		return {
			keypoints,
			confidence: pose?.score ?? 0,
			timestamp: performance.now()
		};
	}

	async classify(_poseData: PoseEstimation): Promise<ClassificationResult[]> {
		if (!this.model || !this.lastPosenetOutput) {
			throw new Error('Model not initialized or no pose data available.');
		}

		const predictions: TMPrediction[] = await this.model.predict(this.lastPosenetOutput);

		return predictions.map((p) => ({
			className: p.className,
			probability: p.probability
		}));
	}

	dispose(): void {
		this.model = null;
		this.lastPosenetOutput = null;
		this._status = 'uninitialized';
	}
}
