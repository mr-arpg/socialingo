import confetti from 'canvas-confetti';

export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
}

const BRAND_COLORS = ['#10B981', '#F59E0B', '#6366F1', '#F43F5E', '#FCD34D'];

export function burstConfetti(intensity: 'small' | 'big' = 'small'): void {
  if (intensity === 'small') {
    void confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: BRAND_COLORS, disableForReducedMotion: true });
    return;
  }
  const end = Date.now() + 900;
  const frame = () => {
    void confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: BRAND_COLORS, disableForReducedMotion: true });
    void confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: BRAND_COLORS, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function downloadFile(filename: string, contents: string, mime = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([contents], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
