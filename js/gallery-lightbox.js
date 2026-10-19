/**
 * MC Joint — Gallery Lightbox
 */
(function () {
  'use strict';

  let images = [];
  let current = 0;

  // Build lightbox DOM once
  const lb = document.createElement('div');
  lb.className = 'mc-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = `
    <div class="mc-lightbox-inner">
      <img id="mc-lb-img" src="" alt="" draggable="false">
    </div>
    <button class="mc-lb-btn" id="mc-lb-close" aria-label="Close"><i class="fas fa-times"></i></button>
    <button class="mc-lb-prev" id="mc-lb-prev" aria-label="Previous photo"><i class="fas fa-chevron-left"></i></button>
    <button class="mc-lb-next" id="mc-lb-next" aria-label="Next photo"><i class="fas fa-chevron-right"></i></button>
    <div class="mc-lb-caption" id="mc-lb-caption"></div>
    <div class="mc-lb-counter" id="mc-lb-counter"></div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('#mc-lb-img');
  const lbClose   = lb.querySelector('#mc-lb-close');
  const lbPrev    = lb.querySelector('#mc-lb-prev');
  const lbNext    = lb.querySelector('#mc-lb-next');
  const lbCaption = lb.querySelector('#mc-lb-caption');
  const lbCounter = lb.querySelector('#mc-lb-counter');

  function show(index) {
    current = (index + images.length) % images.length;
    const item = images[current];
    lbImg.src = item.src;
    lbImg.alt = item.alt || '';
    lbCaption.textContent = item.alt || '';
    lbCounter.textContent = (current + 1) + ' / ' + images.length;
    lbPrev.style.display = images.length > 1 ? '' : 'none';
    lbNext.style.display = images.length > 1 ? '' : 'none';
  }

  function open(index, imgs) {
    images = imgs;
    show(index);
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', function(e) { e.stopPropagation(); show(current - 1); });
  lbNext.addEventListener('click', function(e) { e.stopPropagation(); show(current + 1); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  let touchStartX = 0;
  lb.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function(e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? show(current + 1) : show(current - 1); }
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  function initGalleries() {
    document.querySelectorAll('.mc-gallery').forEach(function(grid) {
      // Collect all images in this gallery
      var items = Array.from(grid.querySelectorAll('.mc-gallery-item'));
      var imgData = items.map(function(item) {
        var img = item.querySelector('img');
        return { src: img ? img.src : '', alt: img ? img.alt : '' };
      });

      items.forEach(function(item, i) {
        // Attach click to the wrapper div (already exists in HTML)
        item.addEventListener('click', function() {
          open(i, imgData);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }

})();
