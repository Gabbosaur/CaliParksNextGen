<script lang="ts">
	/** Material icon name */
	export let icon: string = 'timer';
	/** Label text */
	export let label: string = 'Stat';
	/** Main value to display */
	export let value: string = '0';
	/** Comparison text (e.g., "+2:10 vs avg") */
	export let comparison: string = '';
	/** Color theme */
	export let theme: 'primary' | 'secondary' = 'primary';
	/** Whether this is the hero (elevated) card */
	export let hero: boolean = false;

	$: borderColor = theme === 'secondary' ? 'border-secondary-container/40 hover:border-secondary-container' : 'border-primary-container/20 hover:border-primary-container';
	$: iconColor = theme === 'secondary' ? 'text-secondary-container' : 'text-primary-container';
	$: valueColor = theme === 'secondary' ? 'text-secondary-container drop-shadow-[0_0_20px_rgba(195,244,0,0.5)]' : 'text-primary drop-shadow-[0_0_10px_rgba(225,253,255,0.3)]';
	$: shadowStyle = hero ? 'shadow-[0_0_50px_rgba(195,244,0,0.2)]' : 'shadow-[0_0_30px_rgba(0,0,0,0.5)]';
	$: borderBottom = theme === 'secondary' ? 'border-secondary-container/50' : 'border-primary-container/30';
</script>

<div class="group flex-1 bg-surface-container-low/80 backdrop-blur-md border-2 {borderColor} transition-all duration-500 relative overflow-hidden text-center {shadowStyle} py-12 rounded-3xl"
	class:md:-translate-y-4={hero}>
	<div class="glow-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
		class:bg-primary-container/10={theme === 'primary'}
		class:bg-secondary-container/20={theme === 'secondary'}></div>
	<div class="h-full p-lg flex flex-col items-center justify-center relative z-10">
		<span class="material-symbols-outlined {iconColor} opacity-70 mb-4" style="font-size: {hero ? '64px' : '48px'}; {hero ? "font-variation-settings: 'FILL' 1;" : ''}">{icon}</span>
		<p class="font-label-xl text-[{hero ? '16' : '14'}px] {hero ? 'text-white' : 'text-on-surface-variant'} uppercase tracking-widest mb-4 border-b-2 {borderBottom} pb-2">{label}</p>
		<div class="font-display-lg text-[{hero ? '80' : '48'}px] italic font-black {valueColor} leading-none my-4">{value}</div>
		{#if comparison}
			<div class="flex items-center justify-center gap-xs text-secondary-fixed-dim font-label-xl text-[14px] mt-4">
				<span class="material-symbols-outlined text-[18px]">trending_up</span>
				<span>{comparison}</span>
			</div>
		{/if}
	</div>
</div>
