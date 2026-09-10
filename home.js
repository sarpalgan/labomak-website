import { tensileState } from './tensile-geometry.js';

const story = document.querySelector('[data-tensile-story]');
if (story) {
  const slider = story.querySelector('#tensile-progress');
  const toggle = story.querySelector('[data-motion-toggle]');
  const stages = [...story.querySelectorAll('[data-test-stage]')];
  const upper = story.querySelector('[data-rig-crosshead]');
  const sample = story.querySelector('[data-rig-specimen]');
  const fragment = story.querySelector('[data-rig-fragment]');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  let visible = true;
  let pending = false;
  let previousStage = -1;

  function render(progress) {
    const state = tensileState(progress);
    upper.setAttribute('transform', `translate(0 ${-state.lift})`);
    sample.setAttribute('d', state.upper);
    fragment.setAttribute('d', state.lower);
    slider.value = Math.round(state.progress * 100);
    if (state.stage !== previousStage) {
      stages.forEach((stage,i) => stage.classList.toggle('is-active',i === state.stage));
      slider.setAttribute('aria-valuetext', stages[state.stage].textContent.trim());
      previousStage = state.stage;
    }
  }
  function updateControls() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? toggle.dataset.resume : toggle.dataset.pause;
    toggle.disabled = preference.matches;
    if (preference.matches) toggle.textContent = document.documentElement.lang === 'tr' ? 'Azaltılmış hareket açık' : 'Reduced motion on';
  }
  function updateFromScroll() {
    pending = false;
    if (paused || !visible) return;
    const rect = story.getBoundingClientRect();
    const pinned = getComputedStyle(story.firstElementChild).position === 'sticky';
    const distance = pinned ? story.offsetHeight - story.firstElementChild.offsetHeight : Math.max(1,rect.height * .6);
    const start = pinned ? parseFloat(getComputedStyle(story.firstElementChild).top) : 80;
    render((start - rect.top) / distance);
  }
  function schedule() {
    if (!pending && !paused && visible) {
      pending = true;
      requestAnimationFrame(updateFromScroll);
    }
  }
  story.dataset.scrollLayout = String(!preference.matches);
  story.querySelector('[data-motion-controls]').hidden = false;
  slider.addEventListener('input', () => {
    paused = true; // A manual selection stays put until scroll motion is explicitly resumed.
    updateControls();
    render(Number(slider.value) / 100);
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    updateControls();
    if (!paused) schedule();
  });
  preference.addEventListener('change', () => {
    paused = preference.matches;
    story.dataset.scrollLayout = String(!preference.matches);
    updateControls();
    if (paused) render(0); else schedule();
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) schedule();
  });
  observer.observe(story);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  updateControls();
  render(0);
  schedule();
}
