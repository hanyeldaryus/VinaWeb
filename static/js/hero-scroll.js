(function () {
  document.documentElement.classList.add('js');

  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-stage');
  const draw = document.querySelector('.trace .draw');
  if (hero && stage && draw) {
    const nodes = [...document.querySelectorAll('.trace [data-at]')];
    const len = draw.getTotalLength();
    draw.style.strokeDasharray = len;

    function render(p) {
      draw.style.strokeDashoffset = len * (1 - p);
      nodes.forEach(n => n.classList.toggle('is-lit', p >= +n.dataset.at));
      hero.classList.toggle('is-done', p >= 0.98);
    }
    function onScroll() {
      const headerH = document.querySelector('header').offsetHeight;
      const max = hero.offsetHeight - stage.offsetHeight;
      render(Math.min(1, Math.max(0, (headerH - hero.getBoundingClientRect().top) / max)));
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(1);
    } else {
      let ticking = false;
      addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { onScroll(); ticking = false; });
      }, { passive: true });
      addEventListener('resize', onScroll);
      onScroll();
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();