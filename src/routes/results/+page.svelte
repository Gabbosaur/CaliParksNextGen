<script lang="ts">
	import { onMount } from 'svelte';
	import ActionButton from '@components/ActionButton.svelte';

	let mode = 'amrap';
	let reps = 0;
	let holdTimeMs = 0;
	let duration = 60;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		mode = params.get('mode') ?? 'amrap';
		reps = parseInt(params.get('reps') ?? '0');
		holdTimeMs = parseInt(params.get('holdTimeMs') ?? '0');
		duration = parseInt(params.get('duration') ?? '60');
	});

	function formatHoldTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const centis = Math.floor((ms % 1000) / 10);
		return `${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}s`;
	}

	$: mainValue = mode === 'amrap' ? String(reps) : formatHoldTime(holdTimeMs);
	$: mainLabel = mode === 'amrap' ? 'Total Reps' : 'Hold Time';
</script>

<!-- Ambient Background -->
<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
	<div class="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow"></div>
	<div class="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-secondary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow" style="animation-delay: -2s;"></div>
</div>

<main class="relative z-20 w-full max-w-6xl mx-auto px-safe-margin min-h-screen flex flex-col items-center justify-center text-center">

	<!-- Header -->
	<div class="mb-lg text-center">
		<h1 class="font-display-xl text-[80px] md:text-[120px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-flicker-in">
			SESSION<br />COMPLETE
		</h1>
		<div class="flex items-center justify-center gap-4 mt-8 animate-fade-up delay-200">
			<div class="h-[2px] w-24 bg-secondary-container/50"></div>
			<p class="font-label-xl text-[16px] text-secondary-container uppercase tracking-[0.2em] font-bold flex items-center gap-2 animate-pulse-glow">
				<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
				GREAT WORK!
			</p>
			<div class="h-[2px] w-24 bg-secondary-container/50"></div>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full max-w-[1000px] mt-8">

		<!-- Duration -->
		<div class="flex-1 bg-surface-container-low/80 backdrop-blur-md border-2 border-primary-container/20 hover:border-primary-container transition-all duration-500 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-scale-up-fade delay-300 py-12 rounded-3xl">
			<div class="p-lg flex flex-col items-center justify-center">
				<span class="material-symbols-outlined text-primary-container text-[48px] opacity-70 mb-4">timer</span>
				<p class="font-label-xl text-[14px] text-on-surface-variant uppercase tracking-widest mb-4 border-b-2 border-primary-container/30 pb-2">Duration</p>
				<div class="font-display-lg text-[48px] italic font-black text-primary drop-shadow-[0_0_10px_rgba(225,253,255,0.3)] leading-none">{duration}s</div>
			</div>
		</div>

		<!-- Hero Result -->
		<div class="flex-1 bg-surface-container-low/80 backdrop-blur-md border-2 border-secondary-container/40 hover:border-secondary-container transition-all duration-500 text-center shadow-[0_0_50px_rgba(195,244,0,0.2)] animate-scale-up-fade delay-400 transform md:-translate-y-4 py-12 rounded-3xl">
			<div class="p-xl flex flex-col items-center justify-center">
				<span class="material-symbols-outlined text-secondary-container text-[64px] mb-4 drop-shadow-[0_0_15px_rgba(195,244,0,0.8)] animate-pulse-glow" style="font-variation-settings: 'FILL' 1;">
					{mode === 'amrap' ? 'fitness_center' : 'accessibility_new'}
				</span>
				<p class="font-label-xl text-[16px] text-white uppercase tracking-[0.2em] mb-4 border-b-2 border-secondary-container/50 pb-2">{mainLabel}</p>
				<div class="font-display-xl text-[80px] italic font-black text-secondary-container drop-shadow-[0_0_20px_rgba(195,244,0,0.5)] leading-none">{mainValue}</div>
			</div>
		</div>

		<!-- Mode -->
		<div class="flex-1 bg-surface-container-low/80 backdrop-blur-md border-2 border-primary-container/20 hover:border-primary-container transition-all duration-500 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-scale-up-fade delay-500 py-12 rounded-3xl">
			<div class="p-lg flex flex-col items-center justify-center">
				<span class="material-symbols-outlined text-primary-container text-[48px] opacity-70 mb-4">speed</span>
				<p class="font-label-xl text-[14px] text-on-surface-variant uppercase tracking-widest mb-4 border-b-2 border-primary-container/30 pb-2">Mode</p>
				<div class="font-display-lg text-[48px] italic font-black text-primary drop-shadow-[0_0_10px_rgba(225,253,255,0.3)] leading-none uppercase">{mode}</div>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="w-full max-w-[1000px] flex flex-col md:flex-row justify-center gap-8 mt-12 animate-fade-up delay-500">
		<ActionButton href="/select" icon="replay" text="Play Again" theme="primary" />
		<ActionButton href="/" icon="check_circle" text="Done" theme="secondary" glow={true} />
	</div>
</main>
