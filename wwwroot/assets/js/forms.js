// Contact form: inline validation, honeypot, async submit with clear success / error states.
import { $, $$ } from './ui.js?v=4';

$$('[data-contact-form]').forEach(init);

function init(form) {
  const status = $('[data-form-status]', form);
  const submit = $('[type="submit"]', form);
  const endpoint = form.dataset.endpoint;
  const fields = $$('.field', form);

  const validate = (field) => {
    const input = $('input, textarea, select', field);
    if (!input) return true;
    let ok = input.checkValidity();
    if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    if (ok && input.type === 'tel' && input.value) ok = input.value.replace(/\D/g, '').length >= 7;
    field.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  };
  fields.forEach((f) => { const i = $('input, textarea, select', f); i && i.addEventListener('blur', () => validate(f)); i && i.addEventListener('input', () => { if (f.classList.contains('is-invalid')) validate(f); }); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    const valid = fields.map(validate).every(Boolean);
    if (!valid) { $('.field.is-invalid input, .field.is-invalid textarea', form)?.focus(); return; }
    if ($('[name="website"]', form)?.value) { showSuccess(); return; } // honeypot
    if (!endpoint) {
      // No delivery endpoint configured yet: open the visitor's mail client with the message prefilled.
      const fd = new FormData(form);
      const body = `Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\nPhone: ${fd.get('phone') || '-'}\nReason: ${fd.get('reason')}\n\n${fd.get('message')}`;
      location.href = `mailto:${form.dataset.fallbackEmail}?subject=${encodeURIComponent('Website enquiry: ' + fd.get('reason'))}&body=${encodeURIComponent(body)}`;
      showSuccess('Your email app should open with the message prefilled. If it did not, write to ' + form.dataset.fallbackEmail + '.');
      return;
    }
    submit.classList.add('is-busy');
    try {
      const fd = new FormData(form);
      fd.append('subject', `Website enquiry (${fd.get('reason')}) from ${fd.get('name')}`);
      const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || 'Send failed');
      showSuccess();
      form.reset();
    } catch (err) {
      status.textContent = `We could not send your message (${err.message}). Please email ${form.dataset.fallbackEmail} or call us.`;
      status.className = 'form-status is-error';
    } finally { submit.classList.remove('is-busy'); }
  });

  function showSuccess(text) {
    status.textContent = text || 'Thank you — your message is on its way. We reply within one business day.';
    status.className = 'form-status is-success';
    status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}
