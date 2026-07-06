// Client-only helper for scrolling/centering sections. Used by Navigation and footer links.
// Uses requestAnimationFrame with easing to produce smoother, less aggressive motion.
type EasingFn = (t: number) => number

const easeInOutCubic: EasingFn = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function animateScrollTo(targetY: number, duration = 600, easing: EasingFn = easeInOutCubic) {
  return new Promise<void>((resolve) => {
    const startY = window.pageYOffset
    const delta = targetY - startY
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      const eased = easing(t)
      window.scrollTo(0, Math.round(startY + delta * eased))
      if (t < 1) requestAnimationFrame(tick)
      else resolve()
    }

    requestAnimationFrame(tick)
  })
}

export async function scrollToSection(sectionId: string) {
  if (typeof window === 'undefined') return
  const element = document.getElementById(sectionId)
  if (!element) return

  const centerWithCorrection = async (el: HTMLElement, attempts = 0) => {
    const rect = el.getBoundingClientRect()
    const absoluteTop = rect.top + window.pageYOffset
    const target = Math.max(0, absoluteTop + rect.height / 2 - window.innerHeight / 2)

    // animate with a gentle duration
    await animateScrollTo(target, 650)

    // After animation finishes, re-check and nudge if off by > 8px
    if (attempts < 3) {
      const r2 = el.getBoundingClientRect()
      const mid = r2.top + r2.height / 2
      const delta = Math.abs(mid - window.innerHeight / 2)
      if (delta > 8) await centerWithCorrection(el, attempts + 1)
    }
  }

  if (sectionId === 'events') {
    // Two-phase scroll: softly move to the top (not an abrupt jump), then center.
    await animateScrollTo(0, 300)
    // small tick then center smoothly
    setTimeout(() => { centerWithCorrection(element) }, 80)
  } else {
    // For other sections, prefer a gentler scroll-to-start
    const rect = element.getBoundingClientRect()
    const absoluteTop = rect.top + window.pageYOffset
    await animateScrollTo(Math.max(0, absoluteTop), 600)
  }
}

export default scrollToSection
