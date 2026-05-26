<script lang="ts">
	/** Hold time in milliseconds */
	export let timeMs: number = 0;
	/** Whether currently holding */
	export let isHolding: boolean = false;

	$: formatted = formatHoldTime(timeMs);

	function formatHoldTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const centis = Math.floor((ms % 1000) / 10);
		return `${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
	}
</script>

<div class="bg-surface-container-low/80 backdrop-blur-md border-2 border-secondary-container/50 shadow-[0_0_30px_rgba(195,244,0,0.3)] p-md flex flex-col items-end rounded-3xl"
	class:animate-breathe-glow={isHolding}>
	<div class="inline-block px-3 py-1 bg-secondary-container/20 border border-secondary-fixed text-secondary-fixed rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold mb-2">
		{isHolding ? 'HOLDING' : 'READY'}
	</div>
	<div class="font-display-xl text-[80px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(195,244,0,0.5)] tabular-nums">
		{formatted}
	</div>
</div>
