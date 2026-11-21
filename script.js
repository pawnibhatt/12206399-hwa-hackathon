const wheel = document.getElementById('wheel');
const compartments = document.querySelectorAll('.compartment');
const shopButtons = document.querySelectorAll('.btn-shop, #shop-product');

// ---------- Rotating compartment wheel ----------
let currentRotation = 0;
let spinning = false;

function revealCompartmentAtTop() {
  const index = ((Math.round(currentRotation / 60) % 6) + 6) % 6;
  compartments.forEach((c, i) => {
    c.classList.toggle('revealed', i === index);
  });
}

wheel.addEventListener('click', () => {
  if (spinning) return;
  spinning = true;
  currentRotation += 60;
  wheel.classList.add('spinning');
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    revealCompartmentAtTop();
    wheel.classList.remove('spinning');
    spinning = false;
  }, 650);
});

// ---------- Eye-tracking dogs next to Shop Now ----------
const trackers = document.querySelectorAll('.dog-tracker');
const pupils = document.querySelectorAll('.dog-tracker .pupil');
const shopBtn = document.getElementById('shop-product');
let locked = false;

function getEyeCenter(eye) {
  const rect = eye.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function movePupils(targetX, targetY) {
  pupils.forEach((pupil) => {
    const eye = pupil.parentElement;
    const center = getEyeCenter(eye);
    const dx = targetX - center.x;
    const dy = targetY - center.y;
    const angle = Math.atan2(dy, dx);
    const radius = 6; // how far the pupil can move inside the eye
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;
    pupil.style.transform = `translate(${tx}px, ${ty}px)`;
  });
}

document.addEventListener('mousemove', (e) => {
  if (locked) return;
  movePupils(e.clientX, e.clientY);
});

shopBtn.addEventListener('mouseenter', () => {
  locked = true;
  const rect = shopBtn.getBoundingClientRect();
  const targetX = rect.left + rect.width / 2;
  const targetY = rect.top + rect.height / 2;
  trackers.forEach((t) => t.classList.add('locked'));
  movePupils(targetX, targetY);
});

shopBtn.addEventListener('mouseleave', () => {
  locked = false;
  trackers.forEach((t) => t.classList.remove('locked'));
});

// ---------- Celebration popup ----------
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.popup-close');

function openPopup() {
  overlay.style.display = 'block';
  popup.style.display = 'block';
}
function closePopup() {
  overlay.style.display = 'none';
  popup.style.display = 'none';
}

shopButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openPopup();
  });
});

closeBtn.addEventListener('click', closePopup);
overlay.addEventListener('click', closePopup);
