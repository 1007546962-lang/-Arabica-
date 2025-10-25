
/* global gsap, ScrollTrigger */
if (location.protocol === 'file:') {
  document.body.innerHTML = '<div style="padding:24px;font:16px/1.6 system-ui">Run on http(s)/localhost. file:// is not acceptable.</div>';
  throw new Error('Blocked on file://');
}



// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);



// Navigation drawer toggle
var drawer = document.getElementById('navDrawer');
document.getElementById('hamburger').addEventListener('click', function () {
  drawer.show();
});



// Section scroll-reveal animation
var sections = document.querySelectorAll('.section');
for (var si = 0; si < sections.length; si++) {
  var section = sections[si];
  gsap.from(section, {
    opacity: 0,
    y: 24,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: section, start: 'top 70%', once: true }
  });
}




// Hero beans
var beanStack = document.getElementById('beanStack');
var WIDTH = beanStack.offsetWidth || 760;
var beanCount = Math.max(140, Math.min(260, Math.round(WIDTH * 0.28)));
var beans = [];



//  Create bean elements and assign random positions
for (var i = 0; i < beanCount; i++) {
  var b = document.createElement('div');
  b.className = 'bean';

  var startY = -60 - Math.random() * 240;
  var startX = 50 + (Math.random() * 2 - 1) * 22;

  var t = i / beanCount;
  var xSpread = 22 - t * 18;
  var endX = 50 + (Math.random() * 2 - 1) * xSpread;
  var endY = 420 + Math.random() * 40;

  b.dataset.sx = startX;
  b.dataset.sy = startY;
  b.dataset.ex = endX;
  b.dataset.ey = endY;

  b.style.left = startX + '%';
  b.style.top = startY + 'px';

  beanStack.appendChild(b);
  beans.push(b);
}




// Hero animation timeline
var heroTL = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

for (var j = 0; j < beans.length; j++) {
  var bb = beans[j];
  var dy = bb.dataset.ey - bb.dataset.sy;
  var dxPercent = bb.dataset.ex - bb.dataset.sx;

  heroTL
    .to(bb, { opacity: 1, duration: 0.1 }, j * 0.03)
    .to(
      bb,
      {
        y: dy,
        xPercent: dxPercent,
        rotation: gsap.utils.random(-25, 25),
        duration: 1.1 + Math.random() * 0.4
      },
      j * 0.03
    )
    .to(bb, { y: '-=18', duration: 0.22, yoyo: true, repeat: 1 }, j * 0.03 + 0.8);
}




// Flavour cloud fade-in
heroTL.to('#flavourCloud', { opacity: 1, duration: 2.5 }, 0.4);




// Play hero animation when entering viewport
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top 70%',
  once: true,
  onEnter: function () { heroTL.play(0); }
});




// Play hero animation when entering viewport
var path = document.getElementById('originPath');
var pathLen = path.getTotalLength();
path.style.strokeDasharray = pathLen;
path.style.strokeDashoffset = pathLen;

gsap.to(path, {
  strokeDashoffset: 0,
  duration: 1.8,
  ease: 'power2.out',
  scrollTrigger: { trigger: '#origin', start: 'top 70%', once: true }
});




// Origin map pin pop-in animation
var pins = gsap.utils.toArray('.pin');
for (var p = 0; p < pins.length; p++) {
  var pinEl = pins[p];
  var pinDelay = 0.2 + p * 0.12;
  gsap.fromTo(
    pinEl,
    { opacity: 0, scale: 0.6 },
    {
      opacity: 1,
      scale: 1,
      duration: 3,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '#origin', start: 'top 65%', once: true },
      delay: pinDelay
    }
  );
  pinEl.addEventListener('click', onPinClick);
}



// On pin click: show origin detail dialog
function onPinClick() {
  openOriginDialog(this.dataset.name);
}




// Create origin dialog dynamically
var originDialog = document.createElement('sl-dialog');
originDialog.setAttribute('label', 'Origin');
document.body.appendChild(originDialog);




// Dialog content template
function openOriginDialog(name) {
  originDialog.innerHTML =
    '<strong style="font-size:20px">' +
    name +
    '</strong><p class="muted">Process, altitude, flavour notes, and estate story.</p>';
  originDialog.show();
}




// Lifestyle
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');




