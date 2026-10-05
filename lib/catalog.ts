export const CATEGORIES = [
  "Electronics",
  "Computers",
  "Home",
  "Kitchen",
  "Fashion",
  "Beauty",
  "Gaming",
  "Books",
  "Sports",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Badge = "Best Seller" | "Deal" | "Limited";
export type Availability = "In Stock" | "Only a few left" | "Currently unavailable";

export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: Category;
  description: string;
  highlights: string[];
  specifications: { label: string; value: string }[];
  availability: Availability;
  badge?: Badge;
  colors?: string[];
  prime: boolean;
  rank: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

type Seed = {
  id: string;
  title: string;
  brand: string;
  price: number;
  original: number;
  rating: number;
  reviews: number;
  category: Category;
  images: [string, string];
  blurb: string;
  badge?: Badge;
  stock?: Availability;
  colors?: string[];
  prime?: boolean;
};

function photo(id: string, w = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
}

const SEEDS: Seed[] = [
  { id: "e1", title: "Northpeak WH-4 Wireless Headphones", brand: "Northpeak", price: 129.99, original: 179.99, rating: 4.6, reviews: 18432, category: "Electronics", images: ["photo-1505740420928-5e560c06d30e", "photo-1484704849700-f032a568e944"], blurb: "Over-ear wireless headphones with 30-hour battery life and a fold-flat case.", badge: "Best Seller", colors: ["Black", "Silver", "Navy"] },
  { id: "e2", title: "Lumen Pulse Portable Speaker", brand: "Lumen", price: 49.99, original: 69.99, rating: 4.4, reviews: 6201, category: "Electronics", images: ["photo-1608043152269-423dbba4e7e1", "photo-1545454675-3531b543be5d"], blurb: "A compact speaker with a room-filling driver and 12-hour battery.", badge: "Deal", colors: ["Charcoal", "Sand"] },
  { id: "e3", title: "Kestrel X2 Mirrorless Camera", brand: "Kestrel", price: 849, original: 999, rating: 4.7, reviews: 2104, category: "Electronics", images: ["photo-1516035069371-29a1b244cc32", "photo-1510127034890-ba27508e9f1c"], blurb: "24-megapixel body with a kit lens, weather sealing, and fast autofocus.", badge: "Limited", colors: ["Black"] },
  { id: "e4", title: "Harbor 55-inch 4K LED TV", brand: "Harbor", price: 428, original: 549.99, rating: 4.3, reviews: 8904, category: "Electronics", images: ["photo-1593359677879-a4bb92f829d1", "photo-1461151304267-38535e780c79"], blurb: "4K panel with HDR10, three HDMI ports, and a thin bezel.", badge: "Deal" },
  { id: "e5", title: "Vela Phone 14 128GB", brand: "Vela", price: 699, original: 799, rating: 4.5, reviews: 12044, category: "Electronics", images: ["photo-1511707171634-5f897ff02aa9", "photo-1510557880182-3d4d3cba35a5"], blurb: "Unlocked phone with a bright OLED screen and all-day battery.", colors: ["Black", "White", "Blue"], stock: "Only a few left" },
  { id: "e6", title: "Marlowe Field Watch", brand: "Marlowe", price: 189, original: 249, rating: 4.4, reviews: 3112, category: "Electronics", images: ["photo-1523275335684-37898b6baf30", "photo-1434493789847-2f02dc6ca35d"], blurb: "Stainless case, sapphire crystal, and a 5-day power reserve.", colors: ["Silver", "Black"] },
  { id: "c1", title: "Plybook 14 Laptop, 16GB RAM", brand: "Ply", price: 979, original: 1199, rating: 4.5, reviews: 4521, category: "Computers", images: ["photo-1496181133206-80ce9b88a853", "photo-1517336714731-489689fd1ca8"], blurb: "14-inch laptop with 16GB memory, 512GB SSD, and a backlit keyboard.", badge: "Best Seller", colors: ["Silver", "Space gray"] },
  { id: "c2", title: "Oakboard K3 Mechanical Keyboard", brand: "Oakboard", price: 79.99, original: 99, rating: 4.6, reviews: 7340, category: "Computers", images: ["photo-1511467687858-23d96c32e4ae", "photo-1587829741301-dc798b83add3"], blurb: "Hot-swap switches, USB-C, and a solid aluminum top plate.", colors: ["Black", "White"] },
  { id: "c3", title: "Lumen 27-inch QHD Monitor", brand: "Lumen", price: 219, original: 279, rating: 4.4, reviews: 2890, category: "Computers", images: ["photo-1527443224154-c4a3942d3acf", "photo-1547082299-de196ea013d6"], blurb: "27-inch 1440p display with thin bezels and a height-adjust stand.", badge: "Deal" },
  { id: "c4", title: "Brisk Silent Wireless Mouse", brand: "Brisk", price: 24.99, original: 34.99, rating: 4.3, reviews: 15660, category: "Computers", images: ["photo-1527864550417-7fd91fc51a46", "photo-1615663245857-ac93bb7c39e7"], blurb: "Quiet clicks, a 1600 DPI sensor, and a USB receiver that stores inside.", badge: "Best Seller", colors: ["Black", "White"] },
  { id: "c5", title: "Northpeak Dock 7 USB-C", brand: "Northpeak", price: 89, original: 119, rating: 4.2, reviews: 1988, category: "Computers", images: ["photo-1625842268584-8f3296236761", "photo-1593640408182-31c70c8268f5"], blurb: "Seven-port dock with HDMI, ethernet, and 100W pass-through charging." },
  { id: "c6", title: "Fieldnote 6-in-1 USB-C Hub", brand: "Fieldnote", price: 29.99, original: 39.99, rating: 4.1, reviews: 5402, category: "Computers", images: ["photo-1593640408182-31c70c8268f5", "photo-1517336714731-489689fd1ca8"], blurb: "Pocket hub with HDMI, SD, and two USB-A ports.", stock: "Only a few left" },
  { id: "h1", title: "Harbor Arc Floor Lamp", brand: "Harbor", price: 64, original: 89, rating: 4.5, reviews: 2210, category: "Home", images: ["photo-1507473885765-e6ed057f782c", "photo-1513506003901-1e6a229e2d15"], blurb: "Arched floor lamp with a linen shade and a marble-look base.", badge: "Deal", colors: ["Brass", "Black"] },
  { id: "h2", title: "Oak & Iron 3-Seat Sofa", brand: "Oak & Iron", price: 899, original: 1099, rating: 4.4, reviews: 864, category: "Home", images: ["photo-1555041469-a586c61ea9bc", "photo-1493663284031-b7e3aefcae8e"], blurb: "Deep seats, kiln-dried frame, and performance fabric.", colors: ["Stone", "Navy", "Green"] },
  { id: "h3", title: "Lumen Ceramic Planter, Set of 2", brand: "Lumen", price: 28, original: 36, rating: 4.6, reviews: 4102, category: "Home", images: ["photo-1485955900006-10f4d324d411", "photo-1416879595882-3373a0480b5b"], blurb: "Matte ceramic planters with drainage holes and saucers.", badge: "Best Seller" },
  { id: "h4", title: "Marlowe Wool Throw Blanket", brand: "Marlowe", price: 42, original: 58, rating: 4.7, reviews: 6330, category: "Home", images: ["photo-1584100936595-c0654b55a2e2", "photo-1555041469-a586c61ea9bc"], blurb: "Heavyweight wool blend throw, 50 by 60 inches.", colors: ["Camel", "Charcoal", "Cream"] },
  { id: "h5", title: "Brisk Storage Bins, Set of 4", brand: "Brisk", price: 35, original: 48, rating: 4.2, reviews: 2771, category: "Home", images: ["photo-1558997519-83ea9252edf8", "photo-1586023492125-27b2c045efd7"], blurb: "Collapsible fabric bins with cutout handles." },
  { id: "h6", title: "Kestrel Wall Clock, 12 inch", brand: "Kestrel", price: 32, original: 45, rating: 4.3, reviews: 990, category: "Home", images: ["photo-1563861826100-9cb868fdbe1c", "photo-1507473885765-e6ed057f782c"], blurb: "Quiet sweep movement and a solid wood frame.", colors: ["Walnut", "Oak"] },
  { id: "k1", title: "Harbor Pour-Over Kettle", brand: "Harbor", price: 39.99, original: 54, rating: 4.6, reviews: 5120, category: "Kitchen", images: ["photo-1517668808822-9ebb02f2a0e6", "photo-1495474472287-4d71bcdd2085"], blurb: "Gooseneck kettle with a thermometer in the lid.", badge: "Best Seller", colors: ["Steel", "Matte black"] },
  { id: "k2", title: "Vela 12-Cup Drip Coffee Maker", brand: "Vela", price: 79.99, original: 109, rating: 4.3, reviews: 8440, category: "Kitchen", images: ["photo-1495474472287-4d71bcdd2085", "photo-1511920170033-f8396924c348"], blurb: "Programmable brewer with a thermal carafe.", badge: "Deal" },
  { id: "k3", title: "Oak & Iron 10-inch Skillet", brand: "Oak & Iron", price: 44.99, original: 62, rating: 4.8, reviews: 12003, category: "Kitchen", images: ["photo-1556909114-f6e7ad7d3136", "photo-1556911220-e15b29be8c8f"], blurb: "Pre-seasoned cast iron that holds heat for searing.", badge: "Best Seller" },
  { id: "k4", title: "Brisk Stand Mixer, 4.5 qt", brand: "Brisk", price: 199, original: 249, rating: 4.5, reviews: 1670, category: "Kitchen", images: ["photo-1570222094114-d054a817e56b", "photo-1556911220-e15b29be8c8f"], blurb: "Tilt-head mixer with a dough hook, whisk, and beater.", colors: ["White", "Red", "Black"], stock: "Only a few left" },
  { id: "k5", title: "Lumen Glass Storage Set, 8 piece", brand: "Lumen", price: 27.5, original: 38, rating: 4.4, reviews: 3904, category: "Kitchen", images: ["photo-1584568694244-14fbdf83bd30", "photo-1556911220-e15b29be8c8f"], blurb: "Borosilicate containers with locking lids." },
  { id: "f1", title: "Marlowe Wool Overcoat", brand: "Marlowe", price: 168, original: 220, rating: 4.5, reviews: 742, category: "Fashion", images: ["photo-1551028719-00167b16eac5", "photo-1591047139829-d91aecb6caea"], blurb: "Knee-length wool coat with a clean notch lapel.", badge: "Limited", colors: ["Camel", "Black", "Navy"] },
  { id: "f2", title: "Northpeak Court Sneakers", brand: "Northpeak", price: 86, original: 120, rating: 4.4, reviews: 9801, category: "Fashion", images: ["photo-1542291026-7eec264c27ff", "photo-1549298916-b41d501d3772"], blurb: "Leather court sneakers with a cushioned cupsole.", badge: "Deal", colors: ["White", "Black", "Green"] },
  { id: "f3", title: "Harbor Leather Tote", brand: "Harbor", price: 112, original: 148, rating: 4.6, reviews: 1544, category: "Fashion", images: ["photo-1548036328-c9fa89d128fa", "photo-1590874103328-eac38a683ce7"], blurb: "Full-grain leather tote with an interior laptop sleeve.", colors: ["Tan", "Black"] },
  { id: "f4", title: "Ply Cotton Crew Tee, 2 pack", brand: "Ply", price: 18, original: 28, rating: 4.2, reviews: 22014, category: "Fashion", images: ["photo-1521572163474-6864f9cf17ab", "photo-1576566588028-4147f3842f27"], blurb: "Heavyweight cotton tees, pre-shrunk.", badge: "Best Seller", colors: ["White", "Black", "Heather"] },
  { id: "f5", title: "Vela Slim Chinos", brand: "Vela", price: 48, original: 68, rating: 4.1, reviews: 2660, category: "Fashion", images: ["photo-1473966968600-fa801b869a1a", "photo-1542272604-787c3835535d"], blurb: "Stretch cotton chinos with a tapered leg.", colors: ["Khaki", "Navy", "Olive"] },
  { id: "f6", title: "Kestrel Knit Beanie", brand: "Kestrel", price: 22, original: 32, rating: 4.5, reviews: 1302, category: "Fashion", images: ["photo-1576871337622-98d48d1cf531", "photo-1520903920243-00d872a2d1c9"], blurb: "Ribbed merino beanie that sits close to the head.", colors: ["Charcoal", "Rust", "Cream"] },
  { id: "b1", title: "Lumen Eau de Parfum, 50ml", brand: "Lumen", price: 64, original: 85, rating: 4.4, reviews: 2109, category: "Beauty", images: ["photo-1541643600914-78b084683601", "photo-1594035910387-fea47794261f"], blurb: "Citrus, cedar, and a soft musk. Made for everyday wear.", badge: "Deal" },
  { id: "b2", title: "Marlowe Daily Moisturizer", brand: "Marlowe", price: 24, original: 32, rating: 4.6, reviews: 7740, category: "Beauty", images: ["photo-1556228720-195a672e8a03", "photo-1571781926291-c477ebfd024b"], blurb: "Unscented moisturizer with ceramides, 50ml.", badge: "Best Seller" },
  { id: "b3", title: "Harbor Matte Lip Color", brand: "Harbor", price: 16, original: 22, rating: 4.3, reviews: 4888, category: "Beauty", images: ["photo-1596462502278-27bfdc403348", "photo-1586495777744-4413f21062fa"], blurb: "A satin-matte lipstick that wears through a workday.", colors: ["Rose", "Brick", "Berry"] },
  { id: "b4", title: "Oak & Iron Shave Kit", brand: "Oak & Iron", price: 38, original: 52, rating: 4.5, reviews: 966, category: "Beauty", images: ["photo-1621607512214-68297480165e", "photo-1498842812179-c81beecf902c"], blurb: "Safety razor, stand, and a sandalwood cream." },
  { id: "b5", title: "Brisk Compact Hair Dryer", brand: "Brisk", price: 45, original: 62, rating: 4.2, reviews: 3411, category: "Beauty", images: ["photo-1522338242992-e1a54906a8da", "photo-1560066984-138dadb4c035"], blurb: "Ionic dryer with a concentrator nozzle and a cool shot.", colors: ["White", "Black"] },
  { id: "g1", title: "Vela Wireless Controller", brand: "Vela", price: 54.99, original: 69.99, rating: 4.6, reviews: 14220, category: "Gaming", images: ["photo-1606144042614-b2417e99c4e3", "photo-1593305841991-05c297ba4575"], blurb: "Low-latency wireless pad with hall-effect sticks.", badge: "Best Seller", colors: ["Black", "White"] },
  { id: "g2", title: "Northpeak Arena Headset", brand: "Northpeak", price: 79, original: 99, rating: 4.4, reviews: 5330, category: "Gaming", images: ["photo-1612287230202-1ff1d85d1bdf", "photo-1505740420928-5e560c06d30e"], blurb: "Surround headset with a detachable mic and memory-foam cups.", colors: ["Black", "Red"] },
  { id: "g3", title: "Kestrel 27-inch 165Hz Monitor", brand: "Kestrel", price: 289, original: 359, rating: 4.5, reviews: 1884, category: "Gaming", images: ["photo-1542751371-adc38448a05e", "photo-1511512578047-dfb367046420"], blurb: "165Hz IPS panel, 1ms response, and a DisplayPort cable in the box.", badge: "Deal" },
  { id: "g4", title: "Ply Tactile Mechanical Keyboard", brand: "Ply", price: 109, original: 139, rating: 4.7, reviews: 2760, category: "Gaming", images: ["photo-1595044426077-d36d9236d54a", "photo-1511467687858-23d96c32e4ae"], blurb: "Tactile switches, per-key lighting, and a coiled cable.", colors: ["Black", "White"] },
  { id: "g5", title: "Lumen Desk Mat, Extra Large", brand: "Lumen", price: 18, original: 26, rating: 4.6, reviews: 9012, category: "Gaming", images: ["photo-1616588589676-62b3bd4ff6d2", "photo-1542751371-adc38448a05e"], blurb: "900 by 400 millimeter cloth mat with a stitched edge.", badge: "Best Seller", colors: ["Black", "Gray"] },
  { id: "o1", title: "The Quiet Grid, hardcover", brand: "Fieldnote Press", price: 18.4, original: 24, rating: 4.5, reviews: 2401, category: "Books", images: ["photo-1512820790803-83ca734da794", "photo-1495446815901-a7297e633e8d"], blurb: "Essays on how small tools shape a workday. 286 pages.", badge: "Best Seller" },
  { id: "o2", title: "Harbor House Cookbook", brand: "Harbor House", price: 22, original: 32, rating: 4.7, reviews: 3188, category: "Books", images: ["photo-1544947950-fa07a98d237f", "photo-1512820790803-83ca734da794"], blurb: "Weeknight recipes with a short pantry list. 240 pages.", badge: "Deal" },
  { id: "o3", title: "Collected Essays, Marlowe", brand: "Marlowe", price: 16.99, original: 21, rating: 4.3, reviews: 640, category: "Books", images: ["photo-1495446815901-a7297e633e8d", "photo-1524995997946-a1c2e315a42f"], blurb: "Twelve essays on cities, kitchens, and long walks." },
  { id: "o4", title: "Trail Notes: A Field Guide", brand: "Oak & Iron", price: 14.5, original: 19, rating: 4.4, reviews: 1102, category: "Books", images: ["photo-1524995997946-a1c2e315a42f", "photo-1476275466078-4007374efbbe"], blurb: "Pocket guide to day hikes, with maps and packing lists." },
  { id: "o5", title: "Beginner Running, paperback", brand: "Brisk Press", price: 17, original: 23, rating: 4.2, reviews: 880, category: "Books", images: ["photo-1476275466078-4007374efbbe", "photo-1544947950-fa07a98d237f"], blurb: "An eight-week plan for a first 5K." },
  { id: "s1", title: "Northpeak 20 lb Dumbbell Pair", brand: "Northpeak", price: 64, original: 84, rating: 4.6, reviews: 4550, category: "Sports", images: ["photo-1517836357463-d25dfeac3438", "photo-1571019614242-c5c5dee9f50b"], blurb: "Hex dumbbells with a knurled grip. Sold as a pair.", badge: "Deal" },
  { id: "s2", title: "Vela Yoga Mat, 5mm", brand: "Vela", price: 28, original: 39, rating: 4.5, reviews: 8120, category: "Sports", images: ["photo-1544367567-0f2fcb009e0b", "photo-1518611012118-696072aa579a"], blurb: "Closed-cell mat with alignment marks. 68 inches long.", badge: "Best Seller", colors: ["Black", "Sage", "Clay"] },
  { id: "s3", title: "Harbor Running Shorts, 5 inch", brand: "Harbor", price: 32, original: 44, rating: 4.3, reviews: 1994, category: "Sports", images: ["photo-1552674605-db6ffd4facb5", "photo-1571019614242-c5c5dee9f50b"], blurb: "Lined shorts with a zip pocket and a split hem.", colors: ["Black", "Navy"] },
  { id: "s4", title: "Kestrel Insulated Bottle, 24 oz", brand: "Kestrel", price: 26, original: 34, rating: 4.7, reviews: 6701, category: "Sports", images: ["photo-1602143407151-7111542de6e8", "photo-1523362628745-0c100150b504"], blurb: "Double-wall bottle that keeps water cold for 24 hours.", colors: ["Steel", "Black", "Green"], stock: "Currently unavailable", prime: false },
];

function expand(seed: Seed, rank: number): Product {
  const discount =
    seed.original > seed.price ? Math.round((1 - seed.price / seed.original) * 100) : 0;
  const availability = seed.stock ?? "In Stock";
  const prime = seed.prime ?? availability !== "Currently unavailable";
  return {
    id: seed.id,
    title: seed.title,
    brand: seed.brand,
    price: seed.price,
    originalPrice: seed.original,
    discount,
    rating: seed.rating,
    reviewCount: seed.reviews,
    images: seed.images.map((id) => photo(id)),
    category: seed.category,
    description: `${seed.blurb} Sold by ${seed.brand} and packed for delivery from our warehouse. This is a sample listing for the amazone study storefront.`,
    highlights: [
      seed.blurb,
      `Brand: ${seed.brand}`,
      prime ? "FREE delivery on qualifying orders over $35" : "Standard shipping rates apply",
      availability === "In Stock" ? "Ships from amazone" : availability,
    ],
    specifications: [
      { label: "Brand", value: seed.brand },
      { label: "Category", value: seed.category },
      { label: "Model", value: seed.title },
      { label: "Customer rating", value: `${seed.rating} out of 5` },
      { label: "Warranty", value: "1 year limited" },
    ],
    availability,
    badge: seed.badge,
    colors: seed.colors,
    prime,
    rank,
  };
}

export const PRODUCTS: Product[] = SEEDS.map(expand);

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string) {
  return byId.get(id);
}

