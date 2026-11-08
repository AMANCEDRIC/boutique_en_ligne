import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { HowToOrderComponent } from './features/pages/how-to-order/how-to-order.component';
import { DeliveryComponent } from './features/pages/delivery/delivery.component';
import { PaymentComponent } from './features/pages/payment/payment.component';
import { AboutComponent } from './features/pages/about/about.component';
import { ContactComponent } from './features/pages/contact/contact.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:ref', component: OrderConfirmationComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'how-to-order', component: HowToOrderComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Espace admin : chargé à la demande (Firebase Auth + formulaires ne pèsent pas sur la boutique)
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin/order/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/components/admin-order-detail/admin-order-detail.component').then(
        (m) => m.AdminOrderDetailComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-panel.component').then((m) => m.AdminPanelComponent),
  },
  { path: '**', redirectTo: '' },
];
