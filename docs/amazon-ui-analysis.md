# Amazon shopping UI analysis

Measured on 2026-10-05 from Amazon’s own markup and stylesheets. A direct request to `https://www.amazon.com/` returned HTTP 202 with an empty body (bot wall). WebFetch returned 403. The notes below come from these captures:

- Homepage HTML, captured 2026-10-05 20:17:59 UTC: `https://web.archive.org/web/20261005201759/https://www.amazon.com/`
- Inline nav CSS in that HTML (`:root` tokens and `#nav-belt` / `#nav-main` rules)
- AmazonUI stylesheet linked from that page (`AUIClients/AmazonUI`, 268 KB)
- Cart HTML, captured 2026-10-04: `https://web.archive.org/web/20261004033827/https://www.amazon.com/gp/cart/view.html`
- Sign-in URL captured 2026-09-28 was a captcha interstitial, not the real form. Auth layout below is that 350px shell plus the account flyout strings in the cart capture. Field-level auth behavior is the long-stable form those links point at; it was not in the HTML we could read.

## Palette actually in the capture

| Token | Hex | Where it showed up |
|---|---|---|
| Masthead | `#131921` | `--nav-desktop-header-tbg`, `#nav-belt` background |
| Sub-nav | `#232f3e` | `--nav-desktop-header-bbg`, `#nav-main` background |
| Search button | `#febd69` | `--nav-go-button-bg`, `.nav-search-submit` |
| Search button hover | `#f3a847` | `--nav-go-button-hbg` |
| Search focus ring | `#ff9900` | `box-shadow: 0 0 0 2px #ff9900, 0 0 0 3px rgba(255,153,0,.5)` |
| Department chip | `#e6e6e6` | `.nav-search-scope`, hover `#d4d4d4` |
| Cart count | `#f08804` | `--nav-cart-count`, `#nav-cart-count` |
| Dropdown caret | `#a7acb2` | `--nav-dropdown-arrows` |
| Ink | `#0f1111` | `body` color, 70 uses in AmazonUI |
| Muted | `#565959` | `.a-color-secondary` |
| Hairline | `#d5d9d9` | most-used border |
| Strong border | `#888c8c` | focus outlines, secondary button borders |
| Primary button | `#ffd814` | `.a-button-primary` fallback; hover token `#ffce12` / `#f8bd19` |
| Buy Now | `#ffa41c` | `.a-button-oneclick` fallback |
| Price / error | `#c10015` | `.a-color-price` and `.a-color-error` fallback |
| Link | `#2162a1` | `.a-color-link` fallback |
| Link active | `#0c3353` | `a:active` |
| Link hover rust | `#c45500` | `.a-color-state` (`--aok-sfs-color-link-hover-fg`) |
| In stock | `#0b7b3c` | `.a-color-success` |
| Deal red on homepage | `#cc0c39` | six times in homepage HTML, not in the AUI bundle |
| Soft fill | `#f0f2f2`, `#f7f7f7` | tiles and disabled surfaces |
| Page cards | `#ffffff` | product tiles |

Not present in the stylesheets opened from this capture: `#EAEDED`, `#007185`, `#B12704`, `#DE7921`. Those are the older storefront values. This capture has already moved links to `#2162a1` and the price class to `#c10015`. Stars are a sprite (`a-icon a-star-*` background-position), not a CSS fill, so no star hex was measurable. Homepage cards use `border-radius: 4px` and `8px`; a visual-cleanup variant uses `12px`. Buttons in AmazonUI use `border-radius: 7px` (and `5px` on focus rings). No `20px` or `100px` pill radius in that bundle.

Build against the measured tokens. Use `#eaeded` only as a page floor behind white cards, because the gateway is a gray field of white tiles even though that hex was not in the CSS bundles. Draw stars in `#ffa41c` (the measured Buy Now orange), since the sprite color was not exposed.

## Typography

From AmazonUI, font stack `"Amazon Ember", Arial, sans-serif`. Ember is proprietary; Arial is the shipped fallback.

| Role | Size | Weight | Line height |
|---|---|---|---|
| Body | 14px | 400 | 20px |
| h1 | 28px | 400 | 36px |
| h2 | 24px | 700 | 32px |
| h3 / h4 | 18px | 700 | 24px |
| Nav line 2 (Account & Lists, Update location) | 14px | 700 | 1 |
| Nav line 1 (Hello, sign in / Delivering to…) | ~12px | 400 | 1 |
| Button label | ~13–14px | 400 | tight |
| Footer legal | 11–12px | 400 | tight |

Price on a product page is a three-part lockup: small `$` top-left, large whole dollars, small cents top-right. Deal savings sit in `#c10015` or `#cc0c39`. List price is struck through in `#565959`.

No display type. Homepage section titles in the capture are bold and about one line, for example “$1 deals? Obsessed!” and “Shop our fall Top 100+ finds”.

## Spacing, borders, shadow, radius

