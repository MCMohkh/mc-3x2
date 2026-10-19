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

/* ---- v2: typewriter headline + flipping word ---- */
(function(){
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var h=document.querySelector('h1.tw');
  if(h&&!rm){
    var bs=[].slice.call(h.querySelectorAll('b')),full=bs.map(function(b){return b.textContent});
    bs.forEach(function(b){b.style.animation='none';b.innerHTML='<i class="t"></i><i class="g">'+full[bs.indexOf(b)]+'</i>'});
    var li=0,ci=0,caret=document.createElement('u');caret.className='caret',tn=null;
    (function tick(){
      if(li>=bs.length){setTimeout(function(){caret.classList.add('done')},1800);return}
      var b=bs[li],t=b.querySelector('.t'),g=b.querySelector('.g');
      if(ci===0){tn=document.createTextNode('');t.appendChild(tn);t.appendChild(caret)}
      ci++;tn.nodeValue=full[li].slice(0,ci);g.textContent=full[li].slice(ci);
      if(ci>=full[li].length){li++;ci=0;setTimeout(tick,260)}else setTimeout(tick,li===0&&ci===1?500:55);
    })();
  }
  var w=document.getElementById('flipWord');
  if(w){
    var words=['Music','Crafts','Motion','Collaborations','Media','Community','Marketing','Celebrations'],i=0;
    setInterval(function(){
      w.classList.add('out');
      setTimeout(function(){i=(i+1)%words.length;w.textContent=words[i];w.classList.remove('out');w.classList.add('in');
        requestAnimationFrame(function(){requestAnimationFrame(function(){w.classList.remove('in')})})},320);
    },2600);
  }
})();

/* ---- v2: in-place video, episode picker, filmography toggle ---- */
(function(){
  function play(card){
    if(card.classList.contains('playing'))return;
    document.querySelectorAll('.vc.playing').forEach(function(o){stop(o)});
    var id=card.getAttribute('data-yt'),lst=card.getAttribute('data-list'),vt=card.querySelector('.vt');
    if(!vt)return;
    card.__orig=vt.innerHTML;
    var src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0'+(lst?'&list='+lst:'');
    vt.innerHTML='<iframe src="'+src+'" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    card.classList.add('playing');
  }
  function stop(card){if(card.__orig!=null){card.querySelector('.vt').innerHTML=card.__orig}card.classList.remove('playing')}
  document.addEventListener('click',function(e){
    var c=e.target.closest&&e.target.closest('.vc[data-yt]');
    if(c){e.preventDefault();play(c);return}
    var b=e.target.closest&&e.target.closest('.epb');
    if(b){
      var w=b.closest('[data-eps]');
      w.querySelectorAll('.epb').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});
      b.classList.add('on');b.setAttribute('aria-pressed','true');
      w.querySelector('#epN').textContent=b.dataset.n;w.querySelector('#epT').textContent=b.dataset.t;
      w.querySelector('#epD').textContent=b.dataset.d;w.querySelector('#epS').textContent=b.dataset.s;
      w.querySelector('#epImg').src=b.dataset.i;return}
    var t=e.target.closest&&e.target.closest('.disc-btn');
    if(t){var l=t.previousElementSibling;var o=l.classList.toggle('open');t.textContent=o?'Show fewer ↑':'Show full filmography ('+t.dataset.n+') ↓'}
  });
  document.addEventListener('keydown',function(e){
    if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('vc')&&e.target.hasAttribute('data-yt')){e.preventDefault();play(e.target)}
  });
})();
