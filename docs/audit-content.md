# titaniumexclusive.com — Content Audit (single source of truth for the redesign copy)

Audited 2026-08-30 against the live site https://titaniumexclusive.com/ (WordPress 6.x + WooCommerce 11.0.1, Woodmart theme 8.2.7 + WPBakery, Cooked recipe plugin, Quform, WooCommerce Multi Currency 2.3.3, Authorize.Net CIM gateway, Mailchimp, Jetpack, CleanTalk).

Method: public WP REST API (`/wp-json/wp/v2/pages`, `/posts`, `/cooked_recipe`, `/media`), WooCommerce Store API (`/wp-json/wc/store/v1/products`, `/products/categories`, `/products/reviews`), all Yoast sitemaps, and rendered HTML of every non-product page. Product pages were deliberately not crawled in depth (pulled separately from the Store API), but product descriptions were keyword-scanned for brand claims and those are cited here where relevant.

Conventions: quotes are verbatim from the site (typos included, marked *[sic]* only where it matters). Every fact carries its source URL. Anything I observed from an image rather than text is marked **[from image]**.

Naming note: the site uses THREE company names interchangeably — **Titanium Gourmet Inc.** (WordPress site name / `og:site_name`, footer copyright, homepage copy), **Titanium Exclusive Cookware Inc.** (privacy policy, warranty, schema `WebSite.name`, trademarks, all award certificates, logo), and **Titanium Cookware Inc.** (YouTube channel, older logo file, legacy domain titaniumcookwareinc.com). The copywriter must pick one canonical brand name and one legal name with the client.

---

## 1. Company & brand history

