# Requirements Document

## 1. Application Overview

- **Name**: C-Hear Technologies Limited
- **Tagline**: Your Trusted Partner for Computer Hardware & Software Supplies
- **Website**: www.c-hear.com
- **Contact**: +254 700 123 456 | info@c-hear.com
- **Brand Colors**: Red (#e32938) and Black (#0a0a0b) on white
- **Description**: A B2B IT hardware and software supplier website based in Kenya, also serving UK and US markets. The site enables business customers to browse a 79-product catalogue, build an enquiry list, and submit quote requests — no live payment processing.

---

## 2. Users and Use Cases

### 2.1 Target Users
- Business customers (B2B) in Kenya, UK, and US markets seeking IT hardware and software procurement.

### 2.2 Core Use Cases
- Browse products by category or search by name/SKU/brand.
- View product details and specifications.
- Add products to an enquiry cart and submit a Request for Quotation (RFQ).
- Learn about company solutions and services.
- Contact the company directly.

---

## 3. Page Structure and Functional Description

### 3.1 Page Hierarchy

```
C-Hear Technologies Website
├── Home (index)
├── Products
│   └── Product Detail (loaded via ?sku= URL parameter)
├── Solutions
├── Services
├── About Us
├── Contact Us
├── Quote Request
└── Checkout / RFQ
```

### 3.2 Global Layout Elements

**Top Contact Bar**
- Displays phone number (+254 700 123 456), email (info@c-hear.com), and social links.

**Sticky Header**
- Logo: assets/logo/chear-logo.png
- Navigation links: Home, Products, Solutions, Services, About Us, Contact Us
- Enquiry cart icon showing item count badge
- \"Request a Quote\" CTA button

**Enquiry Cart Sidebar Drawer**
- Accessible from the cart icon in the header.
- Lists products added to enquiry: product name, quantity (adjustable), remove option.
- Shows total item count.
- \"Proceed to Quote\" button navigates to the Checkout/RFQ page.
- Cart state persisted in localStorage.

**Footer**
- Company name, tagline, contact details, navigation links.

---

### 3.3 Home Page

**Hero Section**
- Full-width hero image: assets/hero/technology-hero.png
- Headline and tagline text overlay.
- CTA button linking to Products page.

**Benefits Bar**
- 5 benefit items displayed horizontally.

**Shop by Category Grid**
- 6 category tiles with images from assets/categories/ (6 category PNG files).
- Each tile links to the Products page filtered by that category.

**Stats Bar**
- 4 stats: 500+ Clients, 2000+ Products, 10+ Years, 24/7 Support.

**Featured Product Catalogue**
- Subset of products displayed as cards.
- Search input (by name/SKU/brand), category filter dropdown, currency selector (KES / USD / GBP).
- Each card shows brand, name, SKU, availability, \"View\" and \"Request Quote\" buttons.

**About Band**
- Brief company introduction section.

**Quote CTA Form**
- Inline form: name, company, email, phone, requirements textarea.
- On submit, displays a success toast notification. Form data is not sent to a backend.

---

### 3.4 Products Page

- Full catalogue of 79 products loaded from data/products.json.
- Search bar: filter by product name, SKU, or brand.
- Category filter dropdown: 13 categories (Laptops & Computers, Monitors & Displays, Printers & Imaging, Networking, Storage, Power & UPS, Accessories, CCTV & Security, Software & Licensing, Cybersecurity, Meeting & Collaboration, Cabling & Racks, Servers & Data Centre).
- Currency selector: KES / USD / GBP.
- Product cards display: brand, name, short description, SKU, availability status.
- Each card has \"View\" button (navigates to Product Detail) and \"Request Quote\" button (adds to enquiry cart).
- No fixed prices shown; all purchasing is quote-based.

---

### 3.5 Product Detail Page

- Loaded via URL parameter: ?sku=[SKU value]
- Reads matching product from data/products.json.
- Displays: brand, full product name, full description, SKU, availability, specifications, warranty information.
- Two action buttons:
  - \"Request a Quote\": adds product to enquiry cart and shows confirmation.
  - \"Add to Enquiry\": adds product to enquiry cart sidebar.
- No price displayed.

---

### 3.6 Solutions Page

6 solution areas presented as content sections or cards:
1. Business Computing
2. Network Infrastructure
3. Security & Storage
4. Software & Licensing
5. Meeting & Collaboration
6. Power & Continuity

Each section includes a title, description, and a CTA linking to the relevant product category or Contact page.

---

### 3.7 Services Page

6 service areas presented as content sections or cards:
1. IT Supply
2. Networking
3. Security
4. Deployment
5. Support
6. Quotations

Each section includes a title and description.

---

### 3.8 About Us Page

- Company story and professional supply ethos.
- Facts grid:
  - 79 catalogue entries
  - 3 currencies supported
  - Kenya as primary market
  - B2B workflow

---

### 3.9 Contact Us Page

- Contact details:
  - Phone: +254 700 123 456
  - Email: info@c-hear.com
  - Website: www.c-hear.com
  - Support reference
- Enquiry form: name, company, email, phone, message textarea.
- On submit, displays a success toast notification. Form data is not sent to a backend.

---

### 3.10 Quote Request Page

- Form fields: name, company, email, phone, requirements textarea.
- Displays count of items currently in the local enquiry cart.
- On submit, displays a success toast notification.

---

### 3.11 Checkout / RFQ Page

- Review section: lists all enquiry cart items (product name, quantity).
- Delivery country selector: Kenya / UK / US / Other.
- VAT framework display (informational only, not charged):
  - Kenya: 16%
  - UK: 20%
- Currency selector: KES / USD / GBP.
- Order summary panel.
- Submit quote form: name, company, email, phone, notes.
- On submit, displays a success toast notification. Cart is cleared from localStorage after successful submission.

---

## 4. Business Rules and Logic

### 4.1 Enquiry Cart
- Cart state is stored and read from localStorage.
- Products can be added from: Home featured catalogue, Products page, Product Detail page, Quote Request page.
- Users can adjust quantity or remove items from the sidebar drawer.
- Cart item count is displayed on the header cart icon.

### 4.2 Currency Conversion
- Three currencies supported: KES (base rate = 1), USD (rate = 0.0072), GBP (rate = 0.0057).
- Currency selector is available on Home (featured catalogue), Products page, and Checkout/RFQ page.
- Displayed values are converted using the fixed rates above. No live exchange rate API is used.
- No prices are shown on product cards or detail pages; currency selector applies to any indicative values shown at checkout summary.

### 4.3 VAT Framework
- VAT rates are displayed at the Checkout/RFQ page for informational purposes only.
- Kenya: 16%, UK: 20%.
- VAT is not calculated or charged in this build.

### 4.4 Quote Workflow
- All purchasing is quote-based (RFQ). No live payment processing.
- Form submissions on Quote Request, Checkout/RFQ, Contact Us, and Home CTA form all display a success toast and do not submit to a backend.

### 4.5 Product Data
- All 79 products are loaded from a static file: data/products.json.
- Product Detail page reads the product matching the ?sku= URL parameter from this file.

### 4.6 Asset References
- Logo: assets/logo/chear-logo.png
- Hero image: assets/hero/technology-hero.png
- Category images: 6 PNG files located in assets/categories/
- All image assets must be placed in the React public/ folder and referenced correctly.

---

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|---|---|
| ?sku= parameter not found in products.json | Display \"Product not found\" message with link back to Products page |
| Enquiry cart is empty on Checkout/RFQ page | Display empty state message and link back to Products page |
| Search/filter returns no results on Products page | Display \"No products found\" message |
| Form submitted with missing required fields | Highlight required fields; prevent submission |
| localStorage unavailable | Cart functionality degrades gracefully; no crash |

---

## 6. Acceptance Criteria

1. Open the website homepage; hero image, benefits bar, category grid, stats bar, and featured products are visible.
2. Select a category tile on the homepage; Products page opens filtered to that category.
3. On the Products page, search for a product by name or SKU; matching product cards are displayed.
4. Click \"View\" on a product card; Product Detail page loads with full product information for that SKU.
5. Click \"Request a Quote\" on the Product Detail page; product is added to the enquiry cart and the cart icon count increments.
6. Open the enquiry cart sidebar; added product is listed with quantity controls and a remove option.
7. Click \"Proceed to Quote\" in the sidebar; Checkout/RFQ page opens showing the enquiry items.
8. Select delivery country (Kenya), observe VAT framework (16%) displayed; select currency (USD), observe currency selector active.
9. Complete and submit the quote form on the Checkout/RFQ page; success toast appears and cart is cleared.
10. Navigate to Contact Us page; contact details (+254 700 123 456, info@c-hear.com, www.c-hear.com) are visible and enquiry form submits with a success toast.

---

## 7. Out of Scope (Not Implemented in This Build)

- Backend server, database, or API integration for form submissions or product data.
- Live currency exchange rate API.
- User authentication, login, or account management.
- Live payment processing or e-commerce checkout.
- VAT calculation or invoicing.
- Admin panel or product catalogue management interface.
- Email delivery of quote requests.
