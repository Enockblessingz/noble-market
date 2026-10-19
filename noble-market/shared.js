/* ============================================================
   Noble Market — shared utilities
   ============================================================ */

const $ = (id) => document.getElementById(id);
const on = (id, ev, fn) => {
  const el = $(id);
  if (el) el.addEventListener(ev, fn);
};

const escapeHtml = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const fmt = (n) => 'RWF ' + Number(n || 0).toLocaleString();

/* ---------- Static data ---------- */
const CATEGORIES = [
  'Electronics & Accessories', 'Fashion', 'Baby & Kids', 'Fitness & Wellness',
  'Household Items', 'Jewelry, Eyewear, Watches & Accessories', 'Shoes & Accessories',
  'Home Appliances', 'Food & Beverages', 'School & Office Supplies',
  'Lights & Lighting', 'Sports & Entertainment', 'Other Products'
];

const RW_BANKS = [
  'Bank of Kigali Plc', 'BPR Bank Rwanda Plc (KCB Group)', 'I&M Bank Rwanda',
  'Equity Bank Rwanda Plc', 'Access Bank Rwanda Plc', 'Ecobank Rwanda Plc',
  'Guaranty Trust Bank Rwanda Plc', 'Bank of Africa Rwanda', 'NCBA Bank Rwanda Plc',
  'Rwanda Development Bank (BRD)', 'Zigama Credit and Savings Bank',
  'Unguka Bank', 'AB Bank Rwanda'
];

const TAGS = ['new', 'popular', 'sale', 'eco', 'premium', 'budget', 'local', 'imported'];
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rnd(0, arr.length - 1)];

/* ---------- Realistic Product Catalogue (Matching Screenshot) ---------- */
const REAL_PRODUCTS = [
  { name: 'Zoom F3 2-Input / 2-Track Recorder', cat: 'Electronics & Accessories', price: 399000, old_price: 500000, stock: 1, img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80', isNew: true },
  { name: 'Smallrig Sling Handle', cat: 'Electronics & Accessories', price: 199000, old_price: 250000, stock: 1, img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', isNew: true },
  { name: 'UURig Metal L Grip', cat: 'Electronics & Accessories', price: 85000, old_price: 90000, stock: 1, img: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&q=80', isNew: true },
  { name: 'DJI RS 3 Gimbal Stabilizer', cat: 'Electronics & Accessories', price: 650000, old_price: 900000, stock: 1, img: 'https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?w=500&q=80', isNew: true },
  { name: 'Martvsen R9 Max 20W Ring Light', cat: 'Electronics & Accessories', price: 99000, old_price: 100000, stock: 13, img: 'https://images.unsplash.com/photo-1593703355136-259b1a48e2bc?w=500&q=80', isNew: true },
  { name: 'ND250 Type-C Motorized Slider', cat: 'Electronics & Accessories', price: 115000, old_price: 150000, stock: 1, img: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=500&q=80', isNew: true },
  { name: 'Sigma 85mm f/1.4 DG HSM Art', cat: 'Electronics & Accessories', price: 1499000, old_price: 1900000, stock: 1, img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&q=80', isNew: true },
  { name: 'Godox WITSTRO Flash', cat: 'Electronics & Accessories', price: 750000, old_price: 1000000, stock: 1, img: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&q=80', isNew: true },
  { name: 'Toshiba Canvio Basics 1TB', cat: 'Electronics & Accessories', price: 250000, old_price: 250000, stock: 1, img: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80', isNew: true },
  { name: 'Sony 16–50 mm F3.5–5.6 OSS', cat: 'Electronics & Accessories', price: 230000, old_price: 500000, stock: 1, img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&q=80', isNew: true },
  { name: 'Sony charger BC-QZ1', cat: 'Electronics & Accessories', price: 25000, old_price: 40000, stock: 1, img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80', isNew: true },
  { name: 'Sony FE 70–200mm f/2.8 GM', cat: 'Electronics & Accessories', price: 2200000, old_price: 3000000, stock: 2, img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&q=80', isNew: true }
];

function generateProducts(n = 48) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const base = REAL_PRODUCTS[i % REAL_PRODUCTS.length];
    const tags = Array.from(new Set([pick(TAGS), pick(TAGS)])).join(',');
    
    // Create slight variations for duplicates to make it look like a large catalog
    const variant = i >= REAL_PRODUCTS.length ? ` (V${Math.floor(i / REAL_PRODUCTS.length) + 1})` : '';
    
    out.push({
      Product_Id: 'NM-' + String(i + 1).padStart(6, '0'),
      Product_Name: base.name + variant,
      Product_Category: base.cat,
      Product_Description: `High-quality ${base.name.toLowerCase()}. Fast delivery in Kigali, guaranteed authentic.`,
      Product_Price: base.price,
      Product_Old_Price: base.old_price,
      Product_Stock: base.stock,
      Product_Image_url: base.img,
      Product_Tags: base.isNew ? 'new' : tags
    });
  }
  return out;
}

let DB = null;
let DB_INDEX = null;

function initDB(n = 48) { 
  if (DB) return DB;
  DB = generateProducts(n);
  DB_INDEX = new Map(DB.map(p => [p.Product_Id, p]));
  loadCustomProducts().forEach(p => {
    if (!DB_INDEX.has(p.Product_Id)) {
      DB.unshift(p);
      DB_INDEX.set(p.Product_Id, p);
    }
  });
  return DB;
}

function findProduct(id) {
  return DB_INDEX ? DB_INDEX.get(id) : undefined;
}

/* ---------- Admin-added products ---------- */
const CUSTOM_PRODUCTS_KEY = 'nm_custom_products';

function loadCustomProducts() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]'); }
  catch { return []; }
}
function saveCustomProducts(arr) {
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(arr));
}
function addCustomProduct(p) {
  const arr = loadCustomProducts();
  arr.unshift(p);
  saveCustomProducts(arr);
  if (DB_INDEX && !DB_INDEX.has(p.Product_Id)) {
    DB.unshift(p);
    DB_INDEX.set(p.Product_Id, p);
  }
}
function removeCustomProduct(id) {
  saveCustomProducts(loadCustomProducts().filter(p => p.Product_Id !== id));
  if (DB_INDEX) {
    DB_INDEX.delete(id);
    if (DB) {
      const i = DB.findIndex(p => p.Product_Id === id);
      if (i >= 0) DB.splice(i, 1);
    }
  }
}

/* ---------- Auth ---------- */
function getUser() {
  try { return JSON.parse(localStorage.getItem('nm_user')); }
  catch { return null; }
}
function isLoggedIn() {
  return sessionStorage.getItem('nm_auth') === 'true';
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- Cart ---------- */
function getCart() {
  try { return JSON.parse(localStorage.getItem('nm_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('nm_cart', JSON.stringify(cart));
}
function cartTotal(cart) {
  return cart.reduce((sum, c) => sum + Number(c.price || 0) * c.qty, 0);
}

/* ============================================================
   Admin Global Data
   ============================================================ */
function getAllUsers() {
  try { return JSON.parse(localStorage.getItem('nm_all_users') || '[]'); }
  catch { return []; }
}
function saveAllUsers(users) {
  localStorage.setItem('nm_all_users', JSON.stringify(users));
}

function getAllOrders() {
  try { return JSON.parse(localStorage.getItem('nm_all_orders') || '[]'); }
  catch { return []; }
}
function saveAllOrders(orders) {
  localStorage.setItem('nm_all_orders', JSON.stringify(orders));
}
