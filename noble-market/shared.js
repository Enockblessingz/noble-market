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

/* ---------- Product catalogue ---------- */
function generateProducts(n = 5000) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const name = category.split(' ')[0] + ' Item ' + i;
    const tags = Array.from(new Set([pick(TAGS), pick(TAGS)])).join(',');
    out.push({
      Product_Id: 'NM-' + String(i).padStart(6, '0'),
      Product_Name: name,
      Product_Category: category,
      Product_Description: 'High-quality ' + name.toLowerCase() + ' for ' + category.toLowerCase() + '. Fast delivery in Kigali.',
      Product_Price: rnd(1000, 500000),
      Product_Stock: rnd(0, 500),
      Product_Image_url: 'https://picsum.photos/seed/nm' + i + '/400/300',
      Product_Tags: tags
    });
  }
  return out;
}

let DB = null;
let DB_INDEX = null;

function initDB(n = 5000) {
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
