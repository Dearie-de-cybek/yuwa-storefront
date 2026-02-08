import ProductCard from './ProductCard';

// Mock data 
const RELATED = [
  {
    id: 2,
    name: "Lagos City Midi",
    category: "Ready-to-Wear",
    price: 120,
    tag: "Trending",
    variants: [
      { id: 'v1', colorName: "Ankara Print", type: 'pattern', swatchImage: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=100', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000' }
    ]
  },
  {
    id: 3,
    name: "Adire Wrap Set",
    category: "Co-ords",
    price: 155,
    tag: null,
    variants: [
      { id: 'v1', colorName: "Indigo", type: 'color', value: '#4B0082', image: 'https://images.unsplash.com/photo-1589451397839-49774a3838dc?q=80&w=1000' }
    ]
  },
   {
    id: 4,
    name: "The Silk Bubu",
    category: "Luxury Bubu",
    price: 210,
    tag: "New",
    variants: [
      { id: 'v1', colorName: "Gold", type: 'color', value: '#FFD700', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000' }
    ]
  }
];

export default function RelatedProducts() {
  return (
    <section className="py-20 px-6 max-w-360 mx-auto border-t border-border">
      <h3 className="font-serif text-3xl mb-12 text-center">Complete The Look</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RELATED.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}