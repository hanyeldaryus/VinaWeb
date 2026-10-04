/*
 * Face follows the cursor by scrubbing hero.mp4.
 * Smooth scrubbing needs a keyframe on every frame. Re-encode with:
 *   ffmpeg -i hero.mp4 -an -vcodec libx264 -crf 24 -g 1 -pix_fmt yuv420p -vf scale=960:-2 -movflags +faststart hero-scrub.mp4
 */
(function () {
  const video = document.getElementById('hero-video');
  const stage = document.querySelector('.hero-stage');
  const marker = document.getElementById('scrub-marker');
  const pct = document.getElementById('frame-pct');
  if (!video || !stage) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.addEventListener('loadedmetadata', () => { video.currentTime = video.duration / 2; });
    return;
  }

  const FLIP = false;   // set to true if the face turns the opposite way
  const LERP = 0.15;    // 0.12 to 0.18: lower is smoother and slower
  let ratio = 0.5, shown = 0.5, raf = null;

  function render() {
    shown += (ratio - shown) * LERP;
    if (Math.abs(ratio - shown) < 0.002) shown = ratio;
    marker.style.left = shown * 100 + '%';
    pct.textContent = Math.round(shown * 100);
    if (video.duration) {
      const t = (FLIP ? 1 - shown : shown) * video.duration;
      if (Math.abs(t - video.currentTime) > 0.01) video.currentTime = t;
    }
    raf = shown === ratio ? null : requestAnimationFrame(render);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(render); }

  function move(e) {
    const r = stage.getBoundingClientRect();
    ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    kick();
  }
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerdown', move);
  stage.addEventListener('pointerleave', () => { ratio = 0.5; kick(); });

  video.addEventListener('loadedmetadata', () => { video.currentTime = video.duration / 2; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; } else kick();
  });
})();