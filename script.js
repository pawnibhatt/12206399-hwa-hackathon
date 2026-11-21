const wheel = document.getElementById('wheel');
const compartments = document.querySelectorAll('.compartment');
const pointer = document.getElementById('pointer');
const puppies = document.querySelectorAll('.svg-pup');
const heroPuppy = document.querySelector('.puppy-hero');
const heroTail = document.getElementById('hero-tail');

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

// ---------- Puppies bounce + tail wag ----------
puppies.forEach((pup) => {
  const svg = pup.querySelector('svg');
  const tail = pup.querySelector('path[id^="tail"]');
  let wagFrame = null;

  function wagTail() {
    let angle = 0;
    let dir = 1;
    const step = () => {
      angle += dir * 14;
      if (angle >= 26 || angle <= -26) dir *= -1;
      tail.setAttribute('transform', `rotate(${angle} 88 44)`);
      wagFrame = requestAnimationFrame(step);
    };
    step();
  }

  function stopWag() {
    cancelAnimationFrame(wagFrame);
    tail.removeAttribute('transform');
  }

  pup.addEventListener('click', (e) => {
    e.stopPropagation();
    pup.classList.add('bouncing');
    wagTail();

    setTimeout(() => {
      pup.classList.remove('bouncing');
    }, 550);

    setTimeout(stopWag, 1500);
  });
});

// ---------- Hero puppy: lean, wag, scent lines ----------
let heroWagFrame = null;
let scentFrame = null;

function startHeroWag() {
  let angle = 0;
  let dir = 1;
  const step = () => {
    angle += dir * 10;
    if (angle >= 20 || angle <= -20) dir *= -1;
    heroTail.setAttribute('transform', `rotate(${angle} 275 110)`);
    heroWagFrame = requestAnimationFrame(step);
  };
  step();
}

function stopHeroWag() {
  cancelAnimationFrame(heroWagFrame);
  heroTail.removeAttribute('transform');
}

function triggerScentLines() {
  const lines = document.querySelectorAll('.scent-line');
  let i = 0;
  scentFrame = setInterval(() => {
    lines[i % lines.length].classList.toggle('active');
    i++;
  }, 180);
  setTimeout(() => {
    clearInterval(scentFrame);
    lines.forEach((l) => l.classList.remove('active'));
  }, 1400);
}

heroPuppy.addEventListener('click', (e) => {
  e.stopPropagation();
  heroPuppy.classList.add('wagging');
  startHeroWag();
  triggerScentLines();
  setTimeout(() => {
    heroPuppy.classList.remove('wagging');
    stopHeroWag();
  }, 1400);
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
