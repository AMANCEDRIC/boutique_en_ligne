import { MainCategory } from './product.model';

export interface Category {
  /** Id du document = slug du nom (ex. 'lace-front'). */
  id: string;
  name: string;
  section: MainCategory;
  order: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'robes', name: 'Robes', section: 'Vêtements', order: 1 },
  { id: 'ensembles', name: 'Ensembles', section: 'Vêtements', order: 2 },
  { id: 'hauts', name: 'Hauts', section: 'Vêtements', order: 3 },
  { id: 'bas', name: 'Bas', section: 'Vêtements', order: 4 },
  { id: 'sacs', name: 'Sacs', section: 'Accessoires', order: 1 },
  { id: 'sandales', name: 'Sandales', section: 'Accessoires', order: 2 },
  { id: 'bijoux', name: 'Bijoux', section: 'Accessoires', order: 3 },
  { id: 'lace-front', name: 'Lace front', section: 'Perruques', order: 1 },
  { id: 'frontal', name: 'Frontal', section: 'Perruques', order: 2 },
  { id: 'bob', name: 'Bob', section: 'Perruques', order: 3 },
  { id: 'bouclees', name: 'Bouclées', section: 'Perruques', order: 4 },
];
