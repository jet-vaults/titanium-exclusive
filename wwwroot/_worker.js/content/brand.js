// Brand facts used across the site. Every statement here is taken from the
// existing titaniumexclusive.com content (see docs/audit-content.md). Do not add
// claims that the current site does not make.

export const BRAND = {
  since: 1995,
  legalName: 'Titanium Exclusive Cookware Inc.',
  origin: 'Hand-cast in Germany',
  warrantyYears: 20,
  warrantyFreeYears: 5,
  warranty: '20-year warranty on the base',
  ovenSafeF: 500,
  ovenSafeC: 260,
  baseMm: 8,
  region: 'Canada and the United States',
  address: { street: '290 Nantucket Blvd', city: 'Toronto', region: 'ON', postal: 'M1P 2P4', country: 'CA' },
  phoneTollFree: '1 (888) 834-0632',
  phoneTollFreeTel: '+18888340632',
  phoneLocal: '(416) 292-8151',
  phoneLocalTel: '+14162928151',
  email: 'sales@titaniumexclusive.com',
  instagram: 'https://www.instagram.com/titaniumexclusiveinc/',
  youtube: 'https://www.youtube.com/channel/UC2cTgWFUnZ8vv_Z1Goq2wew',
};

// Short proof points for the trust strip. Kept to verifiable facts.
export const PROOF = [
  { value: '1995', label: 'The original titanium cookware' },
  { value: 'Germany', label: 'Hand-cast in a German foundry' },
  { value: '8 mm', label: 'Thermobasic cast base' },
  { value: '20 yr', label: 'Warranty on every base' },
  { value: '500°F', label: 'Oven-safe handles and lids' },
];

export const VIDEOS = [
  { id: 'dpLXO2aWAJE', title: 'How Titanium Cookware is made', kind: 'Factory' },
  { id: 'UxIZUucnWRE', title: 'Titanium Exclusive Cookware', kind: 'Brand film' },
  { id: 'O-6AbSi_-_M', title: 'Bear Chili', kind: 'Bearing it All in the Kitchen · Ep. 1' },
  { id: 'z7OtoqUwINc', title: 'Tasty Bear Burgers', kind: 'Bearing it All in the Kitchen · Ep. 2' },
  { id: 'ZK9IM_mMYtA', title: 'Bear Sloppy Joes', kind: 'Bearing it All in the Kitchen · Ep. 3' },
];

// Brand imagery, stored in wwwroot/media/.
export const IMG = {
  panTexture: '/media/2021/08/Frying-Pan-Picture-3.jpg',
  panBase: '/media/2022/08/Titanium-Picture-Product-1.jpg',
  pour: '/media/2021/09/titanium-exclusive-picture-1.jpg',
  sparks: '/media/2021/09/titanium-exclusive-picture-2.jpg',
  sparksWide: '/media/2021/11/Main-Banner.jpg',
  lathe: '/media/2021/09/titanium-exclusive-picture-3.jpg',
  ingots: '/media/2021/08/Company-Banner.jpg',
  torch: '/media/2022/07/How-titanium-cookware-is-made-picture.jpg',
  fryingPanFood: '/media/2021/08/Frying-Pan-Picture-1.jpg',
  roastingPot: '/media/2021/08/Titanium-Roasting-Pots-Picture-1.jpg',
  tradeShow: '/media/2021/11/Trade-Show-Picture.jpg',
  booth2000: '/media/2022/07/Award-Picture-13.jpg',
  pressLondon2000: '/media/2022/07/Award-Picture-8.jpg',
  cgta: '/media/2022/07/Award-Picture-2.jpg',
  cipo: '/media/2022/07/Award-Picture-14.jpg',
  uspto: '/media/2022/07/Award-Picture-16.jpg',
  agribition: '/media/2022/07/Award-Picture-6.jpg',
  winnipeg: '/media/2022/07/Award-Picture-4.jpg',
  royal: '/media/2022/07/Award-Picture-10.jpg',
};

export const NAV = [
  { label: 'Shop', href: '/shop/', mega: true },
  { label: 'Collections', href: '/shop/#collections' },
  { label: 'Why Titanium', href: '/why-titanium/' },
  { label: 'Our Story', href: '/our-story/' },
  { label: 'Recipes', href: '/recipes/' },
  { label: 'Support', href: '/support/' },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: 'All cookware', href: '/shop/' },
    { label: 'Frying pans', href: '/product-category/titanium-frying-pans/' },
    { label: 'Sauce pans', href: '/product-category/titanium-sauce-pans/' },
    { label: 'Casserole pans', href: '/product-category/titanium-casserole-pans/' },
    { label: 'Roasting pots', href: '/product-category/titanium-roasting-pots/' },
    { label: 'Soup pots', href: '/product-category/titanium-soup-pots/' },
    { label: 'Gift sets', href: '/product-category/titanium-gift-sets/' },
    { label: 'Lids & steamers', href: '/product-category/lids/' },
    { label: 'Gift cards', href: '/product-category/gift-card/' },
  ],
  Learn: [
    { label: 'Why Titanium', href: '/why-titanium/' },
    { label: 'Our Story', href: '/our-story/' },
    { label: 'Recipes', href: '/recipes/' },
    { label: 'Videos', href: '/support/videos/' },
  ],
  Support: [
    { label: 'Help & FAQ', href: '/support/faq/' },
    { label: 'Warranty', href: '/support/warranty/' },
    { label: 'Cleaning & care', href: '/support/care/' },
    { label: 'Cooking instructions', href: '/support/instructions/' },
    { label: 'Shipping', href: '/support/shipping/' },
    { label: 'Contact', href: '/contact/' },
  ],
};
