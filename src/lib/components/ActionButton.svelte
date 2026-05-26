<script lang="ts">
	/** Button text */
	export let text: string = 'Action';
	/** Material icon name */
	export let icon: string = '';
	/** Link href (if set, renders as <a>) */
	export let href: string = '';
	/** Color theme */
	export let theme: 'primary' | 'secondary' = 'primary';
	/** Whether to show breathing glow */
	export let glow: boolean = false;

	$: borderColor = theme === 'primary' ? 'border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary-container hover:shadow-[0_0_40px_rgba(0,242,255,0.6)]' : 'border-secondary-container text-secondary-container hover:bg-secondary-container hover:text-on-secondary-container hover:shadow-[0_0_40px_rgba(195,244,0,0.6)]';
</script>

{#if href}
<a {href}
	class="group h-16 min-w-[250px] bg-surface-container-low/80 backdrop-blur-md border-2 {borderColor} font-display-lg text-[24px] flex items-center justify-center uppercase italic tracking-wider transition-all duration-500 relative overflow-hidden rounded-full no-underline"
	class:animate-breathe-glow={glow}>
	<div class="relative z-10 flex items-center gap-sm">
		{#if icon}<span class="material-symbols-outlined text-[28px]" style={theme === 'secondary' ? "font-variation-settings: 'FILL' 1;" : ''}>{icon}</span>{/if}
		{text}
	</div>
	<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
</a>
{:else}
<button
	class="group h-16 min-w-[250px] bg-surface-container-low/80 backdrop-blur-md border-2 {borderColor} font-display-lg text-[24px] flex items-center justify-center uppercase italic tracking-wider transition-all duration-500 relative overflow-hidden rounded-full"
	class:animate-breathe-glow={glow}
	on:click>
	<div class="relative z-10 flex items-center gap-sm">
		{#if icon}<span class="material-symbols-outlined text-[28px]" style={theme === 'secondary' ? "font-variation-settings: 'FILL' 1;" : ''}>{icon}</span>{/if}
		{text}
	</div>
	<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
</button>
{/if}
