<script lang="ts">
	/** Current rep count */
	export let count: number = 0;
	/** Label text */
	export let label: string = 'Reps';
	/** Optional target (shows "/ X REPS") */
	export let target: number | null = null;
</script>

<div class="bg-surface-container-low/80 backdrop-blur-md border-2 border-primary-container/50 shadow-[0_0_40px_rgba(0,240,255,0.4)] animate-pulse-glow p-lg flex flex-col items-center justify-center min-w-[300px] rounded-4xl">
	<div class="inline-block px-4 py-1.5 bg-primary-container/20 border border-primary-fixed-dim text-primary-fixed-dim rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold mb-4 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
		{label}
	</div>
	<div class="font-display-xl text-[140px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_30px_rgba(0,240,255,0.6)] my-2">
		{count}
	</div>
	{#if target}
		<span class="font-headline-md text-[28px] text-primary-container italic font-bold uppercase tracking-wider">/ {target} REPS</span>
	{/if}
</div>
