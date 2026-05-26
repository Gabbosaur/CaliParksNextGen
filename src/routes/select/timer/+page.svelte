<script lang="ts">
	let selectedDuration: number | null = null;
	const durations = [30, 60, 90, 120];
</script>

<!-- Ambient Background Lighting -->
<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
	<div class="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow"></div>
</div>

<main class="relative z-10 flex-1 w-full pt-16 pb-safe-margin px-safe-margin flex flex-col justify-center items-center min-h-screen">
	<div class="w-full max-w-[1000px] mx-auto flex flex-col items-center justify-center">

		<!-- Header -->
		<div class="mb-xl text-center animate-fade-up">
			<h2 class="font-display-xl text-[100px] md:text-[120px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse-glow">SET TIME</h2>
			<div class="flex items-center justify-center gap-4 mt-4">
				<div class="h-[2px] w-16 bg-primary-container/50"></div>
				<p class="font-label-xl text-[16px] text-primary-fixed-dim uppercase tracking-[0.3em] font-bold">Select Round Duration</p>
				<div class="h-[2px] w-16 bg-primary-container/50"></div>
			</div>
		</div>

		<!-- Duration Grid -->
		<div class="grid grid-cols-2 gap-md w-full max-w-[700px] animate-fade-up delay-100">
			{#each durations as d, i}
				<button
					class="group relative h-[160px] bg-surface-container-low/80 backdrop-blur-md border-2 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center active:scale-95 {selectedDuration === d ? 'border-primary-container bg-primary-container/10 shadow-[0_0_40px_rgba(0,242,255,0.4)]' : 'border-primary-container/20 hover:border-primary-container/60 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]'}"
					on:click={() => selectedDuration = d}
				>
					<div class="font-display-lg text-[64px] italic font-black leading-none transition-colors duration-300 {selectedDuration === d ? 'text-primary-container drop-shadow-[0_0_15px_rgba(0,242,255,0.6)]' : 'text-white group-hover:text-primary-container'}">
						{d}
					</div>
					<span class="font-label-xl text-[16px] uppercase tracking-widest mt-2 transition-colors duration-300 {selectedDuration === d ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}">
						seconds
					</span>
					{#if selectedDuration === d}
						<div class="absolute top-3 right-3">
							<span class="material-symbols-outlined text-primary-container text-[24px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- GO Button -->
		<div class="mt-xl w-full max-w-[700px] animate-fade-up delay-300">
			{#if selectedDuration}
				<a href="/session?mode=amrap&duration={selectedDuration}"
					class="group w-full h-[80px] bg-primary-container text-[#111318] font-display-lg text-[32px] rounded-full flex items-center justify-center uppercase italic tracking-wider shadow-[0_0_30px_rgba(0,242,255,0.5)] hover:shadow-[0_0_60px_rgba(0,242,255,0.8)] active:scale-95 transition-all duration-300 relative overflow-hidden no-underline font-black">
					<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
					<span class="relative z-10 flex items-center gap-sm">
						<span class="material-symbols-outlined text-[36px]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
						GO — {selectedDuration}s
					</span>
				</a>
			{:else}
				<div class="w-full h-[80px] border-2 border-primary-container/30 rounded-full flex items-center justify-center">
					<span class="font-label-xl text-[18px] text-on-surface-variant uppercase tracking-widest">Select a duration to begin</span>
				</div>
			{/if}
		</div>

		<!-- Back -->
		<a href="/select" class="mt-lg font-label-xl text-[14px] text-on-surface-variant uppercase tracking-widest hover:text-primary-container transition-colors flex items-center gap-xs no-underline">
			<span class="material-symbols-outlined text-[18px]">arrow_back</span>
			Back to mode select
		</a>
	</div>
</main>
