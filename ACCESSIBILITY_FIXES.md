# Accessibility and Astro Website Notes

The website is now being stabilized as an Astro application under `artifacts/web`.

## Accessibility

The current Astro shell includes:

- Skip-to-main-content navigation.
- Visible keyboard focus indicators.
- Semantic navigation landmarks.
- Accessible mobile navigation state using `aria-expanded`.
- Decorative brand marks marked as hidden from assistive technology.
- Responsive layouts and large, readable controls.
- A community **Listen** control using the browser/device speech engine.

## Important verification status

Accessibility improvements have been implemented in the Astro pages, but a full production accessibility audit has not been run in this stage. Do not describe WCAG conformance as independently certified without a completed audit.

## Legacy cleanup

The old React/Vite accessibility implementation is no longer the active website architecture. Current source of truth is:

`artifacts/web/src/layouts/Layout.astro`
`artifacts/web/src/pages/*.astro`
`artifacts/web/src/styles/global.css`

## Next verification

Before production deployment, verify keyboard-only navigation, screen-reader navigation, mobile navigation, focus behavior, and the legal routes against the built Astro output.
