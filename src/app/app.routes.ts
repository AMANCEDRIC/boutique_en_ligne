import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { AdminPanelComponent } from './features/admin/admin-panel.component';
import { AdminOrderDetailComponent } from './features/admin/components/admin-order-detail/admin-order-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'admin/order/:id', component: AdminOrderDetailComponent },
  { path: '**', redirectTo: '' },
];
