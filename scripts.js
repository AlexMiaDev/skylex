document.addEventListener('scroll', function() {
    const droneImage = document.getElementById('droneImage');
    const scrollPosition = window.scrollY;

    // Появление дрона при скролле вниз на 300px
    if (scrollPosition > 300) {
        droneImage.classList.add('visible-drone');
    } else {
        droneImage.classList.remove('visible-drone');
    }
});


/* ---- Robust media fallbacks: replace broken videos with an image ---- */
(function(){
  const posterFallback = 'avata2.webp';
  function replaceWithImage(video){
    try {
      const img = document.createElement('img');
      img.src = posterFallback;
      img.alt = video.getAttribute('aria-label') || video.getAttribute('title') || 'Preview';
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.borderRadius = getComputedStyle(video).borderRadius;
      const parent = video.parentElement;
      parent.replaceChild(img, video);
    } catch(e){ /* noop */ }
  }
  function watchVideo(v){
    let timer = setTimeout(()=>replaceWithImage(v), 7000);
    const clear = ()=>{ try{ clearTimeout(timer);}catch(_){ } };
    v.addEventListener('loadeddata', clear, { once:true });
    v.addEventListener('canplay', clear, { once:true });
    v.addEventListener('error', ()=>replaceWithImage(v), { once:true });
    v.addEventListener('stalled', ()=>replaceWithImage(v), { once:true });
    v.addEventListener('abort', ()=>replaceWithImage(v), { once:true });
  }
  document.querySelectorAll('video').forEach(watchVideo);
})();