| Fact | Exact wording | Source |
|---|---|---|
| Tagline / founding claim | "The Original Titanium since 1995" | Homepage hero H1 https://titaniumexclusive.com/ ; also schema.org `WebSite.description` on every page |
| Positioning | "Titanium Gourmet Cookware is the largest distributor of Titanium Cookware in North America, we carry Protected Non-Stick Titanium Cookware Hi-Tech European Design, Made & Quality." | Homepage; same sentence with "Titanium Exclusive Cookware" on https://titaniumexclusive.com/company/ and https://titaniumexclusive.com/product-features/ |
| Meta description | "Titanium Exclusive Cookware Inc is the largest distributor of collection of Titanium Cookware in North America. Best non stick frying pan in the market!" | `<meta name="description">` on homepage |
| Title tag | "Titanium Cookware \| Titanium Exclusive \| Non Stick \| Made in Germany" | homepage `<title>` |
| Manufacturing origin | "All products from the Titanium Gourmet series are made of a high quality aluminum alloy cast in a German smeltery. Cast aluminum conducts heat seven times faster than iron/steel." | Homepage, /company/, /product-features/ |
| Hand-cast | "Still hand cast during manufacturing" / "Hand-cast in Germany, our Titanium Exclusive Frying pan has a 20-year warranty on the base." | Homepage "Top Quality for the Highest Demands" block; frying-pan product descriptions (e.g. https://titaniumexclusive.com/product/titanium-frying-pans-9-24cm/) |
| Made in Germany (warranty) | "Highly skilled craftsmen using only the very best materials have constructed your new Titanium Exclusive Cookware in Germany." | https://titaniumexclusive.com/warranty/ |
| Footer badge | "MADE IN GERMANY — PREMIUM QUALITY" | Footer info boxes (every page) |
| Header badge | "Made In Germany" (top-bar text, oddly linked to /contact/) | Header, every page |
| Location | 290 Nantucket Blvd, Toronto, ON M1P 2P4 (Scarborough area) | Footer, /contact/, /warranty/ |
| Legal/privacy name | "Titanium Exclusive Cookware Inc." | https://titaniumexclusive.com/privacy-policy/ |
| Canadian + US presence | Canada flag + United States flag images used in footer/header (currency switcher context: CAD / USD) | media IDs 329, 330; footer |
| Trade-show heritage | 8 customer reviews and several award images reference buying at trade shows (Fort St John BC, Winnipeg Wellness Expo, Western Fair London ON, Canadian Western Agribition Regina, Royal Agricultural Winter Fair Toronto, Denver Home Show, Markham Home Show, Parksville BC Home Expo). Photo of a full multi-station demo booth at a large convention centre exists. | https://titaniumexclusive.com/awards-and-recognition/ ; https://titaniumexclusive.com/wp-content/uploads/2021/11/Trade-Show-Picture.jpg **[from image]** |
| Trademark history **[from image]** | Canadian trade-mark "TITANIUM EXCLUSIVE", reg. no. TMA542,255, file 1020150, registered 13 March 2001 (CIPO). US trade-mark "TITANIUM EXCLUSIVE", Reg. No. 2,520,815, registered Dec. 18, 2001, registrant Karimiyan, Mohseen (Canada citizen), 26 Todd Road, Scarborough, Ontario M1S 2J9, for "cooking pots and frying pans" in Class 21, first use 1-1-2000, SN 75-750,744 filed 7-7-1999. | https://titaniumexclusive.com/wp-content/uploads/2022/07/Award-Picture-14.jpg (CIPO), Award-Picture-15.jpg and Award-Picture-16.jpg (USPTO) |
| Industry membership **[from image]** | Canadian Gift & Tableware Association (CGTA): "Titanium Exclusive Cookware Inc. is a GOLD MEMBER in good standing", inaugural date March 6, 2000, certificate dated February 27, 2004; separate CGTA plaque acknowledging "initial membership year ... as 2000". | Award-Picture-2.jpg, Award-Picture-3.jpg |
| People named on site **[from image]** | "Matt Haghighi — Titanium Cookware" (Denver Home Show Great Attitude Award 2013); "Farid Heydanian of Titanium Exclusive Cookware demonstrates no-stick cookware — which doesn't require oil or water" (Parksville Qualicum Beach News, May 13 2014); "Lydia Dannner (right) hopes people will flip over her Titanium Exclusive Cookware" (Markham Economist & Sun, March 7 2009). Do not use these names in copy without client confirmation. | Award-Picture-9.jpg, Award-Picture-11.jpg, Award-Picture-.jpg |
| Legacy domain | titaniumcookwareinc.com is still live (HTTP 200, not redirecting) and several images on the current site still hot-link to it (payments icon, Company-Banner). | observed in page HTML |
| Web vendor credit | "© 2026 Titanium Gourmet. Web Design & SEO by Mishkat." (links to https://mishkat.ca) | footer |

Note on the "original titanium cookware story": the site contains **no narrative history** (no founder story, no year-by-year, no factory name). The only story elements are the 1995 tagline, the 1999–2001 trademark filings, the CGTA membership from 2000, the newspaper clippings from 2000–2014 and the trade-show plaques. The copywriter will need to interview the client to build an About narrative.

---

## 2. Cookware technology claims (verbatim)

### 2a. Product Features page — https://titaniumexclusive.com/product-features/ (full text)

> Titanium Exclusive Cookware is top quality for the highest demands. The handles & glass lids are oven proof up to 500 degrees F. The patented handle will remain firmly attached to the pan. Titanium exclusive cookware gives you the value of healthy & delicious dining. Enjoy great, natural tasting food cooked with little or no oil or water!
>
> Titanium Exclusive Cookware is the largest distributor of Titanium Cookware in North America, they carry Protected Non-Stick Titanium Cookware Hi-Tech European Design, Made & Quality. All products from the Titanium Exclusive series are made of a high quality aluminum alloy cast in a German smeltery. Cast aluminum conducts heat seven times faster than iron or steel.
>
> - Food retains maximum nutrients, enzymes and flavor. Meats are tastier, juicier and tender.
> - Patented, high-tech, non-stick, titanium surface finish.
> - 8 mm. (0.30in) thick thermobasic hand-cast aluminum base ensures optimum heat distribution and retention – cutting cooking time in half.
> - Non-porous and the extremely durable titanium layer is 100% effective in preventing aluminum from leaking to the food.
> - Titanium layer also gives off indirect heat to assure a perfect cooking atmosphere.
> - Patented handles are screw-less, rivet-less.nothing to fall or loosen.
> - Handles, lids and knobs are oven – proof up to 260 degrees Celsius ( 500 degrees Fahrenheit)
> - Heat-resistant glass lids allows you to view the cooking process.
> - Unwarpable.. has won the prestigious German TUV independent Technical Control Association Product Safety stamp of approval for durability, quality control and GS (German Standard).
> - Works on any stove top. Save money and time by avoiding the oven.
> - 20 year limited warranty.

(The page also contains a dead link to `https://titaniumexclusive.com/lids.html` — returns 404.)

### 2b. Homepage / Company page claim blocks — https://titaniumexclusive.com/ and https://titaniumexclusive.com/company/

- Heading "Protected Non-Stick Titanium Cookware": "Experience and Enjoy Great Natural Tasting Food Cooked with little or No Oil or Water! ... Cast aluminum conducts heat seven times faster than iron/steel."
- Heading "Top Quality for the Highest Demands" with three icon bullets: "All products from the Titanium Cookware series are made of high-quality aluminum alloy cast in a German smeltery." / "Still hand cast during manufacturing" / "Patented surface processing with titanium coating" / "Particularly fine turning off on the lathe".
- Category strip subheading: "Works on all stovetops, even INDUCTION!" (also a 2000x2000 graphic: "WORKS ON ALL STOVETOPS EVEN INDUCTION" — https://titaniumexclusive.com/wp-content/uploads/2021/11/Work_on_All.jpg).
- Section title "HOW TITANIUM COOKWARE IS MADE" (introduces the factory video, see §8).

### 2c. Newer feature-block copy shown on every single-product page (added July 2025; theme "Layout" block, not a page)

Source: rendered on e.g. https://titaniumexclusive.com/product/titanium-frying-pans-9-24cm/ ; images uploaded 2025-07 (media IDs 5440–5454).

> **Discover the Superior Features of Our Cookware**
> Our cookware is designed for those who demand premium performance in the kitchen. With cutting-edge features like non-stick durability, energy efficiency, and easy cleaning, every meal becomes effortless and enjoyable.
> Icons: Non-Stick · Energy Efficient · Oven-Safe · Retains Nutrients
>
> **Discover the Titanium Gourmet Standard**
> At Titanium Gourmet Inc., we specialize in crafting premium titanium cookware engineered for modern kitchens. Our mission is simple — to deliver high-performance, long-lasting products that elevate everyday cooking. Combining cutting-edge technology with sleek design, our cookware offers unmatched durability, heat efficiency, and a naturally non-stick surface, making it a trusted choice for home cooks and culinary professionals alike.
> From energy-saving performance to effortless cleanup, every feature is carefully designed with your convenience in mind. Whether you're preparing a quick weekday meal or experimenting with gourmet dishes, Titanium Gourmet cookware ensures consistent results, superior heat distribution, and healthier cooking without compromise. Experience the difference that true quality makes — only with Titanium Gourmet.
> Icons: Easy to Clean · No Seasoning Required · Warp-Resistant · Dishwasher Safe

**Contradiction to flag:** this 2025 block says "Dishwasher Safe", while the Cleaning Instructions and Warranty pages both say "It is not recommended to clean your cookware in the dishwasher". Lid product descriptions also say lids are "oven & dishwasher safe". Resolve with client before writing.

### 2d. Construction/technology statements found in product descriptions (Store API, cited by product)

- "This 'commercial style' cookware heats quickly and evenly because its heavy gauge, cast aluminum interior retains heat so well. The durable titanium coating on the inside of the pan is non-stick which reduces the fat when you cook and the elbow-grease when you clean up!" — Wok 28 cm, Cookie Sheet.
- "Designer handle is oven resistant to 500° F. Patented grip mounting without screws and rivets. This plug-in system was awarded the safety label of the TUV Rheinland. Thermobasic base is 8 mm (0.30in) thick. Reinforced pouring rim with opposing handle. Abrasion risistant *[sic]*, patented high-tech titanium coating process (Note: It has been established after thorough testing by the State Buisiness *[sic]* Institute (LGA) Bavaria-Division Environmental Protection that: the inner seal fulfils the recommendation of the Federal Health Ministry (BGA) and thus corresponds to 31, par 1 of the Food and Domestic Articles Law, Germany." — Roasting pots, casserole pans, sauce pans, Big Roasting Dish.
- "Includes Glass Lid with energy saving, see-through cooking with the heat-resistant, hardened cover made of borosilicate glass. Glass lids and knobs are oven-proof up to 260 degrees Celsius (500° F)." — same products.
- "Titanium frying pans are standard 2 inches deep. This low profile makes turning and flipping food super easy. The domed lid adds a lot of 'vapor oven' space for heating up left overs or bringing final internal temperature up and is great for cooking vegetables." / "When you add the lid (sold separately) you create a vapor oven that allows you to make perfect vegetables with no water, and do poached eggs to perfection. Lids and handles are oven-safe." — all frying pans.
- "All pans, lids and handles are oven-proof up to 450 degrees; however, the lids allow you to cook entire meals stove top." — gift sets. (**Inconsistent** with 500°F elsewhere.)
- "Titanium Waterless Steamer" / "create a vapor oven, stovetop" — steamer products.
- Induction: product pages offer an add-on option "Do you want this in induction? (Optional) — Yes" (i.e. induction is a variant, not universal — contradicts "Works on all stovetops, even INDUCTION!" as a blanket claim). Source: https://titaniumexclusive.com/product/titanium-frying-pans-9-24cm/
- Lid add-on: "Do you want to add a lid? (Optional) Yes (+$34.99)".
- PFOA: the only occurrence of "PFOA FREE" in product copy is on the Knife Sharpener listing. The trade-show booth banner reads "Oil-Less · Water-Less · Hand Cast PFOA FREE · Made in Germany · Environmentally Friendly" **[from image, Trade-Show-Picture.jpg]**. Old booth sign (2000) read "TITANIUM EXCLUSIVE — THE HEALTHY WAY OF COOKING · OIL FREE · FAT FREE · NON STICK · NON WARPING · NO PEELING" **[from image, Award-Picture-8.jpg]**. **No PTFE / Teflon statement exists anywhere on the site.**
- Health claim: "Non-porous and the extremely durable titanium layer is 100% effective in preventing aluminum from leaking to the food." (/product-features/). "Food retains maximum nutrients, enzymes and flavor."
- Energy/low heat: "cutting cooking time in half"; "Save money and time by avoiding the oven"; "Energy Efficient" icon; "energy saving, see-through cooking".
- Durability: "Unwarpable"; "Warp-Resistant"; "Titanium is a very hard, durable metal, however it is not indestructible."; "The titanium surface cannot be worn off, if there is a defect with your cookware the titanium will CHIP off." (/warranty/).

### 2e. Cleaning & care instructions — https://titaniumexclusive.com/cleaning-instructions/ (full text)

> The best way to clean your cookware is to scrub it with a GREEN 3M Scotch Brite scouring pad, warm water, and normal dish detergent. This will prevent food from building up on the surface of your cookware.
>
> It is not recommended to clean your cookware in the dishwasher as many dishwasher detergents have a high acidity level and may impair the product surface.
>
> You do not need to season your pan. DO NOT use non-stick sprays/oils on non-stick cookware. This may result in an invisible build up that will impair the non-stick release system. Metal utensils will scratch the non-stick system.
>
> If an invisible build up happens to accumulate from non-stick sprays/oils or improper maintenance you can use a dry 3M Scotch Brite scouring pad (no soap, no water). This will remove the layer of residue on your pan and will bring your Titanium Exclusive Cookware back to its original condition.
>
> If these cleaning instructions are not properly followed after every use it may result in an improper maintenance of your cookware and may become very sticky. Improper maintenance will not constitute a warranty claim.
>
> Titanium is a very hard, durable metal, however it is not indestructible. Please use silicone utensils for cooking to avoid any scratches or markings. When storing your titanium cookware, do not stack them on top of each other as it can scratch the cooking surface.
>
> A sticky pan is not a warranty issue; it is a cleaning issue. Please follow these instructions.
>
> GREEN 3M Scotch Brite scouring pads are available for sale with any order of our cookware.

Related product: "Titanium Cleaner (No Warranty)" $7.99 (was $19.99) — https://titaniumexclusive.com/product/titanium-cleaner-no-warranty/

---

## 3. Warranty terms — https://titaniumexclusive.com/warranty/ (full text, verbatim)

> ### PROPER CLEANING INSTRUCTIONS FOR A PAN THAT IS STICKING
> The best way to clean your cookware is to scrub with a 3M Scotch Brite scouring pad to prevent food build-up on the cookware surface. Use warm water, and normal dish detergent.
> It is not recommended to clean your cookware in the dishwasher, as many dishwasher detergents have a high acid level and may impair the product surface.
> DO NOT use non-stick sprays/oils on non-stick cookware. This may result in an invisible build-up that will impair the non-stick surface release system. Metal utensils will scratch the non-stick system.
> If an invisible layer of build-up accumulates on the cookware from non-stick sprays/oils or improper maintenance you will have to do a dry scrub (no soap, no water) with a 3M Scotch Brite scouring pad. This will remove the layer or residue on you cookware and will bring the Titanium Exclusive Cookware back to normal.
> If these cleaning instructions are not followed properly, it may result your cookware losing its non stick property. Improper maintenance of your cookware does not constitute a warranty claim.
> A sticky pan is not a warranty issue; it is a cleaning issue please follows these instructions.
>
> ### HOW TO RETURN
> Please follow these instructions and send your cookware back to the service centre.
> Remove any lids from your cookware; lids are not covered under the warranty. Please ensure your cookware is clean and free of any residue. Improper maintenance or a dirty pan will not constitute a warranty claim (for best results clean with a Scotch Brite 3M scouring pad \*\*Please refer back to the Cleaning Instructions\*\*). Your cookware and copy of receipt should be packed in a suitable cardboard box using bubble wrap or other material in ensure a snug fit.
> Ship your cookware to the following address:
> Titanium Exclusive Cookware
> 290 Nantucket Blvd Toronto, ON M1P 2P4
> Your warranty claim will be looked after in priority sequence, and we should contact you within 5 business days of receiving your claim. Please include the correct contact information for yourself where you can be reached during regular business hours. If you do not hear from us within 5 business days please give us a call at 416-292-8151 or toll free 1-888-834-0632.
> Please review the following attachment prior to sending in a warranty claim. We have included a copy of the warranty details; you may also find the same warranty details on the bottom of your receipt.
> Please note Titanium Exclusive Cookware is NOT responsible for any shipping cost and a fee may be charged if you do not have a copy of your receipt.
>
> ### NOTE
> The titanium surface cannot be worn off, if there is a defect with your cookware the titanium will CHIP off.
>
> ### TITANIUM EXCLUSIVE COOWARE *[sic]* CUSTOMER WARRANTY
> Titanium Exclusive "WE CARE" Warranty. Highly skilled craftsmen using only the very best materials have constructed your new Titanium Exclusive Cookware in Germany. This unique oriented warranty has come about as a result of Titanium Exclusive Cookware high standards for product and commitment to satisfaction.
>
> ### Warranty Details
> Your Titanium Exclusive Cookware has been manufactured anticipating zero defects under normal household use. Scratches and marks caused my metal utensils DO NOT constitute a warranty claim. The maintenance instructions must be respected. Accumulation of food residue following improper maintenance or a dirty pan may affect the non-stick coating and will not constitute an exchange under the warranty. Warranties are for products priced at regular retail, if a product has been discounted and warranty issue arises, customer will be required to pay the difference between the discounted and retail price in order for the warranty to be effective. In the event service is required due to a defect, written proof of purchase must be presented. We will replace the item for a minimum charge as explained in the warranty table (located at the bottom of your receipt) plus the cost of shipping. Replacing the cookware does not extend the duration of this warranty or begin a new warranty period. If identical cookware is not available at the time of replacement, we reserve the right to substitute pan of equal or better value. Titanium Exclusive Cookware will not be responsible for any misrepresentation by Distributors/ Sales Representatives. Wear and tear around the rims of the cookware does not constitute a warranty claim.
>
> **Total warranty period in years: 20 Years**
> **No charge period in years: 5 Years**
> **Repair or replacement fee after no charge period in year 1/20 of regular price, multiplied by the number of years from the date of purchase.**
> Proof of purchase MUST be submitted with all warranty claims.

Key structured facts:
- 20-year limited warranty on cookware body ("20-year warranty on the base" per frying-pan descriptions; "20 year limited warranty" per features page).
- First 5 years: no charge. Years 6–20: replacement fee = (1/20 of regular retail price) × (years since purchase), plus shipping.
- Lids are NOT covered. Scratches from metal utensils, sticky/dirty pans, rim wear, and discounted-price purchases (unless difference paid) are excluded.
- Customer pays shipping to and from the service centre; possible fee without receipt.
- Products explicitly sold with **no warranty**: Titanium Cleaner, Titanium Cookie Sheet ("*(No Warranty)"), Titanium Cooking Set 8" with steamer ("Clearance item – No warranty").
- The page references "the following attachment" but **no PDF/attachment is actually linked** on the page.

---

## 4. Awards, certifications, test results, "as seen on", partnerships

### 4a. Text claims
- "Titanium Cookware From Titanium Gourmet has been awarded the GS and TÜV-Q quality marks for tested safety and quality by the TÜV-Rhineland/Germany TTA." — homepage hero, /company/.
- Dated version: "awarded the GS (2013-2018) and TÜV-Q (2013-2018) quality marks for tested safety and quality by the TÜV-Rhineland/Germany TTA." — homepage lower block and footer (every page). **Note: the certification period shown is 2013–2018, i.e. expired by the site's own statement; verify current status with client before repeating.**
- "This plug-in system [handle] was awarded the safety label of the TUV Rheinland." — product descriptions.
- "Unwarpable.. has won the prestigious German TUV independent Technical Control Association Product Safety stamp of approval for durability, quality control and GS (German Standard)." — /product-features/.
- LGA Bavaria / BGA food-contact statement (see §2d) — product descriptions.
- Chef endorsement (homepage, section "Top Chef in Canada Recommending Titanium Gourmet!"): "Mathieu Beausoleil was shortlisted for the first three seasons of MasterChef Canada, won the Food Network Canada's Finish Cook Like a Top Chef Contest, judged and critiqued on Gordon Ramsay's The F Word on FOX in Hollywood, California, and appeared on Guy Fieri's Diners, Drive-Ins and Dives. He also wrote, hosted and produced his own TV show "Takin' a Bite – Ottawa"." (The section sits next to the three "Bearing it All in the Kitchen" videos — see §8; there is no actual quote from the chef.)

### 4b. Awards & Recognition page — https://titaniumexclusive.com/awards-and-recognition/
The page is an image gallery with **zero text, captions or alt text**. Identified contents **[from image]** (all under `https://titaniumexclusive.com/wp-content/uploads/2022/07/`):

| File | What it is |
|---|---|
| Award-Picture-1.jpg | Gold figurine trophy holding a frying pan engraved with the T-shield logo and "TITANIUM EXCLUSIVE COOKWARE" (custom trophy, no awarding body shown) |
| Award-Picture-2.jpg | Canadian Gift & Tableware Association — "Titanium Exclusive Cookware Inc. is a GOLD MEMBER in good standing"; Inaugural Date March 6, 2000; Date of Certificate February 27, 2004; CGTA Gift Show / CIS / retailnews logos |
| Award-Picture-3.jpg | CGTA plaque: "acknowledges the initial membership year for Titanium Exclusive Cookware Inc. as 2000 and that they are a member in good standing" |
| Award-Picture-4.jpg | Certificate of Recognition — "Titanium Exclusive Cookware ... 12 Year participant in the Winnipeg Wellness Expo", 15 February 2019, signed Rick Thiessen (President) & Dolores Thiessen (VP) |
| Award-Picture-5.jpg & -7.jpg | Western Fair (London, ON) plaque: "Presented to Titanium Exclusive Cookware Inc. in appreciation and recognition of 5 years as a Exhibitor in the 2010 Western Fair" (two photos of the same plaque) |
| Award-Picture-6.jpg | Canadian Western Agribition, Evraz Place, Regina SK, November 21–26, 2016: "In recognition of your 10 YEARS as an exhibitor — Titanium Exclusive Cookware" |
| Award-Picture-8.jpg | The London Free Press "TODAY / Food" section front, Wednesday September 13, 2000: "Gourmet gadgets — Whether it's showmanship, magic or for real, the demonstrations of kitchenware are some of the most colourful acts at Western Fair"; photo of a Titanium Exclusive demo with sign "THE HEALTHY WAY OF COOKING · OIL FREE · FAT FREE · NON STICK · NON WARPING · NO PEELING" |
| Award-Picture-9.jpg | "Great Attitude Award 2013 — Denver Home Show — Awarded To: Matt Haghighi, Titanium Cookware" |
| Award-Picture-10.jpg | The Royal Agricultural Winter Fair (90 Years) Certificate of Appreciation "awarded to Titanium Exclusive Cookware — We thank you for your years of valuable participation", November 2, 2012, signed Sandra Banks (CEO) & John Dunlap (President) |
| Award-Picture-11.jpg | The Parksville Qualicum Beach News front page, Tuesday May 13, 2014: "HOME SHOW DEMONSTRATION: Farid Heydanian of Titanium Exclusive Cookware demonstrates no-stick cookware — which doesn't require oil or water — at last weekend's Home Expo, which attracted thousands of people to Oceanside Place." |
| Award-Picture-12.jpg | Photo: 2019 Winnipeg Wellness Expo (Health & Wellness Expos of Canada) — organiser handing the 12-year certificate to a Titanium Exclusive representative |
| Award-Picture-13.jpg | Vintage (c. 2000s) trade-show booth photo: "TITANIUM EXCLUSIVE" signage, "NOT SOLD IN STORES" sign, stacks of pots, two men holding a frying pan |
| Award-Picture-.jpg | The Markham Economist & Sun, Saturday March 7, 2009, "Home show lifts off": photo caption "Lydia Dannner (right) hopes people will flip over her Titanium Exclusive Cookware." |
| Award-Picture-14.jpg | Canadian Intellectual Property Office Trade-marks Certificate of Registration "TITANIUM EXCLUSIVE", TMA542,255, registered 13 March 2001 |
| Award-Picture-15.jpg | USPTO Certificate of Registration, Principal Register (cover page) |
| Award-Picture-16.jpg | USPTO register extract: "TITANIUM EXCLUSIVE", Reg. No. 2,520,815, registered Dec. 18, 2001; Karimiyan, Mohseen (Canada citizen), 26 Todd Road, Scarborough, Ontario; for cooking pots and frying pans, Class 21; first use 1-1-2000; SN 75-750,744 filed 7-7-1999; "No claim is made to the exclusive right to use 'Titanium', apart from the mark as shown." |

Takeaway: there are **no product-quality awards** in the gallery — they are exhibitor-longevity recognitions, association memberships, press clippings and trademark certificates. The only quality certifications are the German TÜV/GS/LGA claims in text. Partnerships: none stated beyond the Mathieu Beausoleil association.

---

## 5. Cooking benefits / how-to-cook / first-use instructions

What exists (all quoted above): "cooked with little or no oil or water"; "vapor oven" technique with the domed lid ("perfect vegetables with no water", "poached eggs to perfection", "heating up left overs or bringing final internal temperature up"); "the lids allow you to cook entire meals stove top"; "Save money and time by avoiding the oven"; "You do not need to season your pan."; "DO NOT use non-stick sprays/oils"; "use silicone utensils"; "do not stack them".

Usage suggestions by product family (product descriptions):
- Frying pans: "especially suitable for steaks, cutlets, eggs, omelettes, fried potatoes and quick fried foods."
- Sauce pans (high rim): "especially suited for dishes with sauces such as goulash or stuffed bell peppers. Dumplings work especially well."
- Casserole pans: "especially suited for braising, frying, and steaming all dishes."
- Roasting pots: "ideal for braising, roasting and steaming all dishes for healthy and delicious dining."
- Steamers: "Titanium Waterless Steamer"; sit on the soup pots; "Add the lid, (sold separately) to create a vapor oven, stovetop."
- Lids: "excellent for monitoring your food while it is cooking! ... Lids fit all our cookware!"

**Gaps:** there is no first-use instruction (wash before use, heat settings), no recommended heat level (low/medium), no preheat guidance, no "how waterless cooking works" explainer, no FAQ. The three "Bearing it All in the Kitchen" videos are the only demonstrations of cooking technique.

---

## 6. FAQs

**None found.** There is no FAQ page, no FAQ block, no FAQ schema anywhere on the site (checked pages list, homepage, product template, footer). The closest things are the Cleaning Instructions and Warranty pages (§2e, §3). Recommend building an FAQ from: dishwasher question, induction question (variant), lid compatibility ("Lids fit all our cookware"), oven temps (500°F handles/lids vs 450°F in gift set copy), sticky pan fix (dry Scotch-Brite scrub), warranty fee schedule, shipping to North America, currency.

---

## 7. Recipes

Recipe plugin: "Cooked" (post type `cp_recipe`, REST base `/wp-json/wp/v2/cooked_recipe`, permalink base `/recipes/`). Recipe listing page: https://titaniumexclusive.com/recipes/ (page ID 4731, sort control "Newest first / Oldest first / Alphabetical"). Archive alias: https://titaniumexclusive.com/recipe-archive/ (200, used by breadcrumbs). All 7 recipes were published 27–29 July 2022 by author "Titanium Exclusive". **No recipe categories exist** (taxonomy `cp_recipe_category` is empty), **no prep/cook times** (schema shows `PT0H0M`), yield is "1 servings" for all, no excerpts/intros, no notes, no nutrition, no mention of which Titanium pan to use. Each has one 1000×700 featured image.

| # | Title | URL | Featured image | Published |
|---|---|---|---|---|
| 1 | Pulled BBQ Eggplant | https://titaniumexclusive.com/recipes/pulled-bbq-eggplant/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Pulled-BBQ-Eggplant.jpg | 2022-07-29 |
| 2 | Thai Soup | https://titaniumexclusive.com/recipes/thai-soup/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Thai-Soup-Picture.jpg | 2022-07-29 |
| 3 | Stuffed Baby Portobello Mushrooms | https://titaniumexclusive.com/recipes/stuffed-baby-portobello-mushrooms/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Stuffed-baby-Portobello-mushrooms-picture.jpg | 2022-07-29 |
| 4 | Stir Fried Chicken | https://titaniumexclusive.com/recipes/stir-fried-chicken/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Fried-Chicken-Picture.jpg | 2022-07-29 |
| 5 | Whole Roasted Cauliflower | https://titaniumexclusive.com/recipes/whole-roasted-cauliflower/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Whole-Roasted-Cauliflower-Picture.jpg | 2022-07-28 |
| 6 | Smashed Garlic Potatoes | https://titaniumexclusive.com/recipes/smashed-garlic-potatoes/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Smashed-Garlic-Potatoes-Picture.jpg | 2022-07-27 |
| 7 | Fondant Potatoes | https://titaniumexclusive.com/recipes/fondant-potatoes/ | https://titaniumexclusive.com/wp-content/uploads/2022/07/Fondant-Potatoes-Picture.jpg | 2022-07-27 |

(Meta description of each recipe page = its title only. 700×525 thumbnails exist with `-700x525` suffix.)

### Full text — 4 best recipes (verbatim from schema/rendered page)

**Fondant Potatoes** — https://titaniumexclusive.com/recipes/fondant-potatoes/
Ingredients: 6 Yukon potatoes · ¼ cup Canola oil · 2 cups Chicken stock · 1 tsp Italian herbs · Salt (optional for taste) · Pepper (optional for taste)
Directions:
1. Preheat the oven to 425 °F and place a rack in the middle of the oven
2. Peel potatoes, cut in half, then cut off the ends to form a cylinder, about 2 inches long
3. Pat potatoes dry with paper towel
4. Place a heavy oven-proof skillet (such as a cast iron) over high heat
5. Add oil and heat until it shimmers lightly
6. Place the potato cylinders in the skillet and lower heat to medium
7. Pan fry potatoes until well-browned
8. Season with Italian herbs, salt and pepper
9. Flip potatoes to the opposite ends to cook
10. Season with more Italian herbs, salt and pepper
11. Pour chicken stock into skillet
12. Transfer skillet to oven and good *[sic — cook]* until the liquid is absorbed and the potatoes are tender and creamy inside, about 60 minutes
13. If the potatoes are not tender, and *[sic — add]* ¼ cup more stock and let it cook for 10 more minutes
(Note: step 4 says "such as a cast iron" — in a redesign this should say a Titanium frying pan.)

**Whole Roasted Cauliflower** — https://titaniumexclusive.com/recipes/whole-roasted-cauliflower/
Ingredients: 1 Whole cauliflower head · 1 lemon (juiced) · 4 tbsp Tahini · Paprika · ¼ cup Pomegranates · Salt
Directions:
1. Trim the leaves at the bottom of the cauliflower head. Carefully cut and remove the stems and tough core. Be careful to keep the head intact
2. Wash and pat dry
3. In a large Ziploc bag, place the cauliflower head and lemon juice
4. Shake the bag to coat the cauliflower evenly. Place in the fridge overnight
5. Preheat the oven to 375 °F and place a rack in the middle of the oven
6. Take the cauliflower out of the Ziploc, place in a casserole dish and pour the lemon juice over the cauliflower
7. With your hands, rub the tahini on the surface, top and bottom, until the cauliflower is well coated. Season both sides of the cauliflower with salt
8. Place the cauliflower florets-side up
9. Roast in the oven for 1.5 hours
10. Remove the casserole dish from the oven, sprinkle the cauliflower with paprika, and roast for an additional 15 minutes. Once the cauliflower is golden brown on the outside, and tender on the inside, take it out of the oven. A knife should slide in and out easily
11. Transfer the cauliflower head to a platter and garnish with pomegranate seeds

**Pulled BBQ Eggplant** — https://titaniumexclusive.com/recipes/pulled-bbq-eggplant/
Ingredients: 2 Medium eggplants · 1 tsp Cumin · 1 tsp Smoked paprika · ½ tsp Salt · ¼ tsp Black pepper · 1 tsp Garlic powder · 1 tsp Onion powder · 1 tsp Brown sugar · 1.50 cups Barbecue sauce
Directions:
1. Preheat the oven to 450°F
2. Place the eggplant on a non-stick baking sheet and prick all over
3. Bake for 30-40 minute
4. Transfer the eggplant to a large bowl and cover
5. Let the eggplant sweat and cool down for 10-15 minutes, until the skin peels off easily
6. Trim the stems from the eggplant
7. Remove the skin completely and shred the eggplants with two forks
8. In a bowl, combine the spices and mix well
9. Add the shredded eggplant to a non-stick baking sheet and sprinkle with the spice mix. Mix well
10. Bake for one hour on 180°F
11. Pour the barbecue sauce over the eggplant and toss to coat
12. Bake for 15 minutes more, until all the sauce has been absorbed
13. Serve on top of rice, or on a bun with coleslaw

**Stir Fried Chicken** — https://titaniumexclusive.com/recipes/stir-fried-chicken/
Ingredients: 2 Chicken breasts (Deboned and skinned) · 4 tbsp Olive oil · 1 White onion (Sliced) · 1 tsp Chopped garlic · 1 Red pepper (Sliced) · 1 Zucchini (Sliced) · 1 Carrot (Sliced) · ½ lb White mushrooms (Sliced) · 1 Pack snow peas · 1 Head of broccoli (Chopped into florets) · 2 tbsp Soya sauce · 4 tbsp Sweet and sour sauce · 1 tsp Onion powder · 1 tsp Garlic powder
Directions:
1. Wash and chop all vegetables
2. Heat a large saute pan over medium
3. Add oil to the pan
4. Once the pan is heated, add in the onion and saute for 2 minutes
5. Add in the garlic, and stir
6. Once fragrant, add in the carrots, and cook until tender
7. Add in the rest of the vegetables
8. While the vegetables are cooking, cube the chicken
9. Once the vegetables are cooked, remove and place in a bowl
10. In the same pan, cook the chicken
11. Add in the onion and garlic powder
12. Cook for 10 minutes and add in the soya sauce and sweet and sour sauce
13. Place the vegetables back in the pan and stir together
14. Cook for 8-10 minutes
15. Serve on a bed of rice

### Remaining 3 recipes (summary)
- **Thai Soup**: 21 ingredients (onion, carrots, enoki + button mushrooms, broccoli, zucchini, lemongrass, green beans, spinach, corn, coconut milk, chicken stock powder, Thai yellow curry paste, turmeric, rice vinegar, tomato paste, lemon, "1012 cups Water" *[sic — data-entry error, presumably 10–12 cups]*, canola oil, salt, pepper); 11 steps; simmer 1 hour.
- **Smashed Garlic Potatoes**: 1 bag small potatoes, 3 garlic cloves, 4 tbsp butter, ¼ cup olive oil, 2 sprigs thyme, salt, pepper; boil, smash on greased tray, top, bake 30 min at 450 °F; 7 steps.
- **Stuffed Baby Portobello Mushrooms**: 1 packet baby portobellos, ¼ cup salsa, 2 tbsp panko, parsley; stuff caps with chopped stems + salsa, bake 30–40 min at 400 °F; 8 steps.

Blog: `/wp-json/wp/v2/posts` returns only the default "Hello world!" post (https://titaniumexclusive.com/hello-world/, 2021-06-15, category "Uncategorized"). There is no blog.

---

## 8. Videos

All are YouTube embeds from the channel **"Titanium Cookware Inc."** — https://www.youtube.com/channel/UC2cTgWFUnZ8vv_Z1Goq2wew (handle https://www.youtube.com/@titaniumcookwareinc.281). The main nav "COMPANY → Videos" item links straight to this channel (external). No MP4/Vimeo files are hosted.

| Video ID | Title (YouTube oEmbed) | Where embedded |
|---|---|---|
| dpLXO2aWAJE | "How Titanium Cookware is made - Titanium Exclusive Cookware Inc." | Homepage, section "HOW TITANIUM COOKWARE IS MADE" (https://www.youtube.com/embed/dpLXO2aWAJE) |
| UxIZUucnWRE | "Titanium Exclusive Cookware" | Homepage (lower brand section) and https://titaniumexclusive.com/company/ |
| O-6AbSi_-_M | "Episode 1 - Bearing it All in the Kitchen - Bear Chili" | Homepage, next to the Mathieu Beausoleil "Top Chef in Canada" block |
| z7OtoqUwINc | "Episode 2 - Bearing it All in the Kitchen - Tasty Bear Burgers" | Homepage |
| ZK9IM_mMYtA | "Episode 3 - Bearing it All in the Kitchen - Bear Sloppy Joes" | Homepage |

Supporting stills: https://titaniumexclusive.com/wp-content/uploads/2022/07/How-titanium-cookware-is-made-picture.jpg (1600×900 — dark foundry shot of a pan blank under a plasma/flame-spray torch **[from image]**); https://titaniumexclusive.com/wp-content/uploads/2021/11/Main-Banner.jpg (1500×450 hero — pan body being spray-coated with sparks flying **[from image]**); https://titaniumexclusive.com/wp-content/uploads/2021/09/titanium-exclusive-picture-1.jpg (1000×1000 — worker ladling molten aluminium into a mould **[from image]**); https://titaniumexclusive.com/wp-content/uploads/2021/08/Company-Banner.jpg (2000×1200 — stacked aluminium ingots in a foundry **[from image]**). These four are the strongest "Made in Germany / hand-cast" visuals on the site.

---

## 9. Customer reviews / testimonials

There is **no testimonial section** on any page. The only reviews are native WooCommerce product reviews (8 total, all 5-star, all approved). Source: https://titaniumexclusive.com/wp-json/wc/store/v1/products/reviews and the product pages.

| Date | Name | Product | Rating | Review |
|---|---|---|---|---|
| 2026-05-18 | Naiel | The Stampede Gift Set | 5 | "Hi I would like to get the stampede gift set. Is it possible for Shipping to iraq. What about the methods and shipping fees. Best regards." *(not a review — a shipping enquiry posted as a review; exclude)* |
| 2025-06-07 | Ashema | The Ultimate Gift Set | 5 | "Have had these pans for over 20 years! Have bought individual pieces since. They are fantastic! Finish on my stock pot has finally worn off so I will purchase another. Not as heavy as cast iron and very durable!" |
| 2025-05-24 | Melissa | Titanium Sauce Pans 10.2″ (26cm) High Rim Pan with Lid | 5 | "Truly the perfect pan for heating up leftovers and rehydrating freeze dried meals. Freeze dried food absorbs the moisture perfectly with the special lid and the non stick titanium. This allows me to not stir the food… stirring freeze dried food before it is ready ruins it and breaks up too much, creating mush. I would never be without this pan. I have used Titanium Exclusive for over 20 years. I definitely would recommend these pans." |
| 2025-04-29 | Julian | The Ultimate Gift Set | 5 | "I bought these pot sets over 20 years ago and they still cook the food very well. Genuinely great quality. The best piece in my kitchen. They are also durable. It is a product that you will never return. You get what you pay for." |
| 2023-12-10 | Teffny | Titanium Casserole Pan 12.6″ (32cm) with Lid | 5 | "Bought this pan at the Fort St John BC trade show worth the money cooks amazing!" |
| 2022-09-03 | Goochs Garage | The Ultimate Gift Set | 5 | "By Far - A Life's Better investment than "As Seen On TV" advertising tv celebs to market. I bought a fry pan at a trade show & was so inpressed, I gave it to my youngest sister for her longevity . You want a last investment in kitchen pans - This is why I bought the Package. I like products that last. No Warped bottoms. 1949 Rena Ware is still on my Kitchen Shelves. So I Endorse Titaniun Cookware. You want my honesty, here it is." |
| 2022-04-17 | Rita | Titanium Deep Double Roaster 40X27X12 – Bottom Only | 5 | "Worth every penny another piece to my collection." |
| 2022-04-17 | Rita | Titanium Soup Pots 11″ (28cm) 8.6 Litres with Lid | 5 | "Best cookware ever I keep going back." |

Products with ratings: The Ultimate Gift Set (5.00, 3 reviews), The Stampede Gift Set (5.00, 1), Sauce Pan 26cm (5.00, 1), Casserole Pan 32cm (5.00, 1), Deep Double Roaster bottom (5.00, 1), Soup Pot 28cm 8.6L (5.00, 1). All other 65 products: 0 reviews. The recurring "20+ years" theme in three reviews is the strongest social proof on the site.

---

## 10. Contact info

Source: https://titaniumexclusive.com/contact/ , footer (every page), /warranty/.

- Phone (toll-free): **1 (888) 834-0632** (`tel:18888340632`, shown in header top bar on every page)
- Phone (local): **(416) 292-8151**
- Email (primary): **sales@titaniumexclusive.com** (header + footer + contact page)
- Email (secondary): **titanium@titaniumexclusive.com** (contact page only)
- Address: **290 Nantucket Blvd, Toronto, ON M1P 2P4** (footer writes "Toronto, On. M1P2P4"; warranty page: "290 Nantucket Blvd Toronto, ON M1P 2P4"). Historic trademark address (2001): 26 Todd Road, Scarborough ON M1S 2J9 — do not use.
- Hours: **not stated anywhere** (only "regular business hours" in warranty text and a footer badge "SUPPORT 24/7 — WE ARE COMMITTED").
- Contact form (Quform, form id 1): heading "Send us a Message", intro "Please send your message below. We will get back to you at the earliest!"; fields Name*, Email address*, Phone*, Reason for enquiry (radio: General / Sales / Support), Comment; button "Send"; honeypot "This field should be left blank".
- Map: Google Maps embed `place?q=Titanium+Exclusive+Cookware+Inc` (uses an exposed API key in the page source).
- Contact page icons: https://titaniumexclusive.com/wp-content/uploads/2021/08/Contact-Icons-1.png, -2.png, -3.png.
- Social: Instagram https://www.instagram.com/titaniumexclusiveinc/ ; YouTube https://www.youtube.com/channel/UC2cTgWFUnZ8vv_Z1Goq2wew . No Facebook, X, Pinterest, TikTok or LinkedIn links anywhere.
- Newsletter: footer "GET THE LATEST UPDATES — Subscribe — It only takes a second to be the first to find out about our latest news and promotions." (Mailchimp for WP form, field "Email address"). A second identical block titled "Follow Us" holds the social icons.
- Site-wide promo bar: "BIGGEST SALE YET - LIMITED TIME ONLY." (header banner).

---

## 11. Shipping, returns, privacy/terms, currency

**Shipping policy:** No shipping page exists. The only statement is the footer badge "SHIPPING IN NORTH AMERICA — ON ALL ORDERS" (icon file is literally `Free-Icon.png`, but the word "free" does not appear in the text — do not claim free shipping without confirmation). Store API cart returns no shipping rates until an address is entered. Checkout defaults country to US with State/ZIP labels but supports full country list. One "review" asks about shipping to Iraq (unanswered). Warranty page: customer pays warranty shipping both ways.

**Returns policy:** None published. Only warranty returns are described (§3). Secure Shopping page mentions orders are stored "for customer service purposes such as returns" but gives no return window or conditions.

**Privacy policy:** https://titaniumexclusive.com/privacy-policy/ — generic generated template titled "Privacy Policy for Titanium Exclusive Cookware Inc." covering Consent, Information we collect, How we use your information, Log Files, Cookies and Web Beacons, Advertising Partners, Third Party Privacy Policies, CCPA rights, GDPR rights, Children's Information, plus three appended disclaimers: "We strive to provide all correct information regarding the products, some errors are not intentional E&O.E" / "No responsibility disclaimers : Titanium Exclusive will not be held responsible for any damages you suffer as a result of using our products or services." / "We claim no warranties regarding the accuracy of the content included in articles provided on this website or the validity of claims mentioned in the articles, and will not be held responsible for any damages you suffer as a result of following advice in the articles or recipies." No PIPEDA (Canadian) mention.

**Secure Shopping page:** https://titaniumexclusive.com/secure-shopping/ — SSL statement, "Visitor Identification" (cookies), "Customer and Ship To Addresses" ("We do not sell or share the personal information you provide to us."), "Customer Email Addresses" (order/tracking emails, newsletter opt-in/unsubscribe). Contains mojibake characters (e.g. "consumer�s") in the source.

**Terms & Conditions:** none. **Refund policy:** none. **Accessibility statement:** none.

**Payments:** Authorize.Net CIM credit card gateway (the only `payment_options` on checkout). Footer shows a payment-icons image hot-linked from the legacy domain: https://titaniumcookwareinc.com/wp-content/uploads/2021/08/payments-icon-picture.png. Gift cards: "Titanium Gift Card" product (https://titaniumexclusive.com/product/titanium-gift-card/) plus a hidden "Gift this product" helper product (https://titaniumexclusive.com/product/default_gift_this_product/ — should be excluded/noindexed).

**Currency:** WooCommerce Multi Currency 2.3.3 (VillaTheme). Two currencies: **CAD (store base/default) and USD**. Switcher in header ("CAD | USD") via `?wmc-currency=CAD` / `?wmc-currency=USD`; body class `woocommerce-multi-currency-USD` suggests geo/IP defaulting to USD for some visitors. Store API confirms: `currency_code: CAD` default; with `?wmc-currency=USD` the API returns the *same numeric price* labelled USD (e.g. Frying Pan 9" = 339.99 in both) — i.e. the plugin appears configured with a 1:1 rate or fixed prices; confirm intended USD pricing with client. Switcher colours (plugin inline CSS): active #f78080, background #212121.

---

## 12. Full URL inventory (for SEO redirects)

Sitemap index: https://titaniumexclusive.com/sitemap_index.xml (Yoast; `/wp-sitemap.xml` and `/sitemap.xml` redirect to it). robots.txt: `User-agent: * / Crawl-Delay: 20`. http:// and www. both 301 to https://titaniumexclusive.com/.

### 12a. Pages (page-sitemap.xml)
| URL | Title | Notes |
|---|---|---|
| https://titaniumexclusive.com/ | Home | |
| https://titaniumexclusive.com/shop/ | Shop | WooCommerce shop archive |
| https://titaniumexclusive.com/on-sale/ | On-Sale | product grid of sale items |
| https://titaniumexclusive.com/company/ | Company | nav label "About Us" |
| https://titaniumexclusive.com/awards-and-recognition/ | Awards and Recognition | image gallery only |
| https://titaniumexclusive.com/warranty/ | Warranty | |
| https://titaniumexclusive.com/cleaning-instructions/ | Cleaning Instructions | |
| https://titaniumexclusive.com/product-features/ | Product Features | |
| https://titaniumexclusive.com/recipes/ | Recipes | Cooked listing |
| https://titaniumexclusive.com/recipe-archive/ | Recipes Archive | CPT archive alias (in cp_recipe sitemap) |
| https://titaniumexclusive.com/contact/ | Contact | |
| https://titaniumexclusive.com/secure-shopping/ | Secure Shopping | footer |
| https://titaniumexclusive.com/privacy-policy/ | Privacy Policy | footer |
| https://titaniumexclusive.com/my-account/ | My account | + /my-account/lost-password/ , /my-account/?action=register |
| https://titaniumexclusive.com/cart/ | Cart | |
| https://titaniumexclusive.com/checkout/ | Checkout | |

### 12b. Recipes (cp_recipe-sitemap.xml)
https://titaniumexclusive.com/recipes/fondant-potatoes/ · /recipes/smashed-garlic-potatoes/ · /recipes/whole-roasted-cauliflower/ · /recipes/stir-fried-chicken/ · /recipes/stuffed-baby-portobello-mushrooms/ · /recipes/thai-soup/ · /recipes/pulled-bbq-eggplant/

### 12c. Blog / taxonomy / author
- https://titaniumexclusive.com/hello-world/ (default post — redirect to home or 410)
- https://titaniumexclusive.com/category/uncategorized/
- https://titaniumexclusive.com/author/mishkat/ (agency author archive — 410/noindex)

### 12d. WooCommerce product categories (Store API `/products/categories`; product_cat-sitemap.xml)
| ID | Slug | Name | URL | Count | Category image |
|---|---|---|---|---|---|
| 15 | titanium-frying-pans | Frying Pans | https://titaniumexclusive.com/product-category/titanium-frying-pans/ | 6 | /uploads/2021/08/Frying-Pan-Picture-1.jpg |
| 16 | titanium-sauce-pans | Sauce Pans | https://titaniumexclusive.com/product-category/titanium-sauce-pans/ | 4 | /uploads/2021/08/Sauce-Pan-Main-Picture.jpg |
| 17 | titanium-casserole-pans | Casserole Pans | https://titaniumexclusive.com/product-category/titanium-casserole-pans/ | 5 | /uploads/2021/08/Titanium-CASSEROLE-PAN-24-cm-wLid-Picture-1.jpg |
| 18 | titanium-large-roasting-pans | Large Roasting Pans | https://titaniumexclusive.com/product-category/titanium-large-roasting-pans/ | 4 | /uploads/2022/08/Deep-Double-Roaster-Picture.jpg |
| 19 | titanium-roasting-pots | Roasting Pots | https://titaniumexclusive.com/product-category/titanium-roasting-pots/ | 5 | /uploads/2021/08/Titanium-Roasting-Pots-Picture-1.jpg |
| 20 | titanium-soup-pots | Soup Pots | https://titaniumexclusive.com/product-category/titanium-soup-pots/ | 5 | /uploads/2021/08/Titanium-Soup-Pots-Picture-3.jpg |
| 40 | steamers | Steamers | https://titaniumexclusive.com/product-category/steamers/ | 3 | /uploads/2021/08/Titanium-Soup-Pots-20cm-3.0-Litres-with-2-Steamers-Picture.jpg |
| 21 | titanium-specialty-cookware | Specialty Cookware | https://titaniumexclusive.com/product-category/titanium-specialty-cookware/ | 13 | /uploads/2021/08/Titanium-LARGE-GRILL-PAN-43X28X2-Flat-Picture.jpg |
| 22 | titanium-gift-sets | Gift Sets | https://titaniumexclusive.com/product-category/titanium-gift-sets/ | 5 | /uploads/2021/09/Product-Thumbnail.jpg |
| 33 | gift-card | Gift Card | https://titaniumexclusive.com/product-category/gift-card/ | 1 | /uploads/2021/11/Gift-Card-Picture.jpg |
| 23 | lids | Lids | https://titaniumexclusive.com/product-category/lids/ | 13 | /uploads/2021/08/Titanium-Cookware-Lids-Picture-2.jpg |
| 24 | cleaning-products | Cleaning Products | https://titaniumexclusive.com/product-category/cleaning-products/ | 1 | /uploads/2021/08/Titanium-Cleaner-No-Warranty-Picture-1.jpg |
| 34 | household | Household | https://titaniumexclusive.com/product-category/household/ | 5 | /uploads/2021/12/100-Rayon-from-Bamboo-Queen-Size-Picture-1.jpg |

All categories are top-level (parent 0) and have **empty descriptions**. Nav order: Frying Pans, Sauce Pans, Casserole Pans, Large Roasting Pans, Roasting Pots, Soup Pots, Steamers, Specialty Cookware, Gift Sets, Gift Card, Lids, Cleaning Products, Household. Note: the 6 frying pans return `categories: []` in the Store API even though the category count says 6 and the product page breadcrumb says "Category: Frying Pans" — verify category assignment when importing. Steamer accessories (Large Steamer 24cm, Small Steamer 20cm) are filed under Lids, not Steamers.

### 12e. Product URLs (product-sitemap.xml, 71 products + shop) — kept for redirect mapping
Note the many slugs containing the URL-encoded double-prime `%e2%80%b3` (″) — these must be mapped carefully.

```
https://titaniumexclusive.com/product/one-for-all-lid-small/
https://titaniumexclusive.com/product/one-for-all-lid-large/
https://titaniumexclusive.com/product/lid-6-16cm/
https://titaniumexclusive.com/product/lid-7-18cm/
https://titaniumexclusive.com/product/lid-8-20cm/
https://titaniumexclusive.com/product/lid-9-24cm/
https://titaniumexclusive.com/product/lid-10-26cm/
https://titaniumexclusive.com/product/lid-11-28cm/
https://titaniumexclusive.com/product/square-lid-11-28cm/
https://titaniumexclusive.com/product/lid-13-32cm/
https://titaniumexclusive.com/product/lid-14-36cm/
https://titaniumexclusive.com/product/large-steamer-24cm/
https://titaniumexclusive.com/product/small-steamer-20cm/
https://titaniumexclusive.com/product/the-flame-gift-set/
https://titaniumexclusive.com/product/the-gourmet-gift-set/
https://titaniumexclusive.com/product/the-hunter-gift-set/
https://titaniumexclusive.com/product/the-stampede-gift-set/
https://titaniumexclusive.com/product/the-ultimate-gift-set/
https://titaniumexclusive.com/product/titanium-gift-card/
https://titaniumexclusive.com/product/default_gift_this_product/   (helper product – exclude)
https://titaniumexclusive.com/product/premium-knife-set-25-pieces/
https://titaniumexclusive.com/product/knife-sharpener/
https://titaniumexclusive.com/product/100-rayon-from-bamboo-queen-size/
https://titaniumexclusive.com/product/reversible-luxury-throw-blanket/
https://titaniumexclusive.com/product/tea-kettle-silver-sanitized/
https://titaniumexclusive.com/product/titanium-cleaner-no-warranty/
https://titaniumexclusive.com/product/titanium-frying-pans-7-18cm/
https://titaniumexclusive.com/product/titanium-frying-pans-8-20cm/
https://titaniumexclusive.com/product/titanium-frying-pans-9-24cm/
https://titaniumexclusive.com/product/titanium-frying-pans-10-2-26cm/
https://titaniumexclusive.com/product/titanium-frying-pans-11-28cm/
https://titaniumexclusive.com/product/titanium-frying-pans-12-6-32cm/
https://titaniumexclusive.com/product/titanium-sauce-pans-7-20cm-high-rim-pan-with-lid/
https://titaniumexclusive.com/product/titanium-sauce-pans-9-4%e2%80%b3-24cm-high-rim-pan-with-lid/
https://titaniumexclusive.com/product/titanium-sauce-pans-10-2%e2%80%b3-26cm-high-rim-pan-with-lid/
https://titaniumexclusive.com/product/titanium-sauce-pans-11%e2%80%b3-28cm-high-rim-pan-with-lid/
https://titaniumexclusive.com/product/titanium-casserole-pan-9-4%e2%80%b3-24cm-with-lid/
https://titaniumexclusive.com/product/titanium-casserole-pan-10-2%e2%80%b3-26cm-with-lid/
https://titaniumexclusive.com/product/titanium-casserole-pan-11%e2%80%b3-28cm-with-lid/
https://titaniumexclusive.com/product/titanium-casserole-pan-12-6%e2%80%b3-32cm-with-lid/
https://titaniumexclusive.com/product/titanium-casserole-pan-12-6%e2%80%b3-32cm-with-lid-long-handle/
https://titaniumexclusive.com/product/titanium-special-casserole-dish-with-2-grips-with-lid-11-28cm/
https://titaniumexclusive.com/product/titanium-deep-double-roaster-40x27x12-bottom-only/
https://titaniumexclusive.com/product/titanium-deep-double-roaster-40x27x7-top-only/
https://titaniumexclusive.com/product/titanium-deep-double-roaster-set/
https://titaniumexclusive.com/product/titanium-big-roasting-dish-40-cm-x-24-cm/
https://titaniumexclusive.com/product/titanium-roasting-pots-8%e2%80%b3-20cm-with-lid/
https://titaniumexclusive.com/product/titanium-roasting-pots-9-4%e2%80%b3-24cm-with-lid/
https://titaniumexclusive.com/product/titanium-roasting-pots-10-2%e2%80%b3-26cm-with-lid/
https://titaniumexclusive.com/product/titanium-roasting-pots-11%e2%80%b3-28cm-with-lid/
https://titaniumexclusive.com/product/titanium-roasting-pots-12-6%e2%80%b3-32cm-with-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-8%e2%80%b3-20cm-3-0-litres-with-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-9-4%e2%80%b3-24cm-4-5-litres-with-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-11%e2%80%b3-28cm-6-5-litres-with-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-11%e2%80%b3-28cm-8-6-litres-with-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-14%e2%80%b3-32cm-14-litres-with-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-8%e2%80%b3-20cm-3-0-litres-with-2-steamers-and-lid/
https://titaniumexclusive.com/product/titanium-soup-pots-9-4%e2%80%b3-24cm-4-5-litres-with-1-steamer-and-lid/
https://titaniumexclusive.com/product/titanium-cooking-set-8%e2%80%b3-20cm-with-1-steamer-and-glass-lid/
https://titaniumexclusive.com/product/titanium-universal-pot-16cm-1l-with-lid/
https://titaniumexclusive.com/product/titanium-universal-pot-18cm-1-5l-with-lid/
https://titaniumexclusive.com/product/titanium-crepe-pans-24cm/
https://titaniumexclusive.com/product/titanium-crepe-pans-11-28cm/
https://titaniumexclusive.com/product/titanium-small-grill-pan-11-28cm/
https://titaniumexclusive.com/product/titanium-large-grill-pan-flat-16-9x11x0-79in-43x28x2cm/
https://titaniumexclusive.com/product/titanium-large-burner-grill-pan-half-ridges-half-flat-16-9x11x0-79in-43x28x2cm/
https://titaniumexclusive.com/product/titanium-large-burner-grill-pan-full-ridges-16-9x11x0-79in-43x28x2cm/
https://titaniumexclusive.com/product/titanium-cookie-sheet-12-6x20-9-32x53cm/
https://titaniumexclusive.com/product/titanium-wok-28-cm-x-11-cm/
https://titaniumexclusive.com/product/titanium-wok-12-6-32cm-with-lid/
https://titaniumexclusive.com/product/titanium-wok-14-36cm-with-lid/
```

Other URL patterns in use: `/?add-to-cart=<id>` links, `/?wmc-currency=CAD|USD`, `/?s=` search. Dead internal link: `/lids.html` (404). External legacy: `https://titaniumcookwareinc.com/company/` is linked from the homepage "Learn More" button.

### 12f. Notable non-product media (brand/lifestyle) — for reuse
- Logo (current): https://titaniumexclusive.com/wp-content/uploads/2021/11/Titanium-Exclusive-Logo.png (1500×616 PNG)
- Logo (older, wider): https://titaniumexclusive.com/wp-content/uploads/2021/08/Titanium-Cookware-Logo.png (2500×856 PNG); https://titaniumexclusive.com/wp-content/uploads/2021/07/logo.png
- Favicon: https://titaniumexclusive.com/wp-content/uploads/2021/08/cropped-Favicon.png , /2021/08/Favicon.png , /2021/08/favicon.jpg
- Hero banners: /2021/11/Main-Banner.jpg (1500×450, coating sparks), /2021/11/Banner_A.jpg, /2021/11/Banner_B.jpg, /2021/08/Main-Banner-1.jpg, /2021/08/banner-1.jpg, /2021/08/banner-2.jpg
- Factory imagery: /2021/09/titanium-exclusive-picture-1.jpg (molten pour), -2.jpg, -3.jpg; /2021/08/Company-Banner.jpg (ingots); /2022/07/How-titanium-cookware-is-made-picture.jpg (torch)
- Marketing tiles (2000×2000, dark): /2021/11/Made_in_Germany.jpg ("MADE IN GERMANY — PREMIUM QUALITY COOKWARE" with frying pan), /2021/11/Work_on_All.jpg ("WORKS ON ALL STOVETOPS EVEN INDUCTION" with lobster roaster); older versions /2021/09/Made-in-Germany-Picture.jpg, /2021/09/Works-on-all-stovetops-picture.jpg, /2021/09/Stove_design_changed.jpg, /2021/09/Titanium_design.jpg, /2021/09/Titanium.jpg
- Feature icons (2025): /2025/07/Main-Feature-Picture.jpg, Non-Stick-Picture.jpg, Energy-Efficient-Picture.jpg, Oven-Safe-Picture.jpg, Ovensafe-Picture.jpg, Nutrients-Picture.jpg, Easy-to-Clean-Picture-Main.jpg, No-Seasoning-Picture.jpg, Warp-Resistant-Picture.jpg, Dishwasher-Safe-Picture.jpg, Dishwasher-Picture.jpg
- Quality icons: /2021/08/Top-Quality-Pics-1.png … -4 ; footer icons /2021/08/Free-Icon.png, Made-in-Germany-Icon.png, Support-Icon.png, Deals-Icon.png; flags /2021/08/Germany-Flag.jpg, /2021/09/Canada-Flag.jpg, /2021/09/United-States-Flag.jpg
- Trade show: /2021/11/Trade-Show-Picture.jpg (1024×576 booth)
- Awards: 17 files listed in §4b
- Recipes: 7 files listed in §7
- Media library total: 163 attachments; **every image has an empty alt attribute**.

---

## 13. Logo and brand colours

**Logo** — https://titaniumexclusive.com/wp-content/uploads/2021/11/Titanium-Exclusive-Logo.png (1500×616, transparent PNG, `alt="Titanium Gourmet Inc."`). **[from image]** A glossy dark-grey/black shield ("guitar-pick" shape) with a silver bevelled edge containing a white serif capital "T", followed by three lines of black condensed serif caps: "TITANIUM / EXCLUSIVE / COOKWARE". Monochrome — black, greys, silver highlights, white. The same T-shield is engraved on the pan in the trophy photo and printed on the trade-show booth, so the shield mark is the long-standing brand device. Older alternate: /2021/08/Titanium-Cookware-Logo.png (2500×856).

**Theme colours** (Woodmart generated settings — https://titaniumexclusive.com/wp-content/uploads/2025/09/xts-theme_settings_default-1758048029.css):
- `--wd-primary-color: rgb(75,75,75)` (#4B4B4B) — used for all buttons (`--btn-default-bgcolor`, `--btn-accented-bgcolor`, hover identical), border-radius 5px, white text.
- `--wd-alternative-color: rgb(0,0,0)`
- `--wd-link-color: #333333`, `--wd-link-color-hover: #242424`
- Text/title/entity/widget font: `"Khula", Arial, Helvetica, sans-serif` (Google Fonts Khula 400/600/700); title weight 700.
- Other hexes in theme CSS: #111111, #333, #E0B252 (gold, likely star-rating/label), #459647 (green, likely "in stock"), rgb(196,204,63), rgb(33,33,33), rgb(239,239,239), rgb(249,249,249).
- Header top bar background: rgba(46,46,46,1) (#2E2E2E); header border rgba(129,129,129,0.2).
- Section backgrounds used by WPBakery rows: #f9f9f9, #fafafa, #f7f7f7, #ffffff, #000000 (footer/hero).
- Hero H1 white 50px on the dark Main-Banner; body copy #0a0a0a / #000000.
- Cooked recipe plugin main colour: #000000. Currency switcher: #212121 background, #f78080 active (a pink that clashes with the brand and appears nowhere else).
- Net effect: an almost entirely **achromatic** brand (black / #4B4B4B / greys / white) with dark hero imagery of sparks and molten metal; the only warmth comes from photos. No documented brand palette exists.

---

## 14. Honest assessment of the current site

1. **Identity confusion.** Three brand names (Titanium Gourmet Inc., Titanium Exclusive Cookware Inc., Titanium Cookware Inc.) plus a live legacy domain still hot-linking assets. Visitors, Google and the trademark all say different things; the logo says "Titanium Exclusive Cookware" while the copyright says "Titanium Gourmet".
2. **The story is missing.** "The Original Titanium since 1995" is asserted, never told. No founder, no factory, no "why titanium", no timeline — despite genuinely good raw material (1999–2001 trademarks, 25 years of trade-show history, customers with 20-year-old pans, foundry footage).
3. **Copy is duplicated and dated.** The same two paragraphs ("largest distributor… German smeltery… seven times faster") appear four times across home/company/features. Typos throughout ("COOWARE", "risistant", "Buisiness", "Casserrole", "recipies"), 1990s brochure phrasing ("Particularly fine turning off on the lathe"), and contradictory specs (dishwasher safe vs not recommended; 450°F vs 500°F; "works on induction" vs induction as a paid variant; TÜV marks dated 2013–2018).
4. **Awards page is text-free.** Sixteen unlabelled photos of plaques and newspaper clippings with no captions, no alt text, and none of them is actually a product award. It undersells (trademarks, 25 years of expos) and over-promises ("Awards") at the same time.
5. **Zero trust architecture.** No testimonials section, only 8 buried product reviews (one is a shipping enquiry); no FAQ; no shipping or returns policy; no hours; an "attachment" the warranty page never links; a "SUPPORT 24/7" badge with no channel behind it.
6. **Product catalogue is confusing to navigate.** 13 flat categories, lids sold separately with a paid add-on on every pan, steamers filed under Lids, six frying pans with no category in the API, near-identical names differing only by inch marks in the slug, and unrelated household items (bamboo sheets, throw blanket, knife set) diluting a premium cookware brand.
7. **Merchandising screams discount.** A permanent "BIGGEST SALE YET - LIMITED TIME ONLY" bar, "BEST DEALS IN THE MARKET" footer badge, strike-through pricing on every gift set, "Clearance – No warranty" items — at odds with a $300–$1,600 German-made positioning.
8. **Design is a stock Woodmart template.** Grey #4B4B4B buttons, Khula everywhere, WPBakery rows with inconsistent backgrounds, the same block repeated twice on the homepage, unlabelled five-video wall, empty alt text on all 163 images, an exposed Google Maps API key, and a pink currency switcher.
9. **Recipes are a stub.** Seven recipes from one week in 2022, no intros, no times, no categories, no pan recommendations, one tells you to use "a cast iron", one calls for "1012 cups Water". No blog, no email content — nothing to bring people back.
10. **Technical/SEO hygiene is poor.** Default "Hello world!" post indexed, agency author archive indexed, dead `/lids.html` link, hidden helper product in the sitemap, meta description with grammar errors ("largest distributor of collection of"), title tags that are just the page name, `Crawl-Delay: 20`, and USD prices that equal CAD prices number-for-number.
11. **Opportunity is real.** The core assets are strong and verifiable: German hand-casting with foundry footage, 8 mm thermobasic base, 20-year warranty, LGA/TÜV language, a registered mark with 2000 first-use date, and customers publicly saying their pans have lasted 20+ years. The redesign mainly needs to *organise and tell* what already exists, and to resolve the handful of factual contradictions with the client.
