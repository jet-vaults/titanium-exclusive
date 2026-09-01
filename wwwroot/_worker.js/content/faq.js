// Frequently asked questions. Answers are drawn from the existing product-features,
// cleaning-instructions and warranty pages and the WooCommerce catalog. No new policies.

export const FAQ = [
  {
    id: 'material',
    q: 'What is Titanium Exclusive cookware made of?',
    a: `<p>Each piece is cast from a high-quality aluminium alloy in a German foundry, still by hand, then finished with a patented titanium non-stick surface. The base is 8 mm (0.30 in) thick, which is why the pans heat evenly and hold their heat.</p><p>The titanium layer is non-porous and extremely durable, so the aluminium underneath never touches your food.</p>`,
    topics: ['product', 'why'],
  },
  {
    id: 'stovetops',
    q: 'Which stovetops does it work on? What about induction?',
    a: `<p>Gas, electric, ceramic and glass cooktops are all fine. For induction, choose the induction option on the product page — each pan is available in an induction-ready version.</p>`,
    topics: ['product', 'why'],
  },
  {
    id: 'oven',
    q: 'Can I put it in the oven?',
    a: `<p>Yes. Handles, glass lids and knobs are oven-proof to 260 °C (500 °F). The patented plug-in handle has no screws or rivets, so there is nothing to loosen in the heat.</p>`,
    topics: ['product', 'why'],
  },
  {
    id: 'oil',
    q: 'Do I need oil or butter?',
    a: `<p>Very little, and often none. The titanium surface releases food without fat, and with the lid on you can cook vegetables with no water at all. You never need to season the pan, and you should not use non-stick sprays — they leave an invisible build-up that stops the surface from releasing.</p>`,
    topics: ['product', 'care'],
  },
  {
    id: 'dishwasher',
    q: 'Is it dishwasher safe?',
    a: `<p>We recommend washing by hand: warm water, normal dish detergent and a green 3M Scotch-Brite pad. Many dishwasher detergents are highly acidic and can impair the cooking surface over time, and damage from improper cleaning is not covered by the warranty.</p>`,
    topics: ['care'],
  },
  {
    id: 'lids',
    q: 'Are lids included?',
    a: `<p>Sauce pans, casserole pans, roasting pots, soup pots and universal pots come with their glass lid. Frying pans, grill pans and crêpe pans are sold without one — add the matching lid on the product page or from the Lids collection.</p><p>Lids fit all our cookware of the same diameter, and the One-for-All lids cover three sizes each.</p>`,
    topics: ['product'],
  },
  {
    id: 'warranty',
    q: 'What does the 20-year warranty cover?',
    a: `<p>The cast body of your cookware is warranted for 20 years against manufacturing defects under normal household use. For the first 5 years, a defective piece is replaced at no charge. From year 6 to year 20, the replacement fee is 1/20 of the regular retail price multiplied by the number of years since purchase, plus shipping.</p><p>Lids are not covered. Scratches from metal utensils, sticky pans caused by improper cleaning and wear around the rim are not defects. Keep your receipt — proof of purchase is required for every claim.</p>`,
    topics: ['warranty'],
  },
  {
    id: 'sticky',
    q: 'My pan has started to stick. What should I do?',
    a: `<p>A sticky pan is almost always a cleaning issue, not a defect. Residue from oils, sprays or food builds up in an invisible film. Scrub the dry pan with a dry green 3M Scotch-Brite pad — no soap, no water — to remove the layer, then wash as usual. Use silicone utensils and avoid stacking pans without protection between them.</p>`,
    topics: ['care', 'warranty'],
  },
  {
    id: 'shipping',
    q: 'Where do you ship, and in which currency do I pay?',
    a: `<p>We ship across Canada and the United States at a flat rate, shown to you before you pay. Prices are displayed in Canadian or US dollars — switch currencies at the bottom of any page (on your phone, in the menu). US prices follow the daily exchange rate.</p>`,
    topics: ['shipping'],
  },
  {
    id: 'contact',
    q: 'How do I reach you?',
    a: `<p>Call 1 (888) 834-0632 toll-free or (416) 292-8151 in Toronto, email <a href="mailto:sales@titaniumexclusive.com">sales@titaniumexclusive.com</a>, or use the <a href="/contact/">contact form</a>. We are based at 290 Nantucket Blvd, Toronto, Ontario.</p>`,
    topics: ['shipping'],
  },
];

export const faqLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
});
