// 3D Cylinder Carousel JS
(function() {
  const track = document.querySelector('.carousel-3d-track');
  const cards = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const N = cards.length;
  let curr = 0;
  const theta = 360 / N;
  let radius = 540; // will be computed dynamically
  const container = document.querySelector('.carousel-3d-container');
  // ensure pagination element exists
  let pagination = container ? container.querySelector('.carousel-3d-pagination') : null;
  if (container && !pagination) {
    pagination = document.createElement('div');
    pagination.className = 'carousel-3d-pagination';
    pagination.setAttribute('aria-label', 'Carousel pagination');
    container.appendChild(pagination);
  }

  function computeLayout() {
    if (!cards[0]) return;
    const container = document.querySelector('.carousel-3d-container');
    const isSmall = container && container.classList.contains('small');
    const cardRect = cards[0].getBoundingClientRect();
    const cardW = cardRect.width || parseFloat(getComputedStyle(cards[0]).width) || (isSmall ? 280 : 340);
    const viewport = document.querySelector('.carousel-3d-viewport');
    const vw = viewport ? Math.max(viewport.clientWidth, window.innerWidth) : window.innerWidth;
    // compute radius from card width and from viewport width and take a balanced value
    const baseFromCard = (cardW / 2) / Math.tan(Math.PI / N);
    const baseFromViewport = (vw / 2) / Math.tan(Math.PI / N);
    // prefer the viewport-based radius so the cylinder fills available space,
    // but bias towards a tighter radius so more cards stay visible at once
    const viewportFactor = isSmall ? 0.55 : 0.65;
    const chosen = Math.max(baseFromViewport * viewportFactor, baseFromCard * 0.9);
    // tighter spacing for small mode
    const extra = isSmall ? 6 : 12;
    radius = Math.round(Math.max(isSmall ? 160 : 180, Math.min(chosen + extra, 2000)));
  }

  // interactive tilt state (driven by pointer inside container)
  let tiltX = 0;
  let tiltY = 0;
  if (container) {
    container.addEventListener('pointermove', (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width; // -0.5 .. 0.5
      const dy = (e.clientY - cy) / rect.height;
      // small tilt range
      tiltY = dx * -8; // left/right
      tiltX = dy * 6;  // up/down
    });
    container.addEventListener('pointerleave', () => {
      tiltX = 0; tiltY = 0;
    });
  }

  function buildPagination(){
    if (!pagination) return;
    pagination.innerHTML = '';
    for (let i = 0; i < N; i++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-dot';
      btn.setAttribute('aria-label', `Show slide ${i+1}`);
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        curr = i;
        update();
      });
      pagination.appendChild(btn);
    }
  }

  function update() {
    for (let i = 0; i < N; i++) {
      // base angle for card placement (independent of current rotation)
      const angle = theta * i;
      const container = document.querySelector('.carousel-3d-container');
      const isSmall = container && container.classList.contains('small');
      // circular index distance from current
      const distIndex = Math.min((i - curr + N) % N, (curr - i + N) % N);

      // visual tuning
      // tune boosts so up to two neighbors are clearly visible
      const centerBoost = isSmall ? 40 : 70;
      const nearBoost = isSmall ? 26 : 44;
      const secondNearBoost = isSmall ? 12 : 20;
      const scaleCenter = isSmall ? 1.08 : 1.12;
      const scaleNear = isSmall ? 0.9 : 0.92;

      let translateZExtra = 0;
      let scaleX = 1;
      let scaleY = 1;
      let opacity = 0.36;
      let zidx = 10;

      if (distIndex === 0) {
        translateZExtra = centerBoost;
        scaleX = scaleCenter * 1.02;
        scaleY = scaleCenter;
        opacity = 1;
        zidx = 300;
        // active card pop-up and tilt
        const tiltFactor = 1;
        const tx = (tiltX * tiltFactor).toFixed(2);
        const ty = (tiltY * tiltFactor).toFixed(2);
        cards[i].style.transform = `rotateY(${angle}deg) translateZ(${radius + translateZExtra}px) translateY(-8px) scale(${scaleX}, ${scaleY}) rotateX(${tx}deg) rotateY(${ty}deg)`;
        cards[i].style.zIndex = zidx;
        cards[i].style.opacity = opacity;
        cards[i].tabIndex = distIndex <= 1 ? 0 : -1;
        continue;
      } else if (distIndex === 1) {
        translateZExtra = nearBoost;
        // make immediate neighbors a bit wider while slightly shorter
        scaleX = isSmall ? 1.05 : 1.08;
        scaleY = isSmall ? 0.92 : 0.94;
        opacity = 0.96;
        zidx = 220;
      } else if (distIndex === 2) {
        translateZExtra = secondNearBoost;
        scaleX = 0.98;
        scaleY = 0.94;
        opacity = 0.78;
        zidx = 160;
      } else {
        translateZExtra = 0;
        scaleX = 0.92;
        scaleY = 0.92;
        opacity = 0.36;
        zidx = 10;
      }
      // neighbor and background cards: apply smaller tilt
      const neighborTiltFactor = distIndex === 1 ? 0.45 : (distIndex === 2 ? 0.22 : 0);
      const txn = (tiltX * neighborTiltFactor).toFixed(2);
      const tyn = (tiltY * neighborTiltFactor).toFixed(2);
      cards[i].style.transform = `rotateY(${angle}deg) translateZ(${radius + translateZExtra}px) scale(${scaleX}, ${scaleY}) rotateX(${txn}deg) rotateY(${tyn}deg)`;
      cards[i].style.zIndex = zidx;
      cards[i].style.opacity = opacity;
      cards[i].tabIndex = distIndex <= 1 ? 0 : -1;
    }
    track.style.transform = `translateZ(-${radius}px) rotateY(${-curr * theta}deg)`;

    // update pagination active state
    if (pagination){
      const dots = Array.from(pagination.children);
      dots.forEach((d, idx) => {
        if (idx === curr) d.classList.add('active'); else d.classList.remove('active');
      });
    }
  }

  prevBtn.addEventListener('click', () => {
    curr = (curr - 1 + N) % N;
    update();
  });
  nextBtn.addEventListener('click', () => {
    curr = (curr + 1) % N;
    update();
  });

  // Keyboard navigation
  track.parentElement.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // initial layout calculation
  computeLayout();
  buildPagination();
  update();

  // recompute on resize to keep cards within the container and avoid overlay
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeLayout();
      update();
    }, 120);
  });
})();