//Scroll-in animation for lifestyle images
var lifeImgs = document.querySelectorAll('#lifestyle .card img');
for (var li = 0; li < lifeImgs.length; li++) {
  var imgEl = lifeImgs[li];
  gsap.to(imgEl, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: li * 0.06,
    ease: 'power2.out',
    scrollTrigger: { trigger: imgEl, start: 'top 85%', once: true }
  });
}




// Open lightbox when clicking a card
var lifeCards = document.querySelectorAll('#lifestyle .card');
for (var lc = 0; lc < lifeCards.length; lc++) {
  lifeCards[lc].addEventListener('click', onCardClick);
}

function onCardClick(e) {
  e.preventDefault();
  if (!lightbox || !lightboxImg) return;
  var url = this.getAttribute('data-img');
  lightboxImg.onload = function () {
    if (typeof lightbox.show === 'function') lightbox.show();
    else lightbox.setAttribute('open', '');
    lightboxImg.onload = null;
  };
  lightboxImg.src = url;
}




// Feature video play/pause logic
var fv = document.getElementById('featureVideoEl');
var playBtn = document.getElementById('featurePlay');

if (fv && playBtn) {
  playBtn.addEventListener('click', function () {
    if (fv.paused) {
      fv.play();
      playBtn.style.display = 'none';
    }
  });
  fv.addEventListener('pause', function () { playBtn.style.display = 'block'; });
  fv.addEventListener('play', function () { playBtn.style.display = 'none'; });
}




// Burst
var burstBtns = document.querySelectorAll('[data-burst]');
for (var bi = 0; bi < burstBtns.length; bi++) {
  burstBtns[bi].addEventListener('click', onBurstClick);
}

function onBurstClick() {
  var host = this.closest('.flavour-item');
  burstBeans(host);
}




// Create bean burst particle animation
function burstBeans(host) {
  var layer = document.createElement('div');
  layer.style.position = 'relative';
  layer.style.width = '1px';
  layer.style.height = '1px';
  host.appendChild(layer);

  var n = 26;   // number of particles
  var arr = [];

  for (var k = 0; k < n; k++) {
    var d = document.createElement('div');
    d.className = 'bean';
    d.style.opacity = '1';
    layer.appendChild(d);
    arr.push(d);
  }

  gsap.set(arr, { width: 10, height: 10, borderRadius: '50%' });

  var tl = gsap.timeline({ onComplete: function () { layer.remove(); } });

  for (var m = 0; m < arr.length; m++) {
    tl.to(
      arr[m],
      {
        x: gsap.utils.random(-220, 220),
        y: gsap.utils.random(-180, 180),
        rotation: gsap.utils.random(-180, 180),
        opacity: 0,
        duration: gsap.utils.random(0.6, 1.1),
        ease: 'power2.out'
      },
      m * 0.01
    );
  }
}




// Subscribe
var form = document.getElementById('subscribeForm');
var emailInput = document.getElementById('emailInput');
var emailError = document.getElementById('emailError');
var alertEl = document.getElementById('subscribeAlert');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  var v = emailInput.value.trim();



    // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    emailError.textContent = 'Enter a valid email.';
    emailInput.setAttribute('aria-invalid', 'true');
    return;
  }

  emailError.textContent = '';
  emailInput.removeAttribute('aria-invalid');

  var btn = document.getElementById('subscribeBtn');
  var ghost = document.createElement('div');
  ghost.style.position = 'relative';
  ghost.style.width = '1px';
  ghost.style.height = '1px';
  btn.parentElement.appendChild(ghost);

  var dots = [];
  for (var x = 0; x < 14; x++) {
    var d2 = document.createElement('div');
    d2.className = 'bean';
    d2.style.opacity = '1';
    ghost.appendChild(d2);
    dots.push(d2);
  }

  gsap.set(dots, { width: 10, height: 10, borderRadius: '50%' });

  var tl2 = gsap.timeline({ onComplete: function () { ghost.remove(); } });
  for (var y = 0; y < dots.length; y++) {
    tl2.fromTo(
      dots[y],
      { x: 0, y: 0, opacity: 1 },
      {
        x: gsap.utils.random(-60, 60),
        y: gsap.utils.random(-40, -100),
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      },
      y * 0.02
    );
  }

  alertEl.show();//show success alert
  form.reset();//reset form
});

