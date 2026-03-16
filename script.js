const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const products = [
  { id: 1, name: "Цемент М400", emoji: "🪨", price: 350, unit: "за мешок 50кг", category: "cement" },
  { id: 2, name: "Цемент М500", emoji: "🪨", price: 420, unit: "за мешок 50кг", category: "cement" },
  { id: 3, name: "Доска обрезная", emoji: "🪵", price: 1200, unit: "за куб.м", category: "wood" },
  { id: 4, name: "Фанера 18мм", emoji: "🪵", price: 1800, unit: "за лист", category: "wood" },
  { id: 5, name: "Перфоратор", emoji: "🔨", price: 8500, unit: "штука", category: "tools" },
  { id: 6, name: "Шуруповёрт", emoji: "🔧", price: 5200, unit: "штука", category: "tools" },
  { id: 7, name: "Кирпич красный", emoji: "🧱", price: 18, unit: "за штуку", category: "cement" },
  { id: 8, name: "Брус 100x100", emoji: "🪵", price: 950, unit: "за 6м", category: "wood" },
];

let cart = [];
let currentCategory = "all";

function renderProducts() {
  const list = document.getElementById("productList");
  const filtered = currentCategory === "all"
    ? products
    : products.filter(p => p.category === currentCategory);

  list.innerHTML = filtered.map(p => `
    <div class="product-card">
      <span class="emoji">${p.emoji}</span>
      <h3>${p.name}</h3>
      <div class="price">${p.price} ₽</div>
      <div class="unit">${p.unit}</div>
      <button class="add-btn" onclick="addToCart(${p.id})">В корзину</button>
    </div>
  `).join("");
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartBar();
}

function updateCartBar() {
  const bar = document.getElementById("cartBar");
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = total;
  bar.style.display = cart.length > 0 ? "block" : "none";
}

function openCart() {
  const modal = document.getElementById("cartModal");
  const items = document.getElementById("cartItems");
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  items.innerHTML = cart.map(c => `
    <div class="cart-item">
      <span>${c.emoji} ${c.name} x${c.qty}</span>
      <span>${c.price * c.qty} ₽</span>
      <button onclick="removeFromCart(${c.id})">✕</button>
    </div>
  `).join("");

  document.getElementById("cartSum").textContent = total;
  modal.style.display = "block";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBar();
  if (cart.length === 0) closeCart();
  else openCart();
}

function sendOrder() {
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const orderText = cart.map(c => `${c.name} x${c.qty} = ${c.price * c.qty}₽`).join("\n");
  tg.sendData(JSON.stringify({ order: cart, total }));
  alert("Заказ отправлен! ✅\n\n" + orderText + "\n\nИтого: " + total + "₽");
  cart = [];
  updateCartBar();
  closeCart();
}

renderProducts();
