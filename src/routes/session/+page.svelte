<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ExerciseEngine } from '@exercises/exercise-engine';
	import { createPoseProvider } from '@ml/pose-provider';
	import { initAudio, playRepSound, playHoldStart, playHoldEnd, playSessionEnd, playCountdownWarning } from '@audio/audio-engine';
	import { flashLed } from '@hardware/hardware-service';
	import { getExercise, initExerciseRegistry } from '@config/exercises';
	import type { PoseProvider } from '@ml/types';
	import type { ExerciseConfig, GameMode, SessionMetrics } from '@exercises/types';

	// State
	let mode: GameMode = 'amrap';
	let exercise: ExerciseConfig | undefined;
	let engine: ExerciseEngine | null = null;
	let provider: PoseProvider | null = null;
	let metrics: SessionMetrics = { reps: 0, holdTimeMs: 0, isHolding: false, currentPhase: null, phaseConfidences: new Map() };

	// Timer
	let timerDuration = 60; // seconds
	let timeRemaining = 60;
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Webcam
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let webcam: any = null;
	let animationFrame: number | null = null;
	let isRunning = false;

	// Track previous state for audio triggers
	let prevReps = 0;
	let prevIsHolding = false;

	// Status
	let statusMessage = 'Initializing...';
	let isReady = false;

	onMount(async () => {
		// Parse mode and duration from URL
		const params = new URLSearchParams(window.location.search);
		const urlMode = params.get('mode');
		mode = (urlMode === 'iso' ? 'iso' : 'amrap') as GameMode;
		const urlDuration = parseInt(params.get('duration') ?? '60');
		timerDuration = urlDuration;
		timeRemaining = urlDuration;

		// Init audio (needs user gesture — page navigation counts)
		initAudio();

		// Load exercise registry
		initExerciseRegistry();
		exercise = getExercise('pull-up');

		if (!exercise) {
			statusMessage = 'Error: Exercise not found';
			return;
		}

		// Create pose provider
		statusMessage = 'Loading ML model...';
		provider = createPoseProvider(exercise.poseProvider);

		try {
			await provider.initialize(exercise.poseProvider.modelPath);
		} catch (e) {
			statusMessage = 'Error: Failed to load model';
			console.error(e);
			return;
		}

		// Create exercise engine
		engine = new ExerciseEngine(exercise, mode);

		// Subscribe to metrics
		engine.metrics.subscribe((m) => {
			// Audio triggers
			if (m.reps > prevReps) {
				playRepSound();
				flashLed(200);
				prevReps = m.reps;
			}
			if (mode === 'iso') {
				if (m.isHolding && !prevIsHolding) playHoldStart();
				if (!m.isHolding && prevIsHolding) playHoldEnd();
				prevIsHolding = m.isHolding;
			}
			metrics = m;
		});

		// Setup webcam
		statusMessage = 'Starting webcam...';
		try {
			const tmPoseLib = (window as any).tmPose;
			const size = 400;
			webcam = new tmPoseLib.Webcam(size, size, true);
			await webcam.setup();
			await webcam.play();

			ctx = canvas.getContext('2d');
			canvas.width = size;
			canvas.height = size;

			isReady = true;
			statusMessage = 'Ready!';

			// Start session
			startSession();
		} catch (e) {
			statusMessage = 'Error: Webcam access denied';
			console.error(e);
		}
	});

	function startSession() {
		isRunning = true;
		timeRemaining = timerDuration;

		if (mode === 'amrap') {
			timerInterval = setInterval(() => {
				timeRemaining--;
				if (timeRemaining <= 5 && timeRemaining > 0) playCountdownWarning();
				if (timeRemaining <= 0) endSession();
			}, 1000);
		}

		// Start prediction loop
		animationFrame = requestAnimationFrame(loop);
	}

	async function loop() {
		if (!isRunning || !webcam || !provider || !engine) return;

		webcam.update();

		if (ctx && webcam.canvas) {
			// Draw webcam feed first
			ctx.drawImage(webcam.canvas, 0, 0);

			const tmPoseLib = (window as any).tmPose;
			const tmModel = (provider as any).model;

			if (tmModel) {
				const { pose, posenetOutput } = await tmModel.estimatePose(webcam.canvas);

				// Re-draw webcam feed to ensure skeleton is on top of the latest frame
				ctx.drawImage(webcam.canvas, 0, 0);

				// Draw skeleton on top
				if (pose) {
					tmPoseLib.drawKeypoints(pose.keypoints, 0.5, ctx);
					tmPoseLib.drawSkeleton(pose.keypoints, 0.5, ctx);
				}

				// Classify and process
				const predictions = await tmModel.predict(posenetOutput);
				const classifications = predictions.map((p: any) => ({
					className: p.className,
					probability: p.probability
				}));
				engine.processClassification(classifications);
			}
		}

		if (isRunning) {
			animationFrame = requestAnimationFrame(loop);
		}
	}

	function endSession() {
		isRunning = false;

		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
		if (webcam) {
			webcam.stop();
		}

		playSessionEnd();

		// Navigate to results with current metrics
		const params = new URLSearchParams({
			mode,
			reps: String(metrics.reps),
			holdTimeMs: String(Math.round(metrics.holdTimeMs)),
			duration: String(timerDuration)
		});
		goto(`/results?${params.toString()}`);
	}

	onDestroy(() => {
		isRunning = false;
		if (timerInterval) clearInterval(timerInterval);
		if (animationFrame) cancelAnimationFrame(animationFrame);
		if (webcam) webcam.stop();
		if (provider) provider.dispose();
	});

	// Formatters
	function formatTime(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	function formatHoldTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const centis = Math.floor((ms % 1000) / 10);
		return `${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
	}
</script>

<!-- Webcam Feed (Full Background) -->
<div class="absolute inset-4 z-0 border-2 border-primary-container/30 shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-pulse-glow rounded-4xl overflow-hidden">
	<canvas bind:this={canvas} class="w-full h-full object-cover"></canvas>
	<div class="absolute inset-0 scanlines z-20 mix-blend-overlay pointer-events-none"></div>
</div>

<!-- Loading State -->
{#if !isReady}
<div class="absolute inset-0 z-50 flex items-center justify-center bg-surface/90">
	<div class="text-center">
		<h1 class="font-display-xl text-display-lg text-primary uppercase italic animate-pulse-glow">{statusMessage}</h1>
	</div>
</div>
{/if}

<!-- HUD Overlay -->
<main class="absolute inset-0 z-30 p-safe-margin flex flex-col justify-between pointer-events-none">

	<!-- Top Row -->
	<header class="flex justify-between items-start w-full">
		<!-- Mode Badge -->
		<div class="bg-surface-container-low/80 backdrop-blur-md border-2 border-primary-container/50 shadow-[0_0_20px_rgba(0,240,255,0.3)] pointer-events-auto p-md rounded-3xl">
			<div class="flex items-center gap-sm">
				<span class="material-symbols-outlined text-primary-container" style="font-size: 32px; font-variation-settings: 'FILL' 1;">
					{mode === 'amrap' ? 'fitness_center' : 'accessibility_new'}
				</span>
				<div>
					<div class="inline-block px-3 py-1 bg-primary-container/20 border border-primary-fixed-dim text-primary-fixed-dim rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold">
						{mode === 'amrap' ? 'AMRAP' : 'ISO HOLD'}
					</div>
					<p class="font-headline-md text-[20px] uppercase italic leading-none font-bold text-white mt-1">
						{exercise?.name ?? 'Pull Up'}
					</p>
				</div>
			</div>
		</div>

		<!-- Timer (AMRAP) or Hold Status (ISO) -->
		<div class="bg-surface-container-low/80 backdrop-blur-md border-2 border-secondary-container/50 shadow-[0_0_30px_rgba(195,244,0,0.3)] animate-pulse-glow pointer-events-auto p-md flex flex-col items-end rounded-3xl">
			{#if mode === 'amrap'}
				<div class="inline-block px-3 py-1 bg-secondary-container/20 border border-secondary-fixed text-secondary-fixed rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold mb-2">Time Remaining</div>
				<div class="font-display-xl text-[80px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(195,244,0,0.5)] tabular-nums">
					{formatTime(timeRemaining)}
				</div>
			{:else}
				<div class="inline-block px-3 py-1 bg-secondary-container/20 border border-secondary-fixed text-secondary-fixed rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold mb-2">
					{metrics.isHolding ? 'HOLDING' : 'READY'}
				</div>
				<div class="font-display-xl text-[80px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(195,244,0,0.5)] tabular-nums">
					{formatHoldTime(metrics.holdTimeMs)}
				</div>
			{/if}
		</div>
	</header>

	<!-- Bottom Row -->
	<footer class="flex justify-between items-end w-full">
		<!-- Stop Button -->
		<button
			class="bg-surface-container-low/80 backdrop-blur-md border-2 border-error/50 shadow-[0_0_15px_rgba(255,180,171,0.3)] p-md rounded-3xl pointer-events-auto hover:bg-error/20 transition-all active:scale-95"
			on:click={endSession}
		>
			<div class="flex items-center gap-sm">
				<span class="material-symbols-outlined text-error text-[32px]">stop_circle</span>
				<span class="font-label-xl text-[16px] text-error uppercase tracking-wider font-bold">STOP</span>
			</div>
		</button>

		<!-- Rep Counter (AMRAP) -->
		{#if mode === 'amrap'}
		<div class="bg-surface-container-low/80 backdrop-blur-md border-2 border-primary-container/50 shadow-[0_0_40px_rgba(0,240,255,0.4)] animate-pulse-glow pointer-events-auto p-lg flex flex-col items-center justify-center min-w-[300px] rounded-4xl">
			<div class="inline-block px-4 py-1.5 bg-primary-container/20 border border-primary-fixed-dim text-primary-fixed-dim rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold mb-4 shadow-[0_0_10px_rgba(0,240,255,0.3)]">Reps</div>
			<div class="font-display-xl text-[140px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_30px_rgba(0,240,255,0.6)]">
				{metrics.reps}
			</div>
		</div>
		{/if}
	</footer>
</main>
