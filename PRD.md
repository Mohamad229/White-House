# White House Store PRD

## 1. Product Overview

White House is a bilingual Arabic/English men's T-shirt storefront built as a focused landing and shopping experience. The site introduces the store, presents admin-managed products with full details, and lets customers create multi-product cash-on-delivery orders without online payment.

The project should remain simple for customers and store admins, while still feeling modern, editorial, and professional. The first version should avoid unnecessary operational complexity and focus on a reliable browsing, cart, order, and WhatsApp handoff flow.

## 2. Goals

- Build a responsive bilingual storefront for men's T-shirts.
- Make Arabic the default experience at `/`.
- Provide an English version at `/en`.
- Let customers browse categories and products, open product details, choose color and size, and add more than one product to a single order.
- Use a simple cart/order bar instead of a heavy ecommerce checkout.
- Save every submitted order to MySQL before opening WhatsApp.
- Open WhatsApp with a prepared message to the store number after order persistence.
- Provide a simple admin panel for one shared admin account.
- Let the admin manage products, categories, product visibility, product availability, images, colors, sizes, prices, store contact information, and order statuses.
- Keep the architecture ready for future brand identity, hosting, domain, payment, shipping, and WhatsApp API upgrades.

## 3. Non-Goals for V1

- No online payment.
- No shipping price calculation.
- No automatic outbound WhatsApp messages from the website to customers.
- No WhatsApp Cloud API integration.
- No multi-admin roles or permissions.
- No public customer accounts.
- No inventory quantity tracking per color/size in V1.
- No complex promotions, coupons, or loyalty features.
- No advanced analytics dashboard.

## 4. Target Users

### 4.1 Customers

Customers are mobile-first shoppers who want to quickly browse men's T-shirts, compare colors and sizes, add multiple items to one order, provide contact/address details, and continue the conversation through WhatsApp.

### 4.2 Store Admin

The store admin is a non-technical user who needs a simple private interface to add and update products, hide unavailable products, manage categories, view orders, update order status, and edit basic store settings.

The V1 admin model is one shared admin account that can be used by more than one store employee.

## 5. Brand and Design Direction

### 5.1 Current Brand

- Store name: White House.
- Final logo, colors, typography, and brand identity are not available yet.
- The design should use a flexible placeholder identity until final brand assets are provided.

### 5.2 Visual Direction

The interface should be inspired by a modern editorial fashion store style:

- Large confident typography.
- Strong hero section.
- Clean product imagery.
- Simple category navigation.
- Warm, premium, minimal visual language.
- High contrast where useful.
- Restrained motion that helps orientation rather than distracting users.

Reference templates or screenshots may be provided later. They should be used for inspiration and layout direction, without copying proprietary assets.

### 5.3 Responsive Requirements

- Fully responsive for mobile, tablet, laptop, and desktop.
- Mobile browsing and ordering must be the primary experience.
- Product cards, product details, and the cart/order bar must remain easy to use on small screens.
- Arabic pages must use RTL layout.
- English pages must use LTR layout.

## 6. Localization and Routing

### 6.1 Languages

- Arabic is the default language.
- English is optional through a language switcher.
- Product names and descriptions must be editable in both Arabic and English from the admin panel.
- Category names and descriptions must be editable in both Arabic and English from the admin panel.
- Store copy/settings should support Arabic and English where relevant.
- WhatsApp order messages should use the language selected by the customer.

### 6.2 Route Strategy

Public routes:

- `/` - Arabic home page.
- `/en` - English home page.
- `/products` - Arabic products page.
- `/en/products` - English products page.
- `/products?category={slug}` - Arabic products filtered by category.
- `/en/products?category={slug}` - English products filtered by category.
- `/products/{slug}` - Arabic product details.
- `/en/products/{slug}` - English product details.

Admin routes:

- `/admin` - Admin dashboard and login entry, Arabic-first UI.
- `/admin/products` - Product management.
- `/admin/products/new` - Create product.
- `/admin/products/{id}` - Edit product.
- `/admin/categories` - Category management.
- `/admin/orders` - Order management.
- `/admin/settings` - Store settings.

If the codebase keeps locale-prefixed admin routes internally, the product requirement remains that Arabic is the default public experience at `/` and English is at `/en`.

## 7. Public Storefront Requirements

### 7.1 Header

The header should be simple and persistent across public pages.

Required items:

- White House brand/name placeholder.
- Home link.
- Categories link that scrolls to the category section on the home page.
- Products link that opens the full products page.
- About/contact link that scrolls to the store information section on the home page.
- Language switcher.
- Optional small cart/order indicator when items exist.

### 7.2 Home Page

The home page is the main landing experience.

Required sections:

