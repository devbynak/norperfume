/**
 * Subtle haptic feedback for mobile actions.
 * Uses the Vibration API (Android + most mobile browsers).
 * iOS Safari ignores navigator.vibrate, but the call is a safe no-op.
 *
 * Patterns are intentionally short to mimic iOS Taptic-style ticks.
 */

type HapticStyle = "light" | "medium" | "heavy" | "selection" | "success" | "warning";

const PATTERNS: Record<HapticStyle, number | number[]> = {
  light: 8,
  selection: 5,
  medium: 14,
  heavy: 22,
  success: [10, 40, 14],
  warning: [18, 60, 18],
};

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(max-width: 768px)").matches;

export function haptic(style: HapticStyle = "light") {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  // Only fire on mobile viewports — avoids weird desktop behavior on hybrid devices.
  if (!isMobile()) return;
  try {
    navigator.vibrate(PATTERNS[style]);
  } catch {
    /* no-op */
  }
}
