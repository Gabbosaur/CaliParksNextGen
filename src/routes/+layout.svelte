<script>
	import '../app.css';
</script>

<!-- Global overlays -->
<div class="fixed inset-0 scanlines z-[100] mix-blend-overlay pointer-events-none"></div>
<div class="fixed inset-0 w-full h-[150%] bg-gradient-to-b from-transparent via-primary-container/10 to-transparent z-[90] pointer-events-none animate-data-sweep"></div>

<!-- HUD System Labels -->
<div class="fixed top-sm left-sm font-label-caps text-label-caps text-primary-fixed-dim/60 tracking-widest z-50 pointer-events-none uppercase animate-float-hud">
	SYS.OP.MODE: ACTIVE<br />CALIPARKS_OS_v2.4
</div>
<div class="fixed top-sm right-sm font-label-caps text-label-caps text-secondary-fixed-dim/60 tracking-widest z-50 pointer-events-none text-right uppercase animate-float-hud" style="animation-delay: -1.5s;">
	LINK ACTIVE
</div>

<!-- Page content -->
<div class="relative z-10 tech-bg min-h-screen">
	<slot />
</div>
