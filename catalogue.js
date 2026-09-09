const fold = value => value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
const filters = document.querySelector('[data-catalogue-filter]');
if (filters) {
  const scope = filters.closest('section') || document;
  const update = () => {
    const query = fold(filters.elements.search.value.trim());
    const type = filters.elements.type.value;
    let count = 0;
    scope.querySelectorAll('[data-family]').forEach(card => {
      card.hidden = !(fold(card.dataset.search).includes(query) && (type === 'all' || card.dataset.type === type));
      if (!card.hidden) count++;
    });
    const products = filters.dataset.unit === 'products';
    scope.querySelector('[data-result-count]').textContent = filters.dataset.lang === 'tr' ? `${count} ${products ? 'ürün' : 'ürün ailesi'}` : `${count} ${products ? (count === 1 ? 'product' : 'products') : (count === 1 ? 'family' : 'families')}`;
    scope.querySelector('[data-no-results]').hidden = count !== 0;
  };
  filters.addEventListener('input', update);
  filters.addEventListener('change', update);
  filters.addEventListener('reset', () => setTimeout(update, 0));
  filters.addEventListener('submit', event => event.preventDefault());
}

const enquiryForm = document.querySelector('[data-enquiry]');
enquiryForm?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const tr = form.dataset.lang === 'tr';
  const body = [
    `${tr ? 'Ad soyad' : 'Name'}: ${data.get('name')}`,
    `${tr ? 'Firma' : 'Company'}: ${data.get('company')}`,
    `Email: ${data.get('email')}`,
    `${tr ? 'Ülke' : 'Country'}: ${data.get('country')}`,
    `${tr ? 'Sistem' : 'System'}: ${data.get('system') || (tr ? 'Seçim desteği' : 'Selection assistance')}`,
    '', String(data.get('requirements'))
  ].join('\n');
  const subject = `${tr ? 'Labomak teklif talebi' : 'Labomak system enquiry'} — ${data.get('system') || 'Labotens'}`;
  form.querySelector('[data-email-link]').href = `mailto:info@labomak.com.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.querySelector('[data-email-body]').value = body;
  form.querySelector('[data-enquiry-result]').hidden = false;
  form.querySelector('[data-email-link]').focus();
});
// Keep submission unavailable until the local-only handler is installed.
if (enquiryForm) enquiryForm.querySelector('button[type="submit"]').disabled = false;

const fixtureLibrary = document.querySelector('[data-fixture-library]');
if (fixtureLibrary) {
  const form = fixtureLibrary.querySelector('[data-fixture-filter]');
  const cards = [...fixtureLibrary.querySelectorAll('[data-fixture]')];
  const more = fixtureLibrary.querySelector('[data-fixture-more]');
  const tr = fixtureLibrary.dataset.lang === 'tr';
  let limit = 24;
  const update = (writeUrl = true) => {
    const query = form.elements.search.value.trim();
    const group = form.elements.group?.value || 'all';
    const words = fold(query).split(/\s+/).filter(Boolean);
    const matching = cards.filter(card => words.every(word => fold(card.dataset.search).includes(word)) && (group === 'all' || card.dataset.groups.split(' ').includes(group)));
    const visible = new Set(matching.slice(0, limit));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    fixtureLibrary.querySelector('[data-fixture-count]').textContent = tr ? `${matching.length} örnek · ${visible.size} gösteriliyor` : `${matching.length} examples · showing ${visible.size}`;
    fixtureLibrary.querySelector('[data-fixture-empty]').hidden = matching.length !== 0;
    more.hidden = matching.length <= limit;
    if (writeUrl) {
      const url = new URL(location.href);
      query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
      group !== 'all' ? url.searchParams.set('group', group) : url.searchParams.delete('group');
      history.replaceState(null, '', url);
    }
    return matching;
  };
  const restore = () => {
    const params = new URLSearchParams(location.search);
    form.elements.search.value = params.get('q') || '';
    if (form.elements.group) form.elements.group.value = [...form.elements.group.options].some(o => o.value === params.get('group')) ? params.get('group') : 'all';
    limit = 24;
    const matching = update(false);
    const index = matching.findIndex(card => '#'+card.id === location.hash);
    if (index >= limit) { limit = index + 1; update(false); }
  };
  restore();
  form.addEventListener('submit', event => event.preventDefault());
  for (const event of ['input', 'change']) form.addEventListener(event, () => { limit = 24; update(); });
  form.addEventListener('reset', () => setTimeout(() => { limit = 24; update(); }, 0));
  window.addEventListener('popstate', restore);
  more.addEventListener('click', () => {
    const previous = limit;
    limit += 24;
    const matching = update(false);
    matching[previous]?.querySelector('a').focus({preventScroll:true});
  });
  const dialog = fixtureLibrary.querySelector('dialog');
  fixtureLibrary.addEventListener('click', event => {
    const preview = event.target.closest('[data-fixture-preview]');
    if (preview && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      const img = preview.querySelector('img');
      const large = dialog.querySelector('[data-fixture-large]');
      large.src = preview.href;
      large.alt = img.alt;
      dialog.querySelector('[data-fixture-caption]').textContent = img.alt;
      dialog.querySelector('[data-fixture-original]').href = preview.href;
      dialog.showModal();
      document.body.classList.add('fixture-dialog-open');
    }
    const enquire = event.target.closest('[data-fixture-enquire]');
    if (enquire && enquiryForm) {
      const system = enquiryForm.elements.system;
      let option = system.querySelector('[data-selected-fixture]');
      if (!option) { option = document.createElement('option'); option.dataset.selectedFixture = ''; system.append(option); }
      option.textContent = enquire.dataset.caption;
      option.selected = true;
      const requirements = enquiryForm.elements.requirements;
      const reference = `${tr ? 'Fikstür referansı' : 'Fixture reference'}: ${enquire.dataset.source}`;
      if (!requirements.value.includes(reference)) requirements.value = [requirements.value, reference].filter(Boolean).join('\n');
      enquiryForm.querySelector('[data-enquiry-result]').hidden = true;
      setTimeout(() => enquiryForm.elements.name.focus({preventScroll:true}), 0);
    }
  });
  dialog.querySelector('[data-fixture-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('fixture-dialog-open'));
}

const resourceFilters = document.querySelector('[data-resource-filter]');
if (resourceFilters) {
  const scope = resourceFilters.closest('section');
  const allowedKinds = new Set([...resourceFilters.elements.kind.options].map(option => option.value));
  const update = (writeUrl = true) => {
    const query = resourceFilters.elements.search.value.trim();
    const kind = resourceFilters.elements.kind.value;
    let count = 0;
    scope.querySelectorAll('[data-document]').forEach(card => {
      card.hidden = !(fold(card.dataset.search).includes(fold(query)) && (kind === 'all' || card.dataset.kind === kind));
      if (!card.hidden) count++;
    });
    scope.querySelector('[data-document-count]').textContent = resourceFilters.dataset.lang === 'tr' ? `${count} doküman` : `${count} ${count === 1 ? 'document' : 'documents'}`;
    scope.querySelector('[data-no-documents]').hidden = count !== 0;
    if (writeUrl) {
      const url = new URL(window.location.href);
      query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
      kind !== 'all' ? url.searchParams.set('kind', kind) : url.searchParams.delete('kind');
      history.replaceState(null, '', url);
    }
  };
  const restore = () => {
    const params = new URLSearchParams(window.location.search);
    resourceFilters.elements.search.value = params.get('q') || '';
    resourceFilters.elements.kind.value = allowedKinds.has(params.get('kind')) ? params.get('kind') : 'all';
    update(false);
  };
  restore();
  resourceFilters.addEventListener('input', () => update());
  resourceFilters.addEventListener('change', () => update());
  resourceFilters.addEventListener('reset', () => setTimeout(() => update(), 0));
  resourceFilters.addEventListener('submit', event => event.preventDefault());
  window.addEventListener('popstate', restore);
}
