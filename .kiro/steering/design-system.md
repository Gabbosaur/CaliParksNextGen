---
inclusion: auto
---

# CaliParks NextGen — Design System & UI Guidelines

This project follows the "Cyber-Arcade Kinetic System" design language. All UI implementation must adhere to these rules.

## Reference Files

UI prototypes are in `.kiro/specs/caliparks-nextgen-platform/ui-reference/`:
- `welcome.html` — Idle/Login screen
- `mode-selection.html` — AMRAP vs ISO selection
- `live-hud.html` — Active workout HUD
- `session-results.html` — Post-workout results
- `leaderboard.html` — Global rankings

Full technical design: #[[file:.kiro/specs/caliparks-nextgen-platform/design.md]]

## Core Rules

1. **Dark theme only**. Background is `#05070a` or `#111318`. Never use light backgrounds.
2. **Neon accents**: Cyan (`#00f2ff`) for primary interactions, Lime (`#c3f400`) for success/achievements, Violet (`#d1bcff`) for alerts/warnings.
3. **Typography**: Montserrat italic black for display text, Inter for body/labels, JetBrains Mono for HUD micro-labels. All headlines are uppercase italic.
4. **Touch targets**: Minimum 72px height for all interactive elements.
5. **Safe margin**: 64px padding from screen edges (kiosk safe area).
6. **Glassmorphism panels**: `bg-surface-container-low/80 backdrop-blur-md border-2 border-{color}/20 rounded-3xl`.
7. **Glow effects**: Use `box-shadow: 0 0 Xpx rgba(color, opacity)` on active/highlighted elements.
8. **Animations**: Always wrap in `@media (prefers-reduced-motion: no-preference)`. Use `pulse-glow` (4s), `fade-up` (1s staggered), `data-sweep` (8s) as standard patterns.
9. **HUD overlays**: Fixed-position 10px JetBrains Mono labels in corners showing system status. These are decorative and pointer-events-none.
10. **Buttons**: Pill shape (`rounded-full`), border-2 with color, hover fills solid + adds glow shadow. Include sweep animation (white/20 gradient translateX).
11. **Icons**: Google Material Symbols Outlined. Use `font-variation-settings: 'FILL' 1` for emphasized/active icons.
12. **No light mode**. No white backgrounds. No light-colored large surfaces.

## Color Tokens (Tailwind)

```
primary: #e1fdff
primary-container: #00f2ff
primary-fixed-dim: #00dbe7
secondary-container: #c3f400
secondary-fixed-dim: #abd600
tertiary-fixed-dim: #d1bcff
surface: #111318
surface-container-low: #1a1c20
surface-container-lowest: #0c0e12
on-surface: #e2e2e8
on-surface-variant: #b9cacb
outline-variant: #3a494b
```

## Component Patterns

- **Stat cards**: Icon + label-caps header + large display number + comparison text
- **Leaderboard rows**: rounded-3xl, rank number + avatar + name + location + score. #1 gets lime accent.
- **Mode cards**: Full-height, icon circle with orbit animation, class badge, description, CTA button
- **QR panel**: neon-box-glow + pulse-breathing + HUD bracket corners
