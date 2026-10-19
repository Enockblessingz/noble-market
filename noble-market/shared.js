// shared.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0pqtuL5eDApOv4pOUUBi-jM3WyaAFDR4",
  authDomain: "noble-market.firebaseapp.com",
  projectId: "noble-market",
  storageBucket: "noble-market.firebasestorage.app",
  messagingSenderId: "314986386361",
  appId: "1:314986386361:web:b4d7389902dd9306555c68",
  measurementId: "G-FJ6317FEB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global variables
let DB = [];
const state = window.state || {}; // Reference to state in HTML

// Initialize Database
window.initDB = async function() {
  try {
    // NOTE: If you use where() and orderBy() together, you will need a Composite Index in Firebase.
    // Example: const q = query(collection(db, "products"), where("Product_Category", "==", "Camera"), orderBy("Product_Price", "asc"));
    
    const querySnapshot = await getDocs(collection(db, "products"));
    DB = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    window.DB = DB; // Make it accessible to the HTML script
    
    // If DB is empty, load dummy data so your UI doesn't break
    if (DB.length === 0) {
        console.warn("Firestore is empty. Loading mock data.");
        DB = getMockData();
        window.DB = DB;
    }
    
    if (window.render) window.render(); // Re-render now that data is loaded
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

// Filter Logic
window.applyFilters = function(data) {
  let filtered = data;
  if (window.state && window.state.search) {
    filtered = filtered.filter(p => p.Product_Name.toLowerCase().includes(window.state.search.toLowerCase()));
  }
  if (window.state && window.state.category) {
    filtered = filtered.filter(p => p.Product_Category === window.state.category);
  }
  return filtered;
};

// Helper Functions
window.findProduct = function(id) {
  return DB.find(p => p.id === id || p.Product_Id === id);
};

window.escapeHtml = function(str) {
  if (!str) return '';
  return str.toString().replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
};

window.fmt = function(amount) {
  return 'RWF ' + Number(amount).toLocaleString();
};

// Cart Logic (LocalStorage)
window.getCart = function() {
  const cart = localStorage.getItem('nm_cart');
  return cart ? JSON.parse(cart) : [];
};

window.saveCart = function(cart) {
  localStorage.setItem('nm_cart', JSON.stringify(cart));
};

window.cartTotal = function(cart) {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
};

// User / Auth Mock (Replace with real Firebase Auth later)
window.isLoggedIn = function() {
  return localStorage.getItem('nm_user') !== null;
};

window.getUser = function() {
  const user = localStorage.getItem('nm_user');
  return user ? JSON.parse(user) : null;
};

// Orders Mock
window.getAllOrders = function() {
  const orders = localStorage.getItem('nm_orders');
  return orders ? JSON.parse(orders) : [];
};

window.saveAllOrders = function(orders) {
  localStorage.setItem('nm_orders', JSON.stringify(orders));
};

// Mock Data fallback
function getMockData() {
  return [
    {
      id: "1",
      Product_Id: "1",
      Product_Name: "Canon EOS R5 Mirrorless Camera",
      Product_Category: "Camera",
      Product_Price: 4500000,
      Product_Old_Price: 5000000,
      Product_Image_url: "https://via.placeholder.com/400x400?text=Camera",
      Product_Stock: 5,
      Product_Tags: ["new"],
      Product_Description: "High-end mirrorless camera."
    },
    {
      id: "2",
      Product_Id: "2",
      Product_Name: "MacBook Pro 16-inch M3 Max",
      Product_Category: "Computer",
      Product_Price: 3800000,
      Product_Old_Price: 4000000,
      Product_Image_url: "https://via.placeholder.com/400x400?text=MacBook",
      Product_Stock: 3,
      Product_Tags: ["new"],
      Product_Description: "Powerful laptop for professionals."
    }
  ];
}