export function relatedProducts(id: string, n = 6) {
  const current = getProduct(id);
  if (!current) return PRODUCTS.slice(0, n);
  const same = PRODUCTS.filter((p) => p.category === current.category && p.id !== id);
  const rest = PRODUCTS.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, n);
}

export function reviewsFor(product: Product): Review[] {
  const names = ["Jordan P.", "Alicia M.", "Chris N.", "Priya S.", "Evan K.", "Noah R."];
  const titles = [
    "Exactly as described",
    "Worth the price",
    "Solid everyday pick",
    "Would buy again",
  ];
  const dates = ["August 2, 2026", "July 18, 2026", "September 3, 2026", "June 9, 2026"];
  return [0, 1, 2, 3].map((i) => ({
    id: `${product.id}-r${i}`,
    name: names[(product.reviewCount + i) % names.length],
    rating: Math.min(5, Math.max(3, Math.round(product.rating) - (i > 2 ? 1 : 0))),
    title: titles[i],
    body: `The ${product.title} matches the listing. ${product.highlights[0]} I would order it again.`,
    date: dates[i],
  }));
}

export type ProductQuery = {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  rating?: number;
  deals?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export function queryProducts(f: ProductQuery) {
  const q = (f.q || "").trim().toLowerCase();
  let items = PRODUCTS.filter((p) => {
    if (q && !`${p.title} ${p.brand} ${p.category} ${p.description}`.toLowerCase().includes(q)) return false;
    if (f.category && p.category !== f.category) return false;
    if (f.min != null && !Number.isNaN(f.min) && p.price < f.min) return false;
    if (f.max != null && !Number.isNaN(f.max) && p.price > f.max) return false;
    if (f.rating && p.rating < f.rating) return false;
    if (f.deals && p.discount <= 0) return false;
    return true;
  });
  const sort = f.sort || "featured";
  items = [...items].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating || b.reviewCount - a.reviewCount;
    if (sort === "newest") return b.rank - a.rank;
    return b.discount - a.discount || b.rating - a.rating;
  });
  const pageSize = f.pageSize || 12;
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, f.page || 1), pages);
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pages, pageSize };
}

export function suggest(q: string, n = 6) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return [];
  return PRODUCTS.filter((p) => p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, n);
}
