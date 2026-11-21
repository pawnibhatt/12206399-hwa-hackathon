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