- Hero section with store introduction and primary call to action.
- Category section showing admin-managed categories.
- Category cards/blocks should link to the products page filtered by the selected category.
- About/contact section with short store description, location/contact information, WhatsApp contact, support email, and simple trust/service copy.
- Footer with social media links, WhatsApp number, support email, and basic site information.

### 7.3 Products Page

The products page should show all visible and available products, with category filtering.

Required behavior:

- Show admin-managed categories as filters.
- Support opening the page with a selected category from the home page.
- Show only products that are public-visible.
- Hide products marked hidden by the admin.
- Hide products marked unavailable/out of stock from public listings.
- Product cards should include essential information only: image, name, short description, price, available color hints if useful, and order/details actions.
- Product cards should link to the product details page.
- Product cards may include a quick "Add to order" action when a default or selected variant is available.

### 7.4 Product Details Page

Each product should have a dedicated details page.

Required content:

- Product image gallery.
- Main product image.
- Color-specific images that change when the customer selects a color.
- Product name.
- Product short/full description.
- Price in Syrian Pound.
- Available colors.
- Available sizes for the selected color.
- Quantity selector.
- Add to order button.
- Product category.
- Optional additional product details.

Internal product code must not be displayed to customers on the public page, but it should be included in the order record and WhatsApp message for store staff.

## 8. Cart and Order Flow

### 8.1 Simple Cart/Order Bar

The site should use a lightweight cart concept, presented as an order bar or status bar.

Required behavior:

- Appears when the customer adds at least one product.
- Can be placed at the bottom of the viewport on mobile and desktop, or another clear fixed location.
- Shows item count and total price.
- Has a button to review selected products.
- Has a button to confirm/continue order.
- Remains simple and visible without feeling like a full ecommerce cart.

### 8.2 Order Review

Customers must be able to review the order before submission.

Required behavior:

- View selected products.
- View selected color, size, quantity, and price.
- Change quantity.
- Remove an item.
- See total price.
- Continue shopping.
- Proceed to customer details form.

### 8.3 Checkout Form

The checkout form should be short and clear.

Required fields:

- Full name.
- Phone number.
- City and area.
- Detailed address.
- Additional notes, optional.

Required behavior:

- Validate required fields.
- Validate that at least one product exists in the order.
- Save order to database before WhatsApp opens.
- Show clear feedback if the order could not be saved.
- After successful order creation, open WhatsApp with a prepared message.

### 8.4 Payment and Shipping

- Payment method: cash on delivery or payment after delivery agreement.
- Shipping details and cost are agreed through WhatsApp in V1.
- The checkout should not ask for card details or online payment information.

## 9. WhatsApp Flow

### 9.1 V1 Decision

V1 uses free WhatsApp click-to-chat links.

Flow:

1. Customer submits the order form.
2. Website validates the order.
3. Website saves the order in MySQL.
4. Website generates a WhatsApp URL using the store WhatsApp number.
5. Website opens WhatsApp with a prepared message.
6. Customer manually presses Send in WhatsApp.

This avoids WhatsApp Business Platform setup and avoids automatic message costs.

### 9.2 Out of Scope: Automatic Customer Message

Automatically sending a WhatsApp message from the website to the customer requires WhatsApp Business Platform / Cloud API, approved templates for business-initiated messages, and possible platform costs. This is not part of V1.

### 9.3 WhatsApp Message Content

The WhatsApp message should use the customer's selected language.

Required message data:

- Store greeting or order introduction.
- Order code.
- Customer full name.
- Customer phone number.
- City and area.
- Detailed address.
- Notes if provided.
- Ordered items:
  - Product public name.
  - Product internal code.
  - Color.
  - Size.
  - Quantity.
  - Unit price.
  - Line total.
- Order total.
- Currency: SYP.

The template should be editable later from admin settings if needed.

## 10. Admin Panel Requirements

### 10.1 Authentication

V1 uses one shared admin account.

Required behavior:

- Admin login page.
- Protected admin routes.
- Session-based access.
- Logout action.
- Credentials stored securely.
- Password must be hashed in the database.

Future versions may add multiple admins and roles.

### 10.2 Admin Dashboard

The dashboard should provide a simple overview:

- Recent orders.
- Count of new orders.
- Count of visible products.
- Quick links to products, categories, orders, and settings.

### 10.3 Product Management

The admin must be able to:

- Create a product.
- Edit a product.
- Hide/show a product.
- Mark a product unavailable/out of stock by hiding it from public listings while preserving it in the database.
- Delete only if explicitly supported later; V1 should prefer hiding/archiving to preserve historical order integrity.
- Set category.
- Set internal product code.
- Set Arabic name.
- Set English name.
- Set Arabic description.
- Set English description.
- Set short description if the UI needs card-level copy.
- Set price.
- Set currency, default SYP.
- Upload/manage product images.
- Set a main product image.
- Add color options.
- Attach an image to each color.
- Add available sizes for each color.
- Reorder images/colors if useful.

