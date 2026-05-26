<script lang="ts">
	import GameModeCard from '@components/GameModeCard.svelte';
	import { initAudio } from '@audio/audio-engine';
	import { onMount } from 'svelte';

	let selectedDuration = 60;
	const durations = [30, 60, 90, 120];

	onMount(() => {
		// Init audio on this page (user gesture from navigation)
		initAudio();
	});
</script>

<!-- Ambient Background Lighting -->
<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
	<div class="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow"></div>
	<div class="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-secondary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow" style="animation-delay: -2s;"></div>
</div>

<main class="relative z-10 flex-1 w-full pt-16 pb-safe-margin px-safe-margin flex flex-col justify-center items-center min-h-screen">
	<div class="w-full max-w-[1400px] mx-auto flex flex-col h-full justify-center">

		<!-- Header -->
		<div class="mb-lg text-center relative z-20 animate-fade-up">
			<h2 class="font-display-xl text-[100px] md:text-[140px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse-glow">SELECT MODE</h2>
			<div class="flex items-center justify-center gap-4 mt-4">
				<div class="h-[2px] w-24 bg-primary-container/50"></div>
				<p class="font-label-xl text-[16px] text-primary-fixed-dim uppercase tracking-[0.3em] font-bold">Protocol Initialization Required</p>
				<div class="h-[2px] w-24 bg-primary-container/50"></div>
			</div>
		</div>

		<!-- Timer Duration Selector -->
		<div class="flex justify-center gap-sm mb-lg animate-fade-up delay-100">
			<div class="flex gap-sm p-sm rounded-full border border-primary-container/20 bg-surface-container-lowest/50 backdrop-blur-md">
				{#each durations as d}
					<button
						class="h-[48px] px-md rounded-full font-label-xl text-[14px] uppercase tracking-wider transition-all duration-300 {selectedDuration === d ? 'bg-[rgba(0,242,255,0.2)] border border-primary-container text-primary-container shadow-[0_0_10px_rgba(0,242,255,0.2)]' : 'text-on-surface-variant hover:text-primary-container'}"
						on:click={() => selectedDuration = d}
					>
						{d}s
					</button>
				{/each}
			</div>
		</div>

		<!-- Mode Cards -->
		<div class="flex flex-col md:flex-row gap-8 xl:gap-16 justify-center items-stretch h-[550px] w-full animate-fade-up delay-200">
			<GameModeCard
				theme="primary"
				title="AMRAP"
				subtitle="Rep King"
				icon="fitness_center"
				badge="Class: Dynamic"
				number="01"
				description="Count max reps in {selectedDuration}s. Maximum velocity, maximum effort."
				href="/session?mode=amrap&duration={selectedDuration}"
			/>

			<GameModeCard
				theme="secondary"
				title="Hold Steady"
				subtitle="Isometric"
				icon="accessibility_new"
				badge="Class: Static"
				number="02"
				description="Hold form as long as possible. Structural integrity under tension."
				href="/session?mode=iso&duration={selectedDuration}"
			/>
		</div>
	</div>
</main>
