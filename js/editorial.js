/* MC editorial pages (html.mc26): rotating "Masters of ___" line, scroll-speed ticker, poster tilt */
(function(){
  var rw=document.getElementById('rw');
  if(rw){
    var W=['ceremonies','music distribution','talent management','film marketing','content production','social media strategy','brand design','event operations','IMDb & Wikipedia management'],i=0;
    setInterval(function(){rw.style.opacity=0;rw.style.transform='translateY(8px)';setTimeout(function(){i=(i+1)%W.length;rw.textContent=W[i];rw.style.opacity=1;rw.style.transform='none';},300);},2400);
  }
  var r=document.querySelector('.m-mq .m-r');
  if(r&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    var mx=0,mv=.7,ls=window.scrollY;
    (function t(){var d=Math.abs(window.scrollY-ls);ls=window.scrollY;mv+=(Math.min(.7+d*.4,16)-mv)*.1;mx-=mv;var h=r.scrollWidth/2;if(-mx>=h)mx+=h;r.style.transform='translateX('+mx+'px)';requestAnimationFrame(t);})();
  }
  if(window.matchMedia('(hover:hover)').matches&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.querySelectorAll('.m-poster').forEach(function(p){
      p.addEventListener('mousemove',function(e){var b=p.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;p.style.transform='perspective(800px) rotateY('+(x*9)+'deg) rotateX('+(-y*9)+'deg) scale(1.02)';});
      p.addEventListener('mouseleave',function(){p.style.transform='';});
    });
  }
})();