Product internal code:

- Entered by admin.
- Used by store staff as a product reference.
- Not shown to public customers.
- Stored on order item snapshots.
- Included in WhatsApp order messages.

### 10.4 Category Management

The admin must be able to:

- Create categories.
- Edit category Arabic/English names.
- Edit category Arabic/English descriptions.
- Set category slug.
- Show/hide categories.
- Set sort order.

Visible categories should appear on the home page and products page automatically.

### 10.5 Order Management

The admin must be able to:

- View all orders.
- Open an order details view.
- See customer information.
- See ordered items.
- See product internal codes.
- See selected color, size, quantity, price, and total.
- Update order status.
- Filter orders by status if useful.

V1 order statuses:

- `new` - New order.
- `contacted` - Store contacted the customer.
- `completed` - Order completed.
- `cancelled` - Order cancelled.

Orders should store item snapshots so historical order records remain correct even if the product name, price, color, or product code changes later.

### 10.6 Store Settings

The admin must be able to edit:

- Store name Arabic.
- Store name English.
- WhatsApp number.
- Support phone if separate.
- Support email.
- Default currency, default SYP.
- Social links:
  - Facebook.
  - WhatsApp.
  - Optional Instagram or other links later.
- Short about text Arabic.
- Short about text English.
- Store location/contact copy.
- Optional WhatsApp message templates Arabic/English.

## 11. Data Requirements

The project should use MySQL as the primary database. Prisma may be used to manage schema, migrations, queries, and relations.

### 11.1 Core Entities

#### AdminUser

- id
- email or username
- passwordHash
- createdAt
- updatedAt

#### Category

- id
- slug
- nameAr
- nameEn
- descriptionAr
- descriptionEn
- isVisible
- sortOrder
- createdAt
- updatedAt

#### Product

- id
- categoryId
- slug
- internalCode
- nameAr
- nameEn
- descriptionAr
- descriptionEn
- shortDescriptionAr
- shortDescriptionEn
- price
- currency, default SYP
- status: visible, hidden, outOfStock
- isFeatured, optional/future
- mainImageId, optional
- createdAt
- updatedAt

#### ProductImage

- id
- productId
- colorId, optional for color-specific images
- url
- altAr
- altEn
- isMain
- sortOrder
- createdAt

#### ProductColor

- id
- productId
- nameAr
- nameEn
- hex
- imageId, optional
- isAvailable
- sortOrder

#### ProductSize / ProductVariant

V1 can model available sizes per color through variants.

- id
- productId
- colorId
- size
- isAvailable
- createdAt

Stock quantity is not required in V1, but the model may keep an optional nullable field for future use.

#### Order

- id
- code
- locale
- customerName
- customerPhone
- cityArea
- detailedAddress
- notes
- subtotal
- total
- currency, default SYP
- status: new, contacted, completed, cancelled
- whatsappOpenedAt, optional
- createdAt
- updatedAt

#### OrderItem

Order items must store snapshots.

- id
- orderId
- productId, nullable if product is later removed/archived
- productSlug
- productInternalCode
- productNameAr
- productNameEn
- selectedProductName
- colorAr
- colorEn
- selectedColorName
- colorHex
- size
- quantity
- unitPrice
- lineTotal
- currency
- imageUrl, optional
- createdAt

#### StoreSettings

- id
- storeNameAr
- storeNameEn
- whatsappNumber
- supportPhone
- supportEmail
- defaultCurrency
- facebookUrl
- whatsappUrl
- instagramUrl, optional
- aboutAr
- aboutEn
- locationAr
- locationEn
- whatsappTemplateAr
- whatsappTemplateEn
- createdAt
- updatedAt

## 12. Technical Requirements

### 12.1 Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- MySQL.
- Prisma recommended for database schema and relational queries.
- Server Components for static/product reads where practical.
- Client Components only for interactive behavior such as cart state, variant selection, product gallery, checkout form, and admin forms.

### 12.2 State Management

- Cart/order selection can use React context with localStorage persistence.
- Cart data should be validated again on the server before order creation.
- Prices and product availability should be checked server-side during order submission.

### 12.3 Image Uploads

V1 may store uploaded images in `public/uploads` or another simple local storage path.

Requirements:

- Admin can upload multiple product images.
- Images should have consistent display sizing in the UI.
- Each color can have a linked image.
- A main image can be selected for product cards.

Future hosting may require moving uploads to an object storage provider.

### 12.4 Security

