<script lang="ts">
	// Mode Selection page
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
			<h2 class="font-display-xl text-[140px] text-white uppercase tracking-tighter italic leading-none font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse-glow">SELECT MODE</h2>
			<div class="flex items-center justify-center gap-4 mt-4">
				<div class="h-[2px] w-24 bg-primary-container/50"></div>
				<p class="font-label-xl text-[16px] text-primary-fixed-dim uppercase tracking-[0.3em] font-bold">Protocol Initialization Required</p>
				<div class="h-[2px] w-24 bg-primary-container/50"></div>
			</div>
		</div>

		<!-- Mode Cards -->
		<div class="flex flex-col md:flex-row gap-8 xl:gap-16 justify-center items-stretch h-[600px] w-full mt-8">

			<!-- AMRAP Card -->
			<a href="/session?mode=amrap"
				class="group flex-1 bg-surface-container-low/80 backdrop-blur-md border-l-4 border-r-4 border-t border-b border-primary-container/20 hover:border-primary-container hover:bg-surface-container/90 transition-all duration-500 relative overflow-hidden active:scale-[0.98] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(0,242,255,0.3)] text-left shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-[600px] animate-fade-up delay-100 rounded-4xl no-underline">

				<div class="h-full p-xl flex flex-col relative z-10">
					<div class="flex justify-between items-start mb-auto">
						<div class="inline-block px-4 py-1 bg-primary-container/20 border border-primary-fixed-dim text-primary-fixed-dim rounded-sm font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)] animate-pulse-glow">Class: Dynamic</div>
						<div class="text-primary-container/50 font-stats-num text-2xl font-bold italic">01</div>
					</div>

					<div class="self-center w-56 h-56 rounded-full bg-surface/50 border-4 border-primary-container/20 flex items-center justify-center group-hover:border-primary-container group-hover:bg-primary-container/10 group-hover:shadow-[0_0_60px_rgba(0,242,255,0.6)] transition-all duration-500 relative my-8">
						<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-all duration-500 group-hover:-translate-y-2 relative z-10" style="font-size: 120px; filter: drop-shadow(0 0 15px rgba(0,242,255,0.8));">fitness_center</span>
						<div class="absolute inset-[-20px] border border-primary-container/30 rounded-full group-hover:border-primary-container transition-colors duration-500 animate-spin-slow">
							<div class="absolute -top-1 left-1/2 -ml-1 w-2 h-2 rounded-full bg-primary-container shadow-[0_0_10px_#00f2ff] animate-pulse-glow"></div>
						</div>
					</div>

					<div class="mt-auto relative z-10">
						<h3 class="text-white mb-2 font-display-lg text-[40px] uppercase italic leading-none group-hover:text-primary-container transition-colors duration-300 drop-shadow-lg">
							AMRAP<br /><span class="text-3xl text-on-surface-variant">Rep King</span>
						</h3>
						<p class="font-label-xl text-[14px] text-on-surface-variant mb-8 border-l-2 border-primary-container/50 pl-4 bg-surface/30 p-2">
							Count max reps in 60s. Maximum velocity, maximum effort.
						</p>
						<div class="w-full h-16 bg-transparent border-2 border-primary-container text-primary-container font-display-lg text-[24px] flex items-center justify-center uppercase italic tracking-wider group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-500 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] rounded-full">
							<span class="relative z-10">Initiate Protocol</span>
							<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
						</div>
					</div>
				</div>
			</a>

			<!-- ISO Card -->
			<a href="/session?mode=iso"
				class="group flex-1 bg-surface-container-low/80 backdrop-blur-md border-l-4 border-r-4 border-t border-b border-secondary-container/20 hover:border-secondary-container hover:bg-surface-container/90 transition-all duration-500 relative overflow-hidden active:scale-[0.98] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(195,244,0,0.3)] text-left shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-[600px] animate-fade-up delay-200 rounded-4xl no-underline">

				<div class="h-full p-xl flex flex-col relative z-10">
					<div class="flex justify-between items-start mb-auto">
						<div class="inline-block px-4 py-1 bg-secondary-container/20 border border-secondary-fixed text-secondary-fixed rounded-sm font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold shadow-[0_0_10px_rgba(195,244,0,0.3)] animate-pulse-glow">Class: Static</div>
						<div class="text-secondary-container/50 font-stats-num text-2xl font-bold italic">02</div>
					</div>

					<div class="self-center w-56 h-56 rounded-full bg-surface/50 border-4 border-secondary-container/20 flex items-center justify-center group-hover:border-secondary-container group-hover:bg-secondary-container/10 group-hover:shadow-[0_0_60px_rgba(195,244,0,0.6)] transition-all duration-500 relative my-8">
						<span class="material-symbols-outlined text-on-surface-variant group-hover:text-secondary-container transition-all duration-500 group-hover:-translate-y-2 relative z-10" style="font-size: 120px; filter: drop-shadow(0 0 15px rgba(195,244,0,0.8));">accessibility_new</span>
						<div class="absolute inset-[-20px] border border-secondary-container/30 rounded-full group-hover:border-secondary-container transition-colors duration-500 animate-spin-slow" style="animation-direction: reverse;">
							<div class="absolute -bottom-1 right-1/2 -mr-1 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_10px_#c3f400] animate-pulse-glow"></div>
						</div>
					</div>

					<div class="mt-auto relative z-10">
						<h3 class="text-white mb-2 font-display-lg text-[40px] uppercase italic leading-none group-hover:text-secondary-container transition-colors duration-300 drop-shadow-lg">
							Hold Steady<br /><span class="text-3xl text-on-surface-variant">Isometric</span>
						</h3>
						<p class="font-label-xl text-[14px] text-on-surface-variant mb-8 border-l-2 border-secondary-container/50 pl-4 bg-surface/30 p-2">
							Hold form as long as possible. Structural integrity under tension.
						</p>
						<div class="w-full h-16 bg-transparent border-2 border-secondary-container text-secondary-container font-display-lg text-[24px] flex items-center justify-center uppercase italic tracking-wider group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all duration-500 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(195,244,0,0.5)] rounded-full">
							<span class="relative z-10">Initiate Protocol</span>
							<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
						</div>
					</div>
				</div>
			</a>
		</div>
	</div>
</main>
