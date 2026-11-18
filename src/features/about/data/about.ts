/** Company facts grid on the About page. */
export const aboutFacts = [
  { label: 'Company', value: 'Todara Ltd, Kenya' },
  { label: 'Sourcing', value: 'Own farms and contracted growers' },
  { label: 'Lines', value: '3 fresh, 3 processed' },
  { label: 'Markets', value: 'Europe, Middle East, Asia' },
] as const;

/** "Where the fruit comes from" cards. */
export const sources = [
  {
    title: 'Our own avocado orchards',
    text: 'Hass and green-skin avocado grown and harvested under our own management, giving a base of supply we control from flowering to packing.',
    image: 'images/todara-12-avocado-orchard.png',
    alt: 'Avocado orchard on a Todara farm in the Kenyan highlands',
  },
  {
    title: 'Our own mango orchards',
    text: 'Apple and Kent mango from our own orchards, harvested at the right maturity for sea or air freight.',
    image: 'images/todara-11-mango-orchard.png',
    alt: 'Mango orchard with fruit on the trees',
  },
  {
    title: 'Contracted growers',
    text: 'Growers we work with each season, harvesting to the same maturity standards, so volumes can scale with a buyer’s programme.',
    image: 'images/todara-13-grower-avocado-collection.png',
    alt: 'Contracted grower bringing in harvested avocados',
  },
] as const;

/** Main photo and the pan saved in the design's image slot (.image-slots.state.json "about-main"). */
export const aboutPhoto = {
  image: 'images/todara-03b-full-range-stack.jpg',
  alt: 'Todara range: cartons of fresh avocado and mango with IQF and puree packs',
  panX: 18.26144629010984,
  panY: 0,
} as const;
