// Single source of truth for the flower catalogue used by the Dashboard and the
// Flower Details page. The backend `flowers` module isn't implemented yet, so
// this mirrors the shape the API is expected to return ({ id, name, price,
// image, ... }). When the real GET /api/flowers endpoint lands, swap these
// helpers for API calls and the pages won't need to change.

export const PRODUCTS = [
  {
    id: 1,
    name: 'Rose',
    price: 850,
    image: '/image/products/rose.jpg',
    category: 'Anniversary',
    description:
      'A timeless classic. Our velvety red roses are hand-picked at dawn and arranged to say everything words can\'t.',
  },
  {
    id: 2,
    name: 'Tulip',
    price: 60,
    image: '/image/products/tulip.jpg',
    category: 'Birthday',
    description:
      'Bright, cheerful tulips that bring a burst of colour to any room. Perfect for celebrating the little joys.',
  },
  {
    id: 3,
    name: 'Lily',
    price: 100,
    image: '/image/products/lily.jpg',
    category: 'Decoration',
    description:
      'Elegant lilies with a gentle fragrance, ideal for adding a touch of grace to your home or a special occasion.',
  },
  {
    id: 4,
    name: 'Sunflower',
    price: 70,
    image: '/image/products/sunflower.jpg',
    category: 'Birthday',
    description:
      'Sunny and warm, these sunflowers are a ray of happiness that keep smiling all week long.',
  },
  {
    id: 5,
    name: 'Tulip',
    price: 60,
    image: '/image/products/tulip.jpg',
    category: 'Decoration',
    description:
      'A softer blend of tulips to style your space with a fresh, seasonal feel.',
  },
  {
    id: 6,
    name: 'Mixed',
    price: 90,
    image: '/image/products/mixed.jpg',
    category: 'Anniversary',
    description:
      'A florist-curated mix of seasonal blooms, thoughtfully paired for a bouquet that feels wonderfully complete.',
  },
  {
    id: 7,
    name: 'Hibiscus',
    price: 50,
    image: '/image/products/hibiscus.jpg',
    category: 'Decoration',
    description:
      'Vivid hibiscus flowers that add a tropical, exotic accent to any arrangement.',
  },
  {
    id: 8,
    name: 'Daisy',
    price: 40,
    image: '/image/products/daisy.jpg',
    category: 'Birthday',
    description:
      'Simple, playful daisies — the friendliest way to brighten someone\'s day.',
  },
  {
    id: 9,
    name: 'Mixed',
    price: 90,
    image: '/image/products/mixed.jpg',
    category: 'Anniversary',
    description:
      'Our signature mixed bunch, balancing bold and delicate blooms for effortless elegance.',
  },
  {
    id: 10,
    name: 'Lotus',
    price: 120,
    image: '/image/products/lotus.jpg',
    category: 'Decoration',
    description:
      'A serene lotus, symbol of calm and beauty, to bring a peaceful presence to your space.',
  },
  {
    id: 11,
    name: 'Rose',
    price: 80,
    image: '/image/products/rose2.jpg',
    category: 'Birthday',
    description:
      'A charming single-stem rose in a softer hue — a sweet gesture for any celebration.',
  },
  {
    id: 12,
    name: 'Tulip',
    price: 60,
    image: '/image/products/tulip.jpg',
    category: 'Anniversary',
    description:
      'Graceful tulips arranged to mark the moments that matter most.',
  },
];

export function getProductById(id) {
  return PRODUCTS.find((product) => String(product.id) === String(id));
}
