import { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Robe d\'Été Fleurie',
    price: 22500,
    description: 'Une magnifique robe légère parfaite pour les journées ensoleillées. Tissu fluide et imprimé floral délicat.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    category: 'Femme',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 15,
    isNew: true,
    isSale: true,
    points: 35,
    reviews: [
      { id: 'r1', user: 'Emma L.', rating: 5, comment: 'Absolument magnifique ! La coupe est parfaite.', date: '2023-08-12' },
      { id: 'r2', user: 'Julie D.', rating: 4, comment: 'Très jolie robe, un peu transparente toutefois.', date: '2023-08-15' }
    ]
  },
  {
    id: '2',
    name: 'Blazer Oversize Noir',
    price: 39500,
    description: 'Le basique indispensable. Coupe moderne et structurée pour un look chic ou décontracté.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    category: 'Femme',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 4,
    points: 60,
    reviews: [
      { id: 'r3', user: 'Léa M.', rating: 5, comment: 'Qualité incroyable pour le prix. Je recommande !', date: '2023-09-01' }
    ]
  },
  {
    id: '3',
    name: 'Chemise en Lin Blanche',
    price: 29000,
    description: 'Fraîcheur et élégance naturelle avec cette chemise 100% lin.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    category: 'Homme',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 20,
    isNew: true,
    points: 45,
    reviews: [
      { id: 'r4', user: 'Marc P.', rating: 4, comment: 'Très agréable à porter l\'été.', date: '2023-07-20' }
    ]
  },
  {
    id: '4',
    name: 'Jean Droit Vintage',
    price: 32500,
    description: 'Coupe classique inspirée des années 90. Denim de haute qualité.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
    category: 'Femme',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 2,
    isSale: true,
    points: 50,
    reviews: [
      { id: 'r5', user: 'Sarah K.', rating: 5, comment: 'La toile est épaisse et solide, top !', date: '2023-06-10' }
    ]
  },
  {
    id: '5',
    name: 'Sac à Main Cuir Minimaliste',
    price: 58000,
    description: 'Design épuré et finitions soignées pour ce sac intemporel.',
    image: 'https://images.unsplash.com/photo-1584917033904-493bb3c3af15?auto=format&fit=crop&q=80&w=800',
    category: 'Accessoires',
    sizes: [],
    stock: 5,
    points: 90,
    reviews: []
  },
  {
    id: '6',
    name: 'Pull en Cachemire Doux',
    price: 78500,
    description: 'Un luxe abordable pour rester au chaud avec style.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    category: 'Femme',
    sizes: ['S', 'M', 'L'],
    stock: 10,
    isSale: true,
    points: 120,
    reviews: [
      { id: 'r6', user: 'Chloé B.', rating: 5, comment: 'Une douceur incroyable.', date: '2023-10-05' }
    ]
  }
];