- Base step is 4px. Common gaps in the captured card CSS: 4, 8, 12, 16.
- Default separation is a 1px `#d5d9d9` border, not a shadow.
- Homepage tiles: white, `border-radius: 4px`, image area with a faint `rgba(0,0,0,.03)` well, `gap: 4px`, image padding 4–8px.
- Secondary buttons: white, `1px solid #888c8c`, small shadow `0 2px 5px 0 hsla(180,5%,84%,.5)`, radius 8px, height about 36px (seen on video-card controls).
- Primary buttons are flat yellow, ink text `#0f1111`, radius about 7px. Dark text on yellow, never white text.
- Flyouts and the location modal use a light shadow. The location modal is 375px wide.
- Focus: 2px outline `#888c8c` or the orange search ring. Do not invent a glow.

## Breakpoints

The captured navbar is the desktop template (`Navigation-desktop-navbar`) with classes `nav-flex layout3 hamburger`. Amazon swaps templates rather than fluidly shrinking one header.

| Width | What changes |
|---|---|
| 1440–1500 | Full masthead. Search fills the center. Content sits in a wide column, roughly up to 1500px. |
| 1280 | Same chrome. Sub-nav links start to clip and scroll horizontally. |
| 1024 | Header compresses. Deliver-to label shortens. Some right-side labels drop to icons. |
| 768 | Search drops to its own row. Sub-nav becomes the hamburger (“All”). |
| 430 / 390 / 375 | Logo, search icon or full-width search, account, cart. No bottom tab bar on the website. Product page is a single column with a sticky purchase bar. Filters become a full-height drawer. |

Touch targets in the captured controls are about 36px tall.

## Header

`#nav-belt` is `#131921`, full width, about 60px.

Left to right:

1. Wordmark. In the capture it is a sprite plus a `.us` locale suffix. We draw our own wordmark; do not use the sprite.
2. Deliver-to. Pin icon, line 1 “Delivering to San Francisco 94102”, line 2 “Update location” in bold white. Opens a 375px “Choose your location” modal with a primary Done button.
3. Search, in `#nav-fill`, the widest region.
4. Language “EN”.
5. “Hello, sign in” / “Account & Lists” with a caret. Flyout contains a primary “Sign in” button and “New customer? Start here.”
6. “Returns” / “& Orders”.
7. Cart. Icon plus the word “Cart”. Count is `#f08804`, sitting on the icon. Empty state in the capture is “0 items in cart”.

`#nav-main` is `#232f3e`, about 39px. First item is “All” (hamburger) which opens a department menu. Then a horizontal list: Groceries, Prime, Pharmacy, Today’s Deals, Coupons, Audible, Amazon Home, Automotive, Music, Whole Foods, Registry, Video Games, New Releases, Fashion, Baby, Sports & Outdoors, Smart Home, Toys & Games, Handmade, Works with Alexa, Subscribe & Save, Custom Products, Gift Shop, Best Sellers, Amazon Haul, Kindle Books, Books, Luxury, Beauty & Personal Care, TV & Video. Hover lightens the navy. Links are 14px white.

## Search

One bar, three segments, about 40px tall:

- Left: “All” department select, background `#e6e6e6`, hover `#d4d4d4`.
- Center: white field, placeholder “Search Amazon”.
- Right: `#febd69` submit, about 45px wide, magnifying glass, hover `#f3a847`.

Focus wraps the whole bar in a `#ff9900` ring and turns the field borders `#febd69`. Submit goes to `/s?k=…`. Results page is a separate route, not an inline overlay. Typeahead exists on the live site; a short local suggestion list is enough.

## Auth

The captcha interstitial we fetched is a white page, a 350px column centered with 44px top padding, logo centered, then a bordered box and a full-width primary button.

The real sign-in flow, from the links in the cart flyout (`/ap/signin`, `/ap/register`):

- Logo only, no storefront nav.
- “Sign in” as an h1 (28px, weight 400).
- Label “Email or mobile phone number”, then a 32px input (`1px` border near `#888c8c` / `#a6a6a6`, radius about 3–4px).
- Continue is a full-width `.a-button-primary` (`#ffd814`).
- Password step: label, visibility toggle, “Forgot password?” in the link blue.
- Error text uses the price/error red (`#c10015`) under the field.
- Footer line: conditions of use and privacy notice as links.
- Divider, then “New to Amazon?” and a secondary full-width “Create your Amazon account”.
- Create-account page adds name, email, password, password again. Success returns to the store.
- Forgot-password asks for email and confirms a code was sent. No real mail.

Mobile is the same column at full width with 16px page padding, not a different visual system.

## Homepage

Gray floor, white cards, no giant hero headline. The capture’s first bands are promotional cards with bold titles (“$1 deals? Obsessed!”, “Create a Y2K inspired look”, “Shop our fall Top 100+ finds”) over photography, then product rows.

Structure to match:

1. Masthead + sub-nav.
2. A wide hero band (carousel) with a single promotional line, not a marketing-site headline.
3. A row of category tiles: image, short label, 4px radius, four to six across.
4. Deal row: discount badge in `#cc0c39`, struck list price, current price.
5. Recommendation rows with a 21–24px bold header and a horizontal strip of product cards.
6. Footer.

