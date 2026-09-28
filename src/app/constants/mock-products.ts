import { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Robe d\'Été Fleurie',
    price: 22500,
    description: 'Une magnifique robe légère parfaite pour les journées ensoleillées. Tissu fluide et imprimé floral délicat.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Vêtements',
    category: 'Robes',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 15,
    isNew: true,
    isSale: false,
    points: 35,
    reviews: [
      { id: 'r1', user: 'Emma L.', rating: 5, comment: 'Absolument magnifique ! La coupe est parfaite.', date: '2023-08-12' }
    ]
  },
  {
    id: '2',
    name: 'Ensemble Tailleur Noir',
    price: 39500,
    description: 'Le basique indispensable. Coupe moderne et structurée pour un look chic ou décontracté.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Vêtements',
    category: 'Ensembles',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 4,
    points: 60,
    reviews: []
  },
  {
    id: '3',
    name: 'Chemisier en Lin Blanc',
    price: 29000,
    description: 'Fraîcheur et élégance naturelle avec ce chemisier 100% lin.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Vêtements',
    category: 'Hauts',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 20,
    isNew: true,
    points: 45,
    reviews: []
  },
  {
    id: '4',
    name: 'Pantalon Droit Vintage',
    price: 32500,
    description: 'Coupe classique. Denim de haute qualité.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Vêtements',
    category: 'Bas',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 2,
    isSale: true,
    points: 50,
    reviews: []
  },
  {
    id: '5',
    name: 'Sac à Main Cuir Minimaliste',
    price: 58000,
    description: 'Design épuré et finitions soignées pour ce sac intemporel.',
    image: 'https://images.unsplash.com/photo-1584917033904-493bb3c3af15?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Accessoires',
    category: 'Sacs',
    sizes: ['TU'],
    stock: 5,
    points: 90,
    reviews: []
  },
  {
    id: '6',
    name: 'Sandales en Cuir Tressé',
    price: 28500,
    description: 'Parfaites pour compléter vos tenues estivales.',
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Accessoires',
    category: 'Sandales',
    sizes: ['37', '38', '39', '40'],
    stock: 10,
    isNew: true,
    points: 120,
    reviews: []
  },
  {
    id: '7',
    name: 'Collier Pendentif Or',
    price: 15000,
    description: 'Un bijou fin pour sublimer votre décolleté.',
    image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?auto=format&fit=crop&q=80&w=800',
    mainCategory: 'Accessoires',
    category: 'Bijoux',
    sizes: ['TU'],
    stock: 25,
    isSale: true,
    points: 30,
    reviews: []
  }
];

