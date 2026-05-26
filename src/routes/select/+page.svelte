<script lang="ts">
	import GameModeCard from '@components/GameModeCard.svelte';
	import { initAudio } from '@audio/audio-engine';
	import { onMount } from 'svelte';

	onMount(() => {
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

		<!-- Mode Cards -->
		<div class="flex flex-col md:flex-row gap-8 xl:gap-16 justify-center items-stretch h-[550px] w-full animate-fade-up delay-200">
			<GameModeCard
				theme="primary"
				title="AMRAP"
				subtitle="Rep King"
				icon="fitness_center"
				badge="Class: Dynamic"
				number="01"
				description="Count max reps against the clock. Maximum velocity, maximum effort."
				href="/select/timer"
			/>

			<GameModeCard
				theme="secondary"
				title="Hold Steady"
				subtitle="Isometric"
				icon="accessibility_new"
				badge="Class: Static"
				number="02"
				description="Hold form as long as possible. Structural integrity under tension."
				href="/session?mode=iso"
			/>
		</div>
	</div>
</main>
