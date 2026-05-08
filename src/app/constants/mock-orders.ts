import { Order } from '../models/order.model';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-10-25',
    customerName: 'Sophie Bernard',
    customerPhone: '+225 07 08 09 10 11',
    customerAddress: 'Abidjan, Cocody Riviera 3',
    total: 62000,
    status: 'Expédié',
    items: [],
  },
  {
    id: 'ORD-002',
    date: '2023-10-26',
    customerName: 'Jean Dupont',
    customerPhone: '+225 01 02 03 04 05',
    customerAddress: 'Abidjan, Plateau',
    total: 29000,
    status: 'En attente',
    items: [],
  },
  {
    id: 'ORD-003',
    date: '2023-10-27',
    customerName: 'Marie Curie',
    customerPhone: '+225 05 06 07 08 09',
    customerAddress: 'Yamoussoukro, Quartier 220',
    total: 78500,
    status: 'Livré',
    items: [],
  }
];


