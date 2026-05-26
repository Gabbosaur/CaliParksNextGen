<script lang="ts">
	/** Card theme color */
	export let theme: 'primary' | 'secondary' = 'primary';
	/** Card title */
	export let title: string = 'AMRAP';
	/** Card subtitle */
	export let subtitle: string = 'Rep King';
	/** Material icon name */
	export let icon: string = 'fitness_center';
	/** Class badge text */
	export let badge: string = 'Class: Dynamic';
	/** Card number */
	export let number: string = '01';
	/** Description text */
	export let description: string = '';
	/** Link href */
	export let href: string = '/session';

	$: borderColor = theme === 'primary' ? 'border-primary-container/20 hover:border-primary-container' : 'border-secondary-container/20 hover:border-secondary-container';
	$: hoverShadow = theme === 'primary' ? 'hover:shadow-[0_0_50px_rgba(0,242,255,0.3)]' : 'hover:shadow-[0_0_50px_rgba(195,244,0,0.3)]';
	$: iconCircleBorder = theme === 'primary' ? 'border-primary-container/20 group-hover:border-primary-container group-hover:bg-primary-container/10 group-hover:shadow-[0_0_60px_rgba(0,242,255,0.6)]' : 'border-secondary-container/20 group-hover:border-secondary-container group-hover:bg-secondary-container/10 group-hover:shadow-[0_0_60px_rgba(195,244,0,0.6)]';
	$: iconColor = theme === 'primary' ? 'group-hover:text-primary-container' : 'group-hover:text-secondary-container';
	$: titleHover = theme === 'primary' ? 'group-hover:text-primary-container' : 'group-hover:text-secondary-container';
	$: badgeStyle = theme === 'primary' ? 'bg-primary-container/20 border-primary-fixed-dim text-primary-fixed-dim shadow-[0_0_10px_rgba(0,242,255,0.3)]' : 'bg-secondary-container/20 border-secondary-fixed text-secondary-fixed shadow-[0_0_10px_rgba(195,244,0,0.3)]';
	$: ctaBorder = theme === 'primary' ? 'border-primary-container text-primary-container group-hover:bg-primary-container group-hover:text-on-primary-container group-hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]' : 'border-secondary-container text-secondary-container group-hover:bg-secondary-container group-hover:text-on-secondary-container group-hover:shadow-[0_0_30px_rgba(195,244,0,0.5)]';
	$: orbitBorder = theme === 'primary' ? 'border-primary-container/30 group-hover:border-primary-container' : 'border-secondary-container/30 group-hover:border-secondary-container';
	$: orbitDot = theme === 'primary' ? 'bg-primary-container shadow-[0_0_10px_#00f2ff]' : 'bg-secondary-container shadow-[0_0_10px_#c3f400]';
	$: descBorder = theme === 'primary' ? 'border-primary-container/50' : 'border-secondary-container/50';
	$: numColor = theme === 'primary' ? 'text-primary-container/50' : 'text-secondary-container/50';
</script>

<a {href}
	class="group flex-1 bg-surface-container-low/80 backdrop-blur-md border-l-4 border-r-4 border-t border-b {borderColor} hover:bg-surface-container/90 transition-all duration-500 relative overflow-hidden active:scale-[0.98] hover:scale-[1.02] {hoverShadow} text-left shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-[600px] rounded-4xl no-underline">

	<div class="h-full p-xl flex flex-col relative z-10">
		<div class="flex justify-between items-start mb-auto">
			<div class="inline-block px-4 py-1 {badgeStyle} border rounded-sm font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold animate-pulse-glow">{badge}</div>
			<div class="{numColor} font-stats-num text-2xl font-bold italic">{number}</div>
		</div>

		<div class="self-center w-56 h-56 rounded-full bg-surface/50 border-4 {iconCircleBorder} flex items-center justify-center transition-all duration-500 relative my-8">
			<span class="material-symbols-outlined text-on-surface-variant {iconColor} transition-all duration-500 group-hover:-translate-y-2 relative z-10" style="font-size: 120px;">{icon}</span>
			<div class="absolute inset-[-20px] border {orbitBorder} rounded-full transition-colors duration-500 animate-spin-slow" style={theme === 'secondary' ? 'animation-direction: reverse;' : ''}>
				<div class="absolute -top-1 left-1/2 -ml-1 w-2 h-2 rounded-full {orbitDot} animate-pulse-glow"></div>
			</div>
		</div>

		<div class="mt-auto relative z-10">
			<h3 class="text-white mb-2 font-display-lg text-[40px] uppercase italic leading-none {titleHover} transition-colors duration-300 drop-shadow-lg">
				{title}<br /><span class="text-3xl text-on-surface-variant">{subtitle}</span>
			</h3>
			<p class="font-label-xl text-[14px] text-on-surface-variant mb-8 border-l-2 {descBorder} pl-4 bg-surface/30 p-2">
				{description}
			</p>
			<div class="w-full h-16 bg-transparent border-2 {ctaBorder} font-display-lg text-[24px] flex items-center justify-center uppercase italic tracking-wider transition-all duration-500 relative overflow-hidden rounded-full">
				<span class="relative z-10">Initiate Protocol</span>
				<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
			</div>
		</div>
	</div>
</a>
