const wheel = document.getElementById('wheel');
const innerRing = document.getElementById('inner-ring');
const pockets = document.querySelectorAll('.pocket');

// ---------- Rotating inner-ring wheel ----------
let currentRotation = 0;

function revealTopPocket() {
  const index = ((Math.round(currentRotation / 60) % 6) + 6) % 6;
  pockets.forEach((p, i) => {
    p.classList.toggle('revealed', i === index);
  });
}

wheel.addEventListener('click', () => {
  currentRotation += 60;
  innerRing.style.transform = `rotate(${currentRotation}deg)`;
  revealTopPocket();
});

// ---------- Celebration popup ----------
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.popup-close');
const shopButtons = document.querySelectorAll('.btn-shop, #shop-product');

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
