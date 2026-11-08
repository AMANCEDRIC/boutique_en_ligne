# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Maison Shein" — e-commerce site for a seller who markets on TikTok/WhatsApp (prices in FCFA, Côte d'Ivoire). Angular 18 standalone components, Tailwind CSS 3 + DaisyUI. Backend = **Firebase** (Firestore + Auth, free Spark plan) + **Cloudinary** (photos/videos via unsigned upload preset). No payment: orders are saved to Firestore, then the customer is sent to WhatsApp with a pre-filled message. UI copy and comments are in **French**; keep new user-facing text in French.

## Commands

- `npm start` — dev server at http://localhost:4200 (`npm start -- --host 0.0.0.0` to test from a phone)
- `npm run build` — production build to `dist/maison_shein/browser` (Vercel output dir, see `vercel.json`)
- `npm test` — Karma/Jasmine (only `app.component.spec.ts` exists); single spec: `npx ng test --include src/app/path/to/file.spec.ts`
- Deploy Firestore rules: `npx firebase-tools deploy --only firestore:rules --project <projectId>`

Budgets in `angular.json`: component styles fail above 4kB (use Tailwind / `src/styles.scss`, most components have no `.scss`); initial bundle warns at 1MB (Firebase SDK is most of it).

## Configuration / demo mode

`src/environments/environment.ts` holds the Firebase web config and Cloudinary cloud name (public values). When `firebase.projectId` is empty (`isFirebaseConfigured === false`) the app runs in **demo mode**: services serve `constants/mock-products.ts` + `DEFAULT_CATEGORIES` read-only, and admin login is disabled. `FIREBASE_SETUP.md` is the step-by-step setup guide for the human owner.

## Architecture

- **Services (`core/services/`) are the data layer.** Firestore-backed ones expose a realtime `xxx$` observable (ReplaySubject — emits only after first load) plus a sync `getAll()` snapshot:
  - `ProductsService` (`products`, ordered by `createdAt` desc), `CategoriesService` (`categories`), `SettingsService` (`settings/shop` doc; `settings$` starts with `DEFAULT_SETTINGS`, `loaded$` waits for Firestore — use it for edit forms).
  - `OrdersService`: public `addOrder` (create-only), admin-only `watchAll`/`watchById`; the customer's last order is kept in `sessionStorage` for the confirmation page because the public cannot read `orders`. `updateOrderStatus(order, status)` also adjusts product stock in the same batch (deducted once on Expédié/Livré, restored on Annulé, tracked by `order.stockDeducted`). Sold-out products (`stock <= 0`) are hidden from the home page and sorted last in the shop.
  - Delivery page content (zones/prices/delays) lives in `settings/shop` (`deliveryZones`, `deliveryDelay`, `deliveryNote`), edited in admin Réglages.
  - `AuthService` + `core/guards/admin.guard.ts`: admin = Firebase Auth user **whose UID has a doc in `admins/{uid}`**. `firestore.rules` enforces the same check; keep both in sync.
  - `MediaService`: Cloudinary upload with progress (client-side JPEG compression for big photos, 100 MB video cap). `cldUrl(url, transform)` / `videoPoster(url)` add Cloudinary transformations — always render product media through them (non-Cloudinary URLs pass through untouched).
  - `CartService`, `WishlistService` stay in `localStorage` (via `StorageService`, prefix `maison_shein_`).
- **Data model** (`models/`): three fixed sections `SECTIONS` (`MainCategory` = Vêtements | Accessoires | Perruques, each with a URL slug and a size label — "Longueur" for wigs). Sub-categories are dynamic Firestore docs whose **id is the slug** (`core/utils/format.ts#slugify`); products store both `categoryId` and the denormalized `category` name (renaming a category batch-updates products). `Size` is a free string; presets in `SIZE_PRESETS`. `Product.media[]` holds images/videos; `image` is always the first image (cover). "Nouveautés"/"Déstockage" are `isNew`/`isSale` flags, not categories.
- **Firestore rules** (`firestore.rules`): products/categories/settings public read + admin write; orders public **create** with strict field validation (`isValidNewOrder` — update it if you add fields to `Order`), admin read/update.
- **Routing** (`app.routes.ts`): storefront routes are eager; admin routes are lazy-loaded and guarded. The shop page uses the URL as the single source of truth for filters: `/shop?section=<slug>&category=<id>&size=&filter=new|sale&q=&sort=`.
- **Admin** (`features/admin/`): `AdminPanelComponent` switches tabs (stats/products/categories/orders/settings) via `activeTab` + `?tab=` query param, not child routes. Sidebar is a fixed side nav on desktop and a bottom tab bar on mobile. `media-uploader` is the shared photo/video picker used by the product form and settings; pass it **stable array references** (new arrays per change-detection cycle throw ExpressionChanged errors).
- **App shell** (`app.component.html`): navbar, footer and floating WhatsApp button are hidden on `/admin*`. One global `<app-modal>` driven by `ModalService` (`alert`/`confirm`). The WhatsApp number everywhere comes from `SettingsService.whatsappLink()` — never hardcode it.

## Design system

`skills/design.md` is the visual spec ("Premium Editorial Aesthetic"); `skills/implement.md` is the original brief. Monochrome with greige (`maison-greige`) surfaces and gold (`maison-gold`) only as tiny accents; sharp corners (forced on DaisyUI components in `styles.scss`); Noto Serif headings (`font-serif`), Inter body, `.label-caps` for uppercase labels; mobile-first (traffic comes from TikTok/WhatsApp). Reference site for layout: aliwaxcollection.com (hero → product grids per category → photo banners).
