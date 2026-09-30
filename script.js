(() => {
  'use strict';
  const supplied = window.OREZIA_CONFIG || {};
  const config = {
    phone: supplied.phone || '+212660116765',
    phoneDisplay: supplied.phoneDisplay || '06 60 11 67 65',
    whatsapp: supplied.whatsapp || '212660116765',
    email: supplied.email || 'contact@oreziagroup.com'
  };
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('header')) closeMenu(); });
  window.matchMedia('(min-width:901px)').addEventListener('change', closeMenu);
  const phone = /^\+?[\d ()-]{8,20}$/.test(config.phone || '') ? config.phone : '';
  const whatsapp = /^\d{8,15}$/.test(config.whatsapp || '') ? config.whatsapp : '';
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : '';
  const contacts = { phone, whatsapp, email };
  document.querySelectorAll('[data-contact]').forEach(el => { el.textContent = el.dataset.contact === 'email' ? email : config.phoneDisplay; });
  document.querySelectorAll('[data-channel]').forEach(link => {
    const channel = link.dataset.channel;
    if (contacts[channel]) {
      link.href = channel === 'phone' ? 'tel:' + phone.replace(/[ ()-]/g, '') : 'https://wa.me/' + whatsapp;
      if (channel === 'whatsapp') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    }
  });
  const form = document.querySelector('#diagnostic-form');
  const sectors = [
    { environment: 'Restaurants & cafés', title: 'L’hygiène se joue aussi hors du champ de vision.', description: 'Zones de préparation, réserves, points d’eau et accès : le diagnostic permet d’identifier les facteurs qui favorisent la présence de nuisibles.', points: ['Préparation & service', 'Stockage & réserves', 'Accès & points d’eau'] },
    { environment: 'Hôtels & établissements touristiques', title: 'L’expérience client commence par un cadre maîtrisé.', description: 'Chambres, espaces communs et zones de service : la prévention et le traitement prennent en compte les lieux d’accueil et le fonctionnement de l’établissement.', points: ['Chambres & espaces communs', 'Zones de service', 'Prévention & contrôle'] },
    { environment: 'Industries & entrepôts', title: 'Chaque zone sensible mérite une attention précise.', description: 'Stockage, circulation des marchandises et accès extérieurs : l’analyse du site oriente la surveillance et, si nécessaire, un programme d’intervention périodique.', points: ['Stockage & marchandises', 'Accès & périphérie', 'Surveillance périodique'] },
    { environment: 'Bureaux & commerces', title: 'Un lieu de travail et d’accueil à préserver.', description: 'Espaces de travail, réserves et points de passage : Orezia adapte son approche aux usages des locaux pour répondre aux besoins d’hygiène et de maîtrise des nuisibles.', points: ['Accueil & circulation', 'Réserves & espaces de pause', 'Entretien des locaux'] },
    { environment: 'Particuliers', title: 'Retrouvez la maîtrise de votre espace de vie.', description: 'Cuisine, chambres, dépendances ou extérieurs : le diagnostic aide à comprendre la situation et à choisir un traitement adapté au logement et aux signes observés.', points: ['Logements & dépendances', 'Identification du problème', 'Recommandations adaptées'] }
  ];
  const sectorButtons = [...document.querySelectorAll('[data-sector]')];
  const selectSector = index => {
    const sector = sectors[index];
    sectorButtons.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    document.querySelector('#sector-panel').setAttribute('aria-labelledby', sectorButtons[index].id);
    document.querySelector('#sector-title').textContent = sector.title;
    document.querySelector('#sector-description').textContent = sector.description;
    document.querySelector('#sector-number').textContent = String(index + 1).padStart(2, '0');
    const points = document.querySelector('#sector-points');
    points.replaceChildren(...sector.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    document.querySelector('#sector-cta').dataset.environment = sector.environment;
    document.querySelector('#sector-cta').textContent = index === 4 ? 'Demander un diagnostic pour mon logement' : 'Demander un diagnostic pour mon établissement';
  };
  sectorButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectSector(index));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % sectorButtons.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + sectorButtons.length - 1) % sectorButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = sectorButtons.length - 1;
      if (next !== undefined) { event.preventDefault(); selectSector(next); sectorButtons[next].focus(); }
    });
  });
  const selectLinkedSector = () => { if (window.location.hash === '#particuliers') selectSector(4); };
  window.addEventListener('hashchange', selectLinkedSector);
  selectLinkedSector();
  const status = document.querySelector('#form-status');
  const send = document.querySelector('#send-email');
  const requestCopy = document.querySelector('#request-copy');
  const requestSummary = document.querySelector('#request-summary');
  const copyStatus = document.querySelector('#copy-status');
  const invalidate = () => { status.textContent = ''; send.hidden = true; send.removeAttribute('href'); requestCopy.hidden = true; requestSummary.value = ''; copyStatus.textContent = ''; };
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  document.querySelectorAll('[data-environment], [data-service]').forEach(link => link.addEventListener('click', () => {
    if (link.dataset.environment) form.elements.environment.value = link.dataset.environment;
    if (link.dataset.service) form.elements.service.value = link.dataset.service;
    invalidate();
  }));
  document.querySelector('#copy-request').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(requestSummary.value); copyStatus.textContent = 'Texte copié. Collez-le dans un email à contact@oreziagroup.com.'; }
    catch { requestSummary.focus(); requestSummary.select(); copyStatus.textContent = 'Sélectionnez et copiez le texte, puis collez-le dans votre messagerie.'; }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    ['name', 'city', 'message'].forEach(key => { const input = form.elements[key]; input.value = input.value.trim(); });
    form.elements.message.setCustomValidity(form.elements.message.value.length < 10 ? 'Décrivez votre situation avec au moins 10 caractères.' : '');
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) { form.elements.phone.setCustomValidity('Veuillez indiquer un numéro contenant de 8 à 15 chiffres.'); form.elements.phone.reportValidity(); return; }
    if (email) {
      const body = `Demande de diagnostic gratuit\n\nNom : ${values.name}\nEntreprise : ${values.company || 'Non précisée'}\nTéléphone : ${values.phone}\nEmail : ${values.email}\nEnvironnement : ${values.environment}\nVille : ${values.city}\nBesoin : ${values.service}\n\n${values.message}\n\nAccord donné pour être recontacté au sujet de cette demande.`;
      send.href = `mailto:${email}?subject=${encodeURIComponent('Demande de diagnostic gratuit — Orezia')}&body=${encodeURIComponent(body)}`;
      send.hidden = false;
      requestSummary.value = body;
      requestCopy.hidden = false;
      status.textContent = 'Votre demande est prête. Ouvrez votre messagerie pour l’envoyer à contact@oreziagroup.com. Si aucune messagerie ne s’ouvre, copiez le texte ci-dessous. Aucun message n’a encore été envoyé.';
    }
    status.focus();
  });
  form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''));
  form.elements.message.addEventListener('input', () => form.elements.message.setCustomValidity(''));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
