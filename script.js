// ---------- Image slider ----------
const slider = document.getElementById('image-slider');
const track = document.querySelector('.slider-track');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const totalSlides = 3;
let touchStartX = 0;
let touchEndX = 0;

function goToSlide(index) {
  currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

slider.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
});

slider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 40) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }
}, { passive: true });

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
  });
});

document.getElementById('slider-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  goToSlide(currentSlide - 1);
});
document.getElementById('slider-next').addEventListener('click', (e) => {
  e.stopPropagation();
  goToSlide(currentSlide + 1);
});

// ---------- Cart logic ----------
const BOX_PRICE = 20;
const cart = {
  items: [],
  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  get count() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }
};

const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-amount');
const cartDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const cartClose = document.getElementById('cart-close');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartBtn = document.getElementById('add-to-cart');
const productQtySelect = document.getElementById('product-quantity');
const navCart = document.getElementById('nav-cart');

function updateCartUI() {
  cartCountEl.textContent = cart.count;
  cartTotalEl.textContent = '$' + cart.total;
  checkoutBtn.disabled = cart.count === 0;

  cartItemsEl.innerHTML = '';
  if (cart.items.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    return;
  }

  cart.items.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name} &times; ${item.qty}</div>
        <div class="cart-item-qty">$${item.price} each</div>
      </div>
      <div class="cart-item-price">$${item.price * item.qty}</div>
      <button class="cart-remove" data-idx="${idx}">&times;</button>
    `;
    el.querySelector('.cart-remove').addEventListener('click', () => {
      cart.items.splice(idx, 1);
      updateCartUI();
    });
    cartItemsEl.appendChild(el);
  });
}

function openCart() {
  overlay.style.display = 'block';
  cartDrawer.style.display = 'flex';
}
function closeCart() {
  overlay.style.display = 'none';
  cartDrawer.style.display = 'none';
}

navCart.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

addToCartBtn.addEventListener('click', () => {
  const qty = parseInt(productQtySelect.value, 10);
  const existing = cart.items.find(i => i.name === 'Sniffle Box');
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ name: 'Sniffle Box', price: BOX_PRICE, qty });
  }
  updateCartUI();
  openCart();
});

// ---------- Checkout logic ----------
const checkoutQtyEl = document.getElementById('checkout-qty');
const checkoutBoxPriceEl = document.getElementById('checkout-box-price');
const checkoutTotalEl = document.getElementById('checkout-total');
const placeOrderBtn = document.getElementById('place-order');
const checkoutMessage = document.getElementById('checkout-message');

function updateCheckoutSummary() {
  const qty = cart.count;
  const boxTotal = BOX_PRICE * qty;
  checkoutQtyEl.textContent = qty;
  checkoutBoxPriceEl.textContent = '$' + boxTotal;
  checkoutTotalEl.textContent = '$' + boxTotal;
}

checkoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeCart();
  updateCheckoutSummary();
  openCheckout();
});

const checkoutPanel = document.getElementById('checkout-panel');
const checkoutClose = document.getElementById('checkout-close');

function openCheckout() {
  overlay.style.display = 'block';
  checkoutPanel.style.display = 'flex';
}
function closeCheckout() {
  overlay.style.display = 'none';
  checkoutPanel.style.display = 'none';
}

checkoutClose.addEventListener('click', closeCheckout);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    closeCart();
    closeCheckout();
  }
});

const checkoutFormEl = document.getElementById('checkout-form');
const checkoutFormHTML = checkoutFormEl.innerHTML;

placeOrderBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const name = document.getElementById('checkout-name').value;
  const email = document.getElementById('checkout-email').value;
  const address = document.getElementById('checkout-address').value;
  const phone = document.getElementById('checkout-phone').value;
  const payment = document.getElementById('checkout-payment').value;

  if (!name || !email || !address || !phone) {
    checkoutMessage.textContent = 'Please fill in all fields.';
    checkoutMessage.style.color = '#b91c1c';
    return;
  }

  checkoutMessage.style.color = '#15803d';
  checkoutMessage.textContent = 'Booking order..';

  const boxTotal = BOX_PRICE * cart.count;
  setTimeout(() => {
    checkoutFormEl.innerHTML = `
      <div class="confirmation-card">
        <div class="confirmation-icon">&#10003;</div>
        <h3 class="confirmation-title">Order Confirmed!</h3>
        <p class="confirmation-text">${cart.count} Sniffle Box${cart.count > 1 ? 'es' : ''} + free 150g treat pack${
          cart.count > 1 ? 's' : ''
        } (total $${boxTotal}) paid via ${payment === 'cod' ? 'Cash on Delivery' : payment === 'online' ? 'Online Payment' : 'Card'}.</p>
        <p class="confirmation-text">Thank you, ${name}!</p>
        <button class="btn btn-primary btn-lg" id="continue-shopping">Continue Shopping</button>
      </div>
    `;
    document.getElementById('continue-shopping').addEventListener('click', () => {
      cart.items = [];
      updateCartUI();
      closeCheckout();
      checkoutFormEl.innerHTML = checkoutFormHTML;
    });
  }, 1200);

  cart.items = [];
  updateCartUI();
});

// ---------- Login modal ----------
const loginOverlay = document.getElementById('login-overlay');
const loginModal = document.getElementById('login-modal');
const loginClose = document.getElementById('login-close');
const loginForm = document.getElementById('login-form');
const navLogin = document.querySelector('.nav-login');

function openLogin() {
  loginOverlay.style.display = 'block';
  loginModal.style.display = 'block';
}
function closeLogin() {
  loginOverlay.style.display = 'none';
  loginModal.style.display = 'none';
}

navLogin.addEventListener('click', (e) => {
  e.preventDefault();
  openLogin();
});
loginClose.addEventListener('click', closeLogin);
loginOverlay.addEventListener('click', closeLogin);
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  closeLogin();
});
