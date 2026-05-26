<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let width = 400;
	export let height = 400;
	export let flip = true;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let webcam: any = null;
	let isActive = false;

	/** Expose canvas for external drawing (skeleton overlay) */
	export function getCanvas(): HTMLCanvasElement {
		return canvas;
	}

	/** Expose context for external drawing */
	export function getContext(): CanvasRenderingContext2D | null {
		return ctx;
	}

	/** Get the webcam instance for frame updates */
	export function getWebcam(): any {
		return webcam;
	}

	/** Start the webcam */
	export async function start(): Promise<void> {
		const tmPoseLib = (window as any).tmPose;
		if (!tmPoseLib) throw new Error('tmPose library not loaded');

		webcam = new tmPoseLib.Webcam(width, height, flip);
		await webcam.setup();
		await webcam.play();

		ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;
		isActive = true;
	}

	/** Stop the webcam */
	export function stop(): void {
		isActive = false;
		if (webcam) {
			webcam.stop();
			webcam = null;
		}
	}

	/** Update frame (call in animation loop) */
	export function updateFrame(): void {
		if (!isActive || !webcam || !ctx) return;
		webcam.update();
		ctx.drawImage(webcam.canvas, 0, 0);
	}

	/** Draw skeleton overlay */
	export function drawSkeleton(pose: any): void {
		if (!ctx || !pose) return;
		const tmPoseLib = (window as any).tmPose;
		if (!tmPoseLib) return;
		tmPoseLib.drawKeypoints(pose.keypoints, 0.5, ctx);
		tmPoseLib.drawSkeleton(pose.keypoints, 0.5, ctx);
	}

	onDestroy(() => {
		stop();
	});
</script>

<div class="relative w-full h-full rounded-4xl overflow-hidden border-2 border-primary-container/30 shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-pulse-glow">
	<canvas bind:this={canvas} class="w-full h-full object-cover" {width} {height}></canvas>

	<!-- Scanlines overlay -->
	<div class="absolute inset-0 scanlines mix-blend-overlay pointer-events-none"></div>

	<!-- Data sweep -->
	<div class="absolute inset-0 w-full h-[150%] bg-gradient-to-b from-transparent via-primary-container/10 to-transparent pointer-events-none animate-data-sweep"></div>
</div>
