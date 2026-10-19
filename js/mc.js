/* MC Joint — site behaviour. Progressive: every page works without it. */
(function () {
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* mobile menu */
  var b = d.querySelector('.burger');
  if (b) {
    b.addEventListener('click', function () {
      var o = d.body.classList.toggle('menu-open');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { d.body.classList.remove('menu-open'); b.setAttribute('aria-expanded', 'false'); } });
    d.querySelectorAll('.drawer a').forEach(function (a) { a.addEventListener('click', function () { d.body.classList.remove('menu-open'); }); });
  }

  /* scroll progress */
  var bar = d.getElementById('bar');
  if (bar) w.addEventListener('scroll', function () {
    bar.style.width = (w.scrollY / Math.max(1, d.documentElement.scrollHeight - w.innerHeight) * 100) + '%';
  }, { passive: true });

  /* images that are not published yet fall back to a typographic tile */
  function noimg(img) {
    var host = img.closest('[data-ph]') || img.parentElement;
    if (host) host.classList.add('noimg');
  }
  d.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) noimg(img);
    img.addEventListener('error', function () { noimg(img); });
  });

  /* reveal */
  var items = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in w && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        var n = e.target.querySelector('[data-n]'); if (n) count(n);
      });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); var n = el.querySelector('[data-n]'); if (n) n.textContent = n.dataset.n + (n.dataset.s || ''); }); }

  function count(b) {
    var n = +b.dataset.n, s = b.dataset.s || '', t0 = performance.now();
    (function f(t) { var k = Math.min((t - t0) / 1200, 1); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + s; if (k < 1) requestAnimationFrame(f); })(t0);
  }

  /* poster tilt (pointer devices only) */
  if (!reduce && w.matchMedia('(hover:hover)').matches) {
    d.querySelectorAll('.poster').forEach(function (p) {
      p.addEventListener('mousemove', function (e) {
        var r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        p.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) scale(1.015)';
      });
      p.addEventListener('mouseleave', function () { p.style.transform = ''; });
    });
  }

  /* filters: <button data-f="x"> filters [data-c] items inside the same section */
  d.querySelectorAll('[data-filter]').forEach(function (bar) {
    var scope = d.querySelector(bar.getAttribute('data-filter')) || d;
    bar.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === btn); });
        var f = btn.getAttribute('data-f');
        scope.querySelectorAll('[data-c]').forEach(function (el) {
          var cs = (el.getAttribute('data-c') || '').split('|');
          el.style.display = (f === 'all' || cs.indexOf(f) > -1) ? '' : 'none';
        });
        if (history.replaceState) history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
      });
    });
    var h = decodeURIComponent((location.hash || '').slice(1));
    if (h) { var m = bar.querySelector('button[data-f="' + h.replace(/"/g, '') + '"]'); if (m) m.click(); }
  });

  /* lightbox */
  var imgs = Array.prototype.slice.call(d.querySelectorAll('.gal img'));
  if (imgs.length) {
    var lb = d.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="x" aria-label="Close">✕</button><button class="p" aria-label="Previous">‹</button><img alt=""><button class="n" aria-label="Next">›</button><div class="c"></div>';
    d.body.appendChild(lb);
    var cur = 0, li = lb.querySelector('img'), lc = lb.querySelector('.c');
    var show = function (i) { cur = (i + imgs.length) % imgs.length; li.src = imgs[cur].currentSrc || imgs[cur].src; li.alt = imgs[cur].alt || ''; lc.textContent = (imgs[cur].alt ? imgs[cur].alt + ' · ' : '') + (cur + 1) + ' / ' + imgs.length; };
    imgs.forEach(function (im, i) { im.addEventListener('click', function () { show(i); lb.classList.add('on'); }); });
    lb.querySelector('.x').onclick = function () { lb.classList.remove('on'); };
    lb.querySelector('.p').onclick = function () { show(cur - 1); };
    lb.querySelector('.n').onclick = function () { show(cur + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('on'); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') lb.classList.remove('on');
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* contact page: inquiry chips write into the hidden field the form handler already reads */
  d.querySelectorAll('.inquiry-type').forEach(function (el) {
    el.addEventListener('click', function () {
      d.querySelectorAll('.inquiry-type').forEach(function (e) { e.classList.remove('selected'); });
      el.classList.add('selected');
      var f = d.getElementById('inquiryTypeField'); if (f) f.value = el.dataset.type;
    });
  });

  var y = d.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
