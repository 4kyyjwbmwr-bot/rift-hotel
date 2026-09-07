(function () {
  const header = document.querySelector('.site-header');
  if (header && !header.classList.contains('header-solid')) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const bookingForm = document.querySelector('#availability-form');
  const results = document.querySelector('#availability-results');
  if (bookingForm && results) {
    const arrive = bookingForm.querySelector('#arrival');
    const depart = bookingForm.querySelector('#departure');
    const today = new Date();
    const iso = d => {
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2,'0');
      const day = String(d.getDate()).padStart(2,'0');
      return `${y}-${m}-${day}`;
    };
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const plus3 = new Date(today); plus3.setDate(today.getDate()+3);
    arrive.min = iso(today); depart.min = iso(tomorrow);
    if (!arrive.value) arrive.value = iso(tomorrow);
    if (!depart.value) depart.value = iso(plus3);

    arrive.addEventListener('change', () => {
      const minDepart = new Date(arrive.value + 'T12:00:00');
      minDepart.setDate(minDepart.getDate()+1);
      depart.min = iso(minDepart);
      if (!depart.value || depart.value <= arrive.value) depart.value = iso(minDepart);
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const arrivalDate = new Date(arrive.value + 'T12:00:00');
      const departureDate = new Date(depart.value + 'T12:00:00');
      if (departureDate <= arrivalDate) {
        depart.setCustomValidity('Departure must be after arrival.');
        depart.reportValidity();
        return;
      }
      depart.setCustomValidity('');
      const nights = Math.max(1, Math.round((departureDate - arrivalDate) / 86400000));
      results.querySelector('[data-nights]').textContent = `${nights} night${nights === 1 ? '' : 's'}`;
      results.classList.add('show');
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();
