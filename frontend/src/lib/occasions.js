// Shop-by-occasion config — shared by the landing, detail pages, nav and homepage.
export const OCCASIONS = [
  {
    slug: 'wedding',
    value: 'WEDDING',
    title: 'Wedding',
    editTitle: 'The Wedding Edit',
    tagline: 'For the guest who intends to be remembered.',
    cta: 'Explore Wedding Guest Looks',
    image: '/images/wedding-guest.jpg',
  },
  {
    slug: 'prom',
    value: 'PROM',
    title: 'Prom',
    editTitle: 'The Prom Edit',
    tagline: 'Your once-in-a-lifetime entrance.',
    cta: 'Find Your Prom Look',
    image: '/images/prom.jpg',
  },
  {
    slug: 'dinner',
    value: 'DINNER',
    title: 'Dinner & Events',
    editTitle: 'The Dinner Edit',
    tagline: 'Make an entrance without saying a word.',
    cta: 'Shop Evening',
    image: '/images/dinner.jpg',
  },
  {
    slug: 'everyday',
    value: 'EVERYDAY',
    title: 'Everyday Elegance',
    editTitle: 'The Everyday Edit',
    tagline: 'African silhouettes for everyday luxury.',
    cta: 'Shop Everyday',
    image: '/images/home1.jpg',
  },
];

export const occasionBySlug = (slug) => OCCASIONS.find((o) => o.slug === slug);
