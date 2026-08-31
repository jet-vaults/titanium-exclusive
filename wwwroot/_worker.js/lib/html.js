// Tiny HTML templating helpers. No dependencies.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escape(value) {
  if (value == null) return '';
  return String(value).replace(/[&<>"']/g, (c) => ESC[c]);
}

// Marks a string as already-safe HTML so the `html` tag does not escape it.
export class Raw {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}
export const raw = (value) => new Raw(value == null ? '' : String(value));

// Tagged template: interpolations are escaped unless they are Raw, arrays of
// Raw, or nested html`` results. Falsy values except 0 render as empty strings.
export function html(strings, ...values) {
  let out = '';
  for (let i = 0; i < strings.length; i++) {
    out += strings[i];
    if (i < values.length) out += render(values[i]);
  }
  return new Raw(out);
}

function render(value) {
  if (value == null || value === false) return '';
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return escape(value);
}

// Strips tags and decodes the handful of entities WordPress emits in short_description etc.
export function textOf(htmlString) {
  if (!htmlString) return '';
  return decodeEntities(String(htmlString).replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  deg: '°', times: '×', trade: '™', reg: '®', copy: '©', Prime: '″', prime: '′',
};

export function decodeEntities(text) {
  return String(text).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code] ?? ENTITIES[code.toLowerCase()] ?? m;
  });
}

// WooCommerce Store API prices are strings in minor units ("36999").
export function money(minor, currency = 'CAD', minorUnit = 2) {
  const n = Number(minor) / 10 ** minorUnit;
  const formatted = new Intl.NumberFormat('en-CA', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(n);
  return formatted;
}

export function slugify(text) {
  return String(text).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
}

export function truncate(text, max = 140) {
  const t = String(text || '').trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export function jsonLd(obj) {
  // Escape "</script" sequences so the JSON cannot break out of the script tag.
  return raw(`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`);
}
