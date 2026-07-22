# Check-IN Portugal Redesign — Design System & Animation Strategy

## 1. Color Palette

We utilize a hybrid dark-navy/light-surface design system to create a sophisticated, high-end European brand image.

```css
:root {
  /* Brand Core */
  --color-european-blue: #004494;
  --color-accent-blue: #0066FF;
  --color-accent-yellow: #FFC000; /* Soft European Gold */
  
  /* Dark Theme Surfaces (Hero, Landing Experience) */
  --bg-deep-navy: #0A0E1A;
  --surface-navy: rgba(19, 27, 46, 0.7);
  --border-navy: rgba(255, 255, 255, 0.08);
  
  --text-dark-primary: #F8FAFC;
  --text-dark-secondary: #94A3B8;
  --text-dark-muted: #64748B;

  /* Light Theme Surfaces (About Us, News, Details) */
  --bg-light: #FAFAFC;
  --surface-light: #FFFFFF;
  --border-light: #E2E8F0;
  
  --text-light-primary: #0F172A;
  --text-light-secondary: #475569;
  --text-light-muted: #94A3B8;

  /* Glassmorphism Details */
  --glass-blur: 16px;
  --glass-bg: rgba(10, 14, 26, 0.6);
}
```

---

## 2. Typography

*   **Primary Sans-Serif:** `Outfit` (for headings) and `Inter` (for readable, clean copy).
*   **Scale:**
    *   **Hero Heading:** `clamp(3rem, 10vw, 9rem)` (Huge scale, custom letter spacing).
    *   **Section Heading (H1):** `clamp(2.25rem, 5vw, 4.5rem)`
    *   **Subsection Heading (H2):** `clamp(1.75rem, 3vw, 2.75rem)`
    *   **Body Copy:** `1rem (16px)` with `leading-relaxed (1.6)`.

---

## 3. High-Fidelity UI Concept Reference

The design principles are demonstrated in the following conceptual layout generated for the homepage hero and impact statistics:

![Check-IN Redesign Concept](file:///Users/furkanaslan/.gemini/antigravity-ide/brain/1e7082eb-7005-4b57-bebd-ba4ef07e18de/homepage_hero_concept_1780651454748.png)

*Key Design Highlights in Mockup:*
*   **Dynamic Split Video Grid:** Cinematic video windows display cultural exchanges and volunteering.
*   **Massive Typography Hero:** Bold center stage typography with stark contrasting call-to-actions.
*   **Clear Statistics Impact Section:** Ultra-clean metrics card displaying quantitative successes.

---

## 4. Layout Wireframes (Component Blueprint)

### Standard Grid Layout (12-Column Grid)
*   **Container Width:** `max-w-7xl` (`1280px`).
*   **Desktop Gaps:** `gap-8` (`32px`), Mobile Gaps: `gap-4` (`16px`).

```
+-------------------------------------------------------------+
| [LOGO] Check-IN        Projetos  Oportunidades  [PT | EN]   |
+-------------------------------------------------------------+
|                                                             |
|                          CHECK-IN                           |
|                                                             |
|           "Conectamos Pessoas. Criamos Oportunidades."      |
|                                                             |
|              [ Explorar Projetos ]  [ Participar ]          |
|                                                             |
+-------------------------------------------------------------+
```

---

## 5. Animation Strategy

To achieve the modern Webflow/Awwwards feel, we orchestrate animation layers using a precise combination of tools:

### A. Smooth Scroll (Lenis)
We implement Lenis globally to standardize scrolling friction across hardware platforms.
```typescript
// init Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### B. GSAP SplitText Hero Transition
1.  **Entrance Sequence:**
    *   Letters of "CHECK-IN" start with `opacity: 0`, `y: 100`, scale down to `0.8`.
    *   Animate in via `stagger: 0.08` using custom cubic-bezier curves (`power4.out`).
2.  **Transition to Hero Video Scale:**
    *   Background container expands from a small central window to a fullscreen overlay.
    *   Taglines fade in and scale up from `y: 30`.

### C. Framer Motion Layout Morphing (Filters)
Opportunities and Projects tabs use Framer Motion's `layoutId` to morph borders or background pills during state updates seamlessly:
```tsx
<motion.div
  layoutId="active-pill"
  className="absolute inset-0 bg-blue-600 rounded-full"
  transition={{ type: "spring", stiffness: 380, damping: 30 }}
/>
```

### D. ScrollTrigger Parallax
Project cards slide into viewport using a staggered skew-reveal effect. Background cards parallax downward at a factor of `0.15` as the user scrolls.