Cards are dense. Image dominates. Title is 14–16px, two lines, ink color, underline on hover. Rating is small stars plus a link-colored count. Price is the loudest text.

## Listing, filters, sort

Search results (`/s?k=`):

- Result count line, small, muted: “1-16 of 48 results for …”.
- Sort control top right: Featured, Price low to high, Price high to low, Avg. customer review, Newest.
- Left rail, about 240px: department, price range (min/max), customer review (4 stars & up), deals/badges. Apply by changing the query. 1px dividers, 14px labels, no cards-inside-cards.
- Grid of white product tiles. A list mode is a horizontal row: thumbnail left, title and price right.
- Pagination or a plain “Show more” text button. Not infinite scroll chrome.
- Badges: “Best Seller” in orange, “Deal” in `#cc0c39`, small, 2px radius.

Under 768px the rail is hidden behind a “Filters” button that opens a full-height drawer with a primary “Show results” button pinned to the bottom.

`/products` is the same listing without a required query, used for department browsing.

## Product details

Desktop is three columns, not a stacked blog post:

- Left: large image on white, vertical thumbnails to its left. Selected thumb has a `#ff9900` or `#888c8c` border.
- Center: title (about 24px, weight 400), star row + “N ratings” in link color, badge, price lockup, “In Stock” in `#0b7b3c`, a short bullet description, variation chips (color/size) as bordered buttons with the selected chip in `#ffd814` or a dark border.
- Right buy box: white, 1px `#d5d9d9`, about 240–280px, sticky. Price, delivery line, stock, quantity select, full-width Add to Cart (`#ffd814`), full-width Buy Now (`#ffa41c`), ships-from line.

Below: description, a spec table (label `#565959`, value `#0f1111`, row divider `#e7e7e7` / `#d5d9d9`), reviews, a related-products row.

Mobile: thumbnails go horizontal under the image. Buy box follows the title. A sticky bottom bar holds price + Add to Cart so the purchase action stays on screen.

## Cart

Captured empty state (2026-10-04):

- Page title “Your Amazon Cart”.
- Illustration plus “Your Amazon Cart is empty”.
- Link “Shop today’s deals” in the link color.
- Primary button “Sign in to your account”, secondary “Sign up now”.
- Even empty, the right column still has “Proceed to checkout” (`.a-button-primary`, full width of the rail).

Filled cart, the pattern those hooks imply:

- Left ~70%: each line is image, title (link), price, availability, a quantity control, and text actions “Delete” and “Save for later” in the link color, separated by a pipe.
- Right rail: “Subtotal (N items): $X” with the amount in the price color, then full-width Proceed to checkout.
- Saved for later is a second list under the active cart, same row pattern, with “Move to cart”.

Background of the cart page is white, not the gray gateway floor. Header stays.

## Checkout and confirmation

Live checkout is behind auth, so this is the structure the cart’s “Proceed to checkout” leads into, kept visually consistent with the cart rail:

- White page, left column of numbered sections (1 Shipping address, 2 Delivery method, 3 Payment), right rail order summary.
- Address is a plain form: name, street, city, state, ZIP, phone. Inputs match auth (32px, 1px border).
- Delivery is two radio rows, not cards with shadows: Standard and Expedited, price on the right.
- Payment is mock: card number, name, expiry, CVC. No network call.
- Summary repeats line items, subtotal, shipping, total. Place order is `#ffd814`, full width of the rail.
- Confirmation: green “Order placed” (`#0b7b3c`), an order number, a delivery estimate, the items, the total, and a secondary “Continue shopping” button.

## Account and orders

Header “Account & Lists” and “Returns & Orders” need somewhere to go. Keep them thin:

- Account: name, email, a sign-out button, links to orders and addresses stored locally.
- Orders: list of placed orders (number, date, total, items). Empty state is one sentence and a link home.

No order tracking backend.

## Footer

Captured footer starts with a full-width “Back to top” control on `#232f3e` (or slightly darker), then four columns: Get to Know Us, Make Money with Us, Amazon Payment Products, Let Us Help You. Bottom strip: language, country, and a smaller service list. Text is 12–14px, links `#ddd` / white on navy, column titles bold.

## Interaction patterns worth copying

- Search submits on Enter and on the amber button.
- Account and cart counts update without a reload.
- Add to Cart stays on the page and bumps the cart count. Buy Now goes to checkout.
- Quantity edits recalculate the rail immediately.
- Filters and sort are URL state so refresh and back work.
- Hover on a product title underlines and shifts toward `#c45500`.
- Primary buttons do not animate beyond a slightly darker yellow on hover.
- Modals (location) and drawers (mobile nav, mobile filters) use a 70% ink scrim. Close on scrim click and Escape.

## What we will not copy

Amazon sprites, the smile logo image, product photography from `m.media-amazon.com`, and any Amazon stylesheet. Wordmark is our own. Photos are Unsplash. Icons are Lucide.
