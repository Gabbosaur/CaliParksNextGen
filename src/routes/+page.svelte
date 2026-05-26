<script lang="ts">
	// Welcome / Idle page - CaliParks NextGen Kiosk
</script>

<!-- Ambient Background Lighting -->
<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
	<div class="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow"></div>
	<div class="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-secondary-container/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow" style="animation-delay: -2s;"></div>
</div>

<!-- Main Content -->
<main class="relative z-20 w-full max-w-6xl mx-auto px-safe-margin min-h-screen flex flex-col items-center justify-center text-center">

	<!-- Brand Header -->
	<div class="mb-xl transform transition-transform duration-700 hover:scale-105">
		<h1 class="font-display-xl text-[100px] leading-[100px] italic font-black text-primary uppercase tracking-tighter neon-glow">
			CALIPARKS<br />NEXTGEN
		</h1>
		<div class="flex items-center justify-center gap-4 mt-sm opacity-80">
			<div class="h-px w-16 bg-primary-container shadow-[0_0_10px_#00f2ff]"></div>
			<p class="font-label-xl text-label-xl text-primary tracking-[0.3em]">ATHLETE_HUD // V2.4 ONLINE</p>
			<div class="h-px w-16 bg-primary-container shadow-[0_0_10px_#00f2ff]"></div>
		</div>
	</div>

	<!-- Interactive Core -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-lg w-full max-w-5xl backdrop-blur-xl bg-surface-container-lowest/80 p-lg rounded-3xl border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">

		<!-- Decorative corners -->
		<div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-container rounded-tl-3xl"></div>
		<div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-container rounded-tr-3xl"></div>
		<div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary-container rounded-bl-3xl"></div>
		<div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-container rounded-br-3xl"></div>

		<!-- Scan to Login -->
		<div class="flex flex-col items-center justify-center p-md bg-[#111318]/80 rounded-2xl neon-box-glow animate-pulse-glow relative overflow-hidden">
			<h2 class="font-headline-md text-headline-md italic font-bold text-primary mb-md">Scan to Login</h2>

			<!-- QR Code Placeholder -->
			<div class="relative w-72 h-72 mb-md">
				<div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-container rounded-tl-xl"></div>
				<div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary-container rounded-tr-xl"></div>
				<div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary-container rounded-bl-xl"></div>
				<div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-container rounded-br-xl"></div>

				<div class="w-full h-full bg-white/90 p-4 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)]">
					<div class="w-full h-full bg-surface-container flex items-center justify-center rounded-lg">
						<span class="material-symbols-outlined text-primary-container" style="font-size: 80px;">qr_code_2</span>
					</div>
				</div>
			</div>

			<p class="font-body-md text-body-md text-primary-container flex items-center gap-2">
				<span class="material-symbols-outlined">smartphone</span>
				Open app to sync stats
			</p>
		</div>

		<!-- Guest Mode -->
		<div class="flex flex-col items-center justify-center gap-lg">
			<div class="text-center">
				<h3 class="font-headline-lg text-headline-lg italic font-bold text-secondary mb-xs">No App?</h3>
				<p class="font-body-lg text-body-lg text-on-surface-variant">Start an unranked session.</p>
			</div>

			<a href="/select"
				class="w-full h-touch-target-min bg-primary-container text-[#111318] font-label-xl text-label-xl rounded-2xl shadow-[0_0_20px_rgba(0,242,255,0.5)] hover:bg-primary-fixed hover:shadow-[0_0_40px_rgba(0,242,255,0.8)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-sm group relative overflow-hidden font-bold tracking-widest no-underline">
				<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
				<span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
				<span class="relative z-10 uppercase">Protocol: Guest</span>
			</a>
		</div>
	</div>

	<!-- Touch to Start -->
	<div class="mt-xl animate-pulse-glow cursor-pointer flex items-center gap-sm text-primary-container hover:text-primary transition-colors">
		<span class="material-symbols-outlined text-4xl">touch_app</span>
		<span class="font-label-xl text-label-xl uppercase tracking-widest font-bold">Touch Anywhere to Start</span>
	</div>
</main>
