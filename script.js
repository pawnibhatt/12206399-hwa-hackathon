const puzzleBox = document.getElementById('puzzle-box');
const knob = document.getElementById('knob');
const treats = document.querySelectorAll('.treat');
const orderForm = document.getElementById('order-form');
const orderSubmit = document.getElementById('order-submit');
const orderMessage = document.getElementById('order-message');

let rotationY = 0;
let rotationX = 0;

// Rotate puzzle when knob is clicked or dragged
knob.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' && e.pointerType !== 'touch') return;
  knob.setPointerCapture(e.pointerId);
  const startX = e.clientX;
  const startY = e.clientY;
  const startRotY = rotationY;
  const startRotX = rotationX;

  const onMove = (ev) => {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    rotationY = startRotY + dx * 0.5;
    rotationX = startRotX - dy * 0.5;
    applyTransform();
    showRandomTreat();
  };

  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
  };

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);
});

function applyTransform() {
  puzzleBox.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function showRandomTreat() {
  treats.forEach((t) => t.classList.remove('shown'));
  const t = treats[Math.floor(Math.random() * treats.length)];
  t.classList.add('shown');
  setTimeout(() => t.classList.remove('shown'), 700);
}

// Auto-rotate slightly for visual appeal
let autoAngle = 0;
function autoRotate() {
  autoAngle += 0.15;
  rotationY = Math.sin(autoAngle * 0.5) * 8;
  rotationX = Math.cos(autoAngle * 0.3) * 4;
  applyTransform();
  requestAnimationFrame(autoRotate);
}
autoRotate();

// Order form submission
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  orderSubmit.disabled = true;
  orderSubmit.textContent = 'Placing order…';
  orderMessage.textContent = '';

  const formData = new FormData(orderForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (res.ok) {
      orderMessage.style.color = '#15803d';
      orderMessage.textContent = result.message || 'Order placed!';
      orderForm.reset();
    } else {
      orderMessage.style.color = '#b91c1c';
      orderMessage.textContent = result.error || 'Order failed. Try again.';
    }
  } catch (err) {
    orderMessage.style.color = '#b91c1c';
    orderMessage.textContent = 'Unable to reach the server. Try again later.';
  } finally {
    orderSubmit.disabled = false;
    orderSubmit.textContent = 'Place order';
  }
});