- Protect all admin routes.
- Hash admin passwords.
- Validate all order and admin inputs server-side.
- Do not trust cart price data from the client.
- Avoid exposing internal product code on public pages.
- Rate limit or add basic spam protection to order submission if needed.
- Keep environment secrets out of source control.

### 12.5 Accessibility

- All interactive controls must be keyboard accessible.
- Product color choices must have text labels, not color-only meaning.
- Forms must have labels and clear validation messages.
- Contrast should be readable in Arabic and English.
- RTL/LTR switching must not break layout.

### 12.6 Performance

- Optimize product images.
- Use server-rendered pages for SEO and initial speed.
- Avoid large client bundles.
- Keep animations lightweight.
- Products page should remain fast with reasonable product counts.

## 13. Functional Acceptance Criteria

### 13.1 Storefront

- Visiting `/` shows the Arabic home page.
- Visiting `/en` shows the English home page.
- Arabic pages render with `dir="rtl"`.
- English pages render with `dir="ltr"`.
- Home page shows hero, categories, about/contact, and footer sections.
- Category cards link to filtered products.
- Products page displays only visible/available products.
- Hidden products do not appear to customers.
- Product cards open product details pages.
- Product details page lets users select color, size, and quantity.
- Changing color updates the displayed product image when a color image exists.
- A product can be added to the order.
- Multiple products can be added to the same order.
- The cart/order bar appears after adding items.
- Customers can review, edit, and remove order items.

### 13.2 Checkout and Orders

- Customer cannot submit an empty order.
- Customer cannot submit without name, phone, city/area, and detailed address.
- Order is saved to the database before WhatsApp opens.
- Order items store product snapshots including internal product codes.
- WhatsApp opens with a prepared message in the selected language.
- The message includes order code, customer details, product details, internal product codes, and total.

### 13.3 Admin

- Admin routes require login.
- Admin can create, edit, hide/show, and mark products unavailable.
- Admin can manage Arabic and English product data.
- Admin can manage product internal code.
- Admin can upload/manage multiple product images.
- Admin can link color images.
- Admin can manage color and size options.
- Admin can create and edit categories.
- Admin-created categories appear on the public site when visible.
- Admin can view orders.
- Admin can update order status to new, contacted, completed, or cancelled.
- Admin can update WhatsApp number and support contact settings.
- Admin can start message customer whats up number to contact with him in each order.

## 14. Suggested Implementation Phases

### Phase 1: Foundation

- Confirm routing strategy: `/` Arabic, `/en` English.
- Align existing seed data/types/schema with this PRD.
- Add Prisma if chosen.
- Define final database schema and migrations.
- Set default currency to SYP.
- Define V1 order statuses.

### Phase 2: Public Storefront

- Build/refine home page sections.
- Build products page with category filtering.
- Build product details page with variant/image switching.
- Build responsive header, footer, and language switcher.

### Phase 3: Cart and Checkout

- Build simple cart/order bar.
- Build order review UI.
- Build checkout form.
- Implement server-side order validation.
- Save orders and generate WhatsApp click-to-chat URL.

### Phase 4: Admin Panel

- Add admin authentication.
- Build product management forms.
- Build category management.
- Build order list/details/status update.
- Build store settings.

### Phase 5: Polish and QA

- Add loading, empty, and error states.
- Test Arabic and English flows.
- Test mobile and desktop layouts.
- Test product hidden/unavailable behavior.
- Test order snapshot correctness.
- Test WhatsApp message output.
- Prepare deployment notes.

## 15. Future Enhancements

- Final brand identity, logo, colors, and typography.
- Featured products section.
- Inventory quantity tracking per color and size.
- Multiple admin accounts and roles.
- Automatic WhatsApp Business Platform messages.
- Shipping fee rules.
- Online payment integration.
- Customer order tracking page.
- Image storage provider.
- Analytics dashboard.
- Product search.
- Promotional banners.
- Coupons or discounts.

## 16. Current Decisions

- Store name: White House.
- Default language: Arabic.
- English route: `/en`.
- Default currency: Syrian Pound, SYP.
- Payment: no online payment in V1.
- Shipping: agreed through WhatsApp in V1.
- WhatsApp: free click-to-chat flow in V1.
- Admin: one shared account in V1.
- Product availability: admin hides/unpublishes products from public listings while keeping them in the database.
- Orders: must be saved before opening WhatsApp.
- Order items: must preserve snapshots of product data and internal product code.

## 17. Open Items for Later

- Final logo and brand identity.
- Final color palette and typography.
- Final product photography.
- Final social media URLs.
- Final support email and WhatsApp number.
- Hosting provider and domain.
- Whether to add featured products in V1 or later.
- Whether admin UI needs English in V1 or Arabic-only is enough.
