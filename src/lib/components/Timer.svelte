<script lang="ts">
	/** Time remaining in seconds */
	export let seconds: number = 0;
	/** Label text above the timer */
	export let label: string = 'Time Remaining';
	/** Color theme: 'primary' or 'secondary' */
	export let theme: 'primary' | 'secondary' = 'secondary';

	$: formatted = formatTime(seconds);

	function formatTime(s: number): string {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
	}

	$: borderColor = theme === 'secondary' ? 'border-secondary-container/50' : 'border-primary-container/50';
	$: shadowColor = theme === 'secondary' ? 'shadow-[0_0_30px_rgba(195,244,0,0.3)]' : 'shadow-[0_0_30px_rgba(0,240,255,0.3)]';
	$: badgeBg = theme === 'secondary' ? 'bg-secondary-container/20 border-secondary-fixed text-secondary-fixed' : 'bg-primary-container/20 border-primary-fixed-dim text-primary-fixed-dim';
	$: textShadow = theme === 'secondary' ? 'drop-shadow-[0_0_20px_rgba(195,244,0,0.5)]' : 'drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]';
</script>

<div class="bg-surface-container-low/80 backdrop-blur-md border-2 {borderColor} {shadowColor} animate-pulse-glow p-md flex flex-col items-end rounded-3xl">
	<div class="inline-block px-3 py-1 {badgeBg} rounded-full font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold mb-2">
		{label}
	</div>
	<div class="font-display-xl text-[80px] text-white uppercase tracking-tighter italic leading-none font-black {textShadow} tabular-nums">
		{formatted}
	</div>
</div>
