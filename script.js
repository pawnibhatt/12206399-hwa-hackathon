const box = document.getElementById('box');
const innerBox = document.getElementById('inner-box');
const pockets = document.querySelectorAll('.pocket');

let currentIndex = 0;

function updateBox() {
  pockets.forEach((p, i) => {
    p.classList.toggle('revealed', i === currentIndex);
  });
  const offset = 325 - currentIndex * 120;
  innerBox.style.transform = `translate(-50%, -50%) translateX(${offset}px)`;
}

box.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % 6;
  updateBox();
});

updateBox();

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
