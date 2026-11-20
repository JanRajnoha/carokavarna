/* =========================================================
   Čarokavárna — interactions
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------------
     Language switch: CZ (/) ⇄ EN (/en/) in place, without a reload.
     en/index.html is generated from index.html (tools/build-en.mjs), so both pages share one structure:
     the other page is fetched (already on hover/touch), its texts are copied into this one and the
     address is swapped with history.replaceState — the visitor stays where they were.
     The switch is a real link, so search engines still see both pages; if anything fails it just navigates.
     --------------------------------------------------------- */
  const langLink = document.querySelector(".nav__lang");
  // taken before any other code adds elements, so it lines up 1:1 with the same list in the other page
  const attrEls = [...document.querySelectorAll("[alt],[aria-label],[title]")];
  const pages = {};
  const fetchPage = url => (pages[url] ||= fetch(url)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(html => new DOMParser().parseFromString(html, "text/html"))
    .catch(err => { delete pages[url]; throw err; }));

  // Relative URLs (images not loaded yet, video posters, links) would resolve against the new address
  // once it changes, so pin them to absolute ones first (icons in <head> too — browsers re-read them).
  // Stylesheets and scripts are left alone: already loaded, and touching a stylesheet's href reloads it.
  function pinRelativeUrls() {
    document.querySelectorAll("[src], [href], [data-poster], [poster]").forEach(el => {
      if (el.tagName === "SCRIPT" || el.matches('link[rel~="stylesheet"]')) return;
      for (const a of ["src", "href", "data-poster", "poster"]) {
        const v = el.getAttribute(a);
        if (!v || /^(#|\/|[a-z][a-z\d+.-]*:)/i.test(v)) continue;
        if (a === "src" && el.tagName === "VIDEO" && el.readyState > 0) continue;   // re-setting src would restart it
        el.setAttribute(a, new URL(v, document.baseURI).href);
      }
    });
  }

  async function switchLanguage(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   // new tab etc.: plain link
    e.preventDefault();
    const target = langLink.href;
    let doc;
    try { doc = await fetchPage(target); } catch { location.href = target; return; }
    const from = location.href.replace(/#.*$/, "");

    // keep whatever is at the top of the screen in place, even if the texts change length
    const navH = document.querySelector(".nav")?.offsetHeight || 0;
    let anchor = document.elementFromPoint(innerWidth / 2, navH + 8);
    anchor = anchor?.closest("[data-i18n], [data-i18n-html]") || anchor;
    const before = anchor?.getBoundingClientRect().top;

    pinRelativeUrls();
    history.replaceState(history.state, "", target + location.hash);

    const texts = {};
    doc.querySelectorAll("[data-i18n]").forEach(el => { texts[el.dataset.i18n] ??= el.textContent; });
    doc.querySelectorAll("[data-i18n-html]").forEach(el => { texts["html:" + el.dataset.i18nHtml] ??= el.innerHTML; });
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = texts[el.dataset.i18n]; if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const v = texts["html:" + el.dataset.i18nHtml]; if (v != null) el.innerHTML = v;
    });

    const otherAttrEls = doc.querySelectorAll("[alt],[aria-label],[title]");
    if (otherAttrEls.length === attrEls.length) {
      attrEls.forEach((el, i) => ["alt", "aria-label", "title"].forEach(a => {
        const v = otherAttrEls[i].getAttribute(a); if (v != null) el.setAttribute(a, v);
      }));
    }

    document.documentElement.lang = doc.documentElement.lang;
    document.title = doc.title;
    for (const [sel, a] of [['meta[name="description"]', "content"], ['link[rel="canonical"]', "href"]]) {
      const v = doc.querySelector(sel)?.getAttribute(a);
      if (v != null) document.querySelector(sel)?.setAttribute(a, v);
    }
    const next = doc.querySelector(".nav__lang");
    langLink.textContent = next.textContent;
    for (const a of ["hreflang", "lang", "aria-label"]) langLink.setAttribute(a, next.getAttribute(a));
    langLink.href = from;   // the switch now leads back to the page we came from

    if (anchor?.isConnected && before != null) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
  }

  if (langLink && "fetch" in window && "DOMParser" in window) {
    const prefetch = () => { fetchPage(langLink.href).catch(() => {}); };
    langLink.addEventListener("pointerenter", prefetch);
    langLink.addEventListener("focus", prefetch);
    langLink.addEventListener("touchstart", prefetch, { passive: true });
    langLink.addEventListener("click", switchLanguage);
  }

  /* ---------------------------------------------------------
     Navigation: scrolled state, progress bar, active link, burger
     --------------------------------------------------------- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  const burger = document.querySelector(".nav__burger");
  const navLinks = [...document.querySelectorAll(".nav__links a")];

  // once per frame at most: scroll events can fire many times per frame, and reading scrollHeight forces layout
  let scrollQueued = false;
  function onScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("is-scrolled", y > 40);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    // back in the hero → no section is "current"
    if (y < window.innerHeight * 0.5) navLinks.forEach(a => a.classList.remove("is-active"));
  }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.dataset.navFor || entry.target.id;   // data-nav-for: section shares another's link
      navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

  function closeNav() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.forEach(a => a.addEventListener("click", closeNav));

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  // Every .reveal element (texts, photos, cards…) rises out of the mist — but only once the
  // clouds of its section have parted (.is-risen). Elements that become ready together rise
  // one after another (delay fed to CSS via --d).
  const inView = new Set();
  const sectionOf = el => el.closest("main .section");

  function revealBatch(items) {
    items.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    items.forEach((el, k) => {
      revealObserver.unobserve(el);
      inView.delete(el);
      el.style.setProperty("--d", `${Math.min(k, 8) * 0.18}s`);
      el.classList.add("is-visible");
      setTimeout(() => el.style.removeProperty("--d"), 3200 + k * 180);   // so later hovers aren't delayed
    });
  }

  const revealObserver = new IntersectionObserver(entries => {
    const ready = [];
    entries.forEach(entry => {
      if (!entry.isIntersecting) { inView.delete(entry.target); return; }
      inView.add(entry.target);
      const section = sectionOf(entry.target);
      if (reduceMotion || !section || section.classList.contains("is-risen")) ready.push(entry.target);
    });
    if (ready.length) revealBatch(ready);
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------------
     Gallery lightbox
     --------------------------------------------------------- */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = "<img alt=''>";
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");

  document.querySelectorAll(".carousel__slide, .duo__photo").forEach(item => {
    if (!item.querySelector("img")) return;   // photo placeholders have nothing to enlarge
    item.tabIndex = 0;
    const open = () => {
      // in burning carousels a tap burns to the next photo instead — unless all photos already fit
      const burning = item.closest(".carousel--burn");
      if (burning && !burning.classList.contains("is-static")) return;
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add("is-open");
      setTimeout(() => { castRing(innerWidth / 2, innerHeight / 2, 1.8); burst(innerWidth / 2, innerHeight / 2, 18); }, 120);
    };
    item.addEventListener("click", open);
    item.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  /* ---------------------------------------------------------
     Photo carousels (interior in O nás, Dekorace) — native scroll-snap does the swiping;
     this keeps the counter and arrow buttons in sync with it
     --------------------------------------------------------- */
  /* ---------------------------------------------------------
     Burn transition (carousel--burn): the old photo burns away from the bottom up —
     a ragged noise edge with a glowing ember band and a charred fringe — revealing the
     new slide underneath. A canvas laid over the new slide draws the old picture,
     masked per frame by a low-res mask (cheap) scaled up smoothly.
     --------------------------------------------------------- */
  function makeNoise(w, h, seed) {
    // value-noise fbm in 0..1
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const out = new Float32Array(w * h);
    let amp = 1, total = 0;
    for (let oct = 0, cell = 24; oct < 4; oct++, cell /= 2, amp /= 2) {
      const gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2;
      const g = Float32Array.from({ length: gw * gh }, rnd);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const fx = x / cell, fy = y / cell, ix = fx | 0, iy = fy | 0;
        const tx = fx - ix, ty = fy - iy, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const a = g[iy * gw + ix], b = g[iy * gw + ix + 1], c = g[(iy + 1) * gw + ix], d = g[(iy + 1) * gw + ix + 1];
        out[y * w + x] += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy);
      }
      total += amp;
    }
    for (let i = 0; i < out.length; i++) out[i] /= total;
    return out;
  }

  // the ember flicker pattern never changes for a given size, so it is computed once
  const flickCache = new Map();
  function flickNoise(w, h) {
    const key = `${w}x${h}`;
    if (!flickCache.has(key)) flickCache.set(key, makeNoise(w, h, 99));
    return flickCache.get(key);
  }

  // draws el (img or video) into ctx like object-fit: cover with its object-position
  function drawCover(ctx, el, w, h) {
    const nw = el.naturalWidth || el.videoWidth, nh = el.naturalHeight || el.videoHeight;
    if (!nw || !nh) return false;
    const scale = Math.max(w / nw, h / nh), sw = w / scale, sh = h / scale;
    const [px, py] = getComputedStyle(el).objectPosition.split(" ").map(v => parseFloat(v) / 100);
    ctx.drawImage(el, (nw - sw) * (isNaN(px) ? .5 : px), (nh - sh) * (isNaN(py) ? .5 : py), sw, sh, 0, 0, w, h);
    return true;
  }

  // origin: optional {cx, cy, far} in viewport px — the fire spreads outward from the tap point; far is
  // the distance to the farthest corner of the visible row, so with several photos in view the fire
  // reaches the tapped photo first and its neighbours later. Without it the photo burns bottom-up (arrows).
  function burnTransition(fromSlide, toSlide, origin) {
    const media = fromSlide.querySelector("img, video");
    const w = toSlide.clientWidth, h = toSlide.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const old = document.createElement("canvas");
    old.width = w * dpr; old.height = h * dpr;
    try { if (!media || !drawCover(old.getContext("2d"), media, old.width, old.height)) return false; }
    catch (e) { return false; }

    const canvas = document.createElement("canvas");
    canvas.className = "burn-canvas";
    canvas.width = old.width; canvas.height = old.height;
    const ctx = canvas.getContext("2d");
    const lw = Math.ceil(w / 3), lh = Math.ceil(h / 3);          // low-res mask / fx layers
    const low = document.createElement("canvas");
    low.width = lw; low.height = lh;
    const lctx = low.getContext("2d");
    const img = lctx.createImageData(lw, lh), px = img.data;
    const noise = makeNoise(lw, lh, 7 + (Math.random() * 1e6 | 0));
    const flick = flickNoise(lw, lh);
    const field = new Float32Array(lw * lh);
    // field = when each spot catches fire (0 first … 1 last), roughened by noise for a ragged edge
    if (origin) {
      const r = toSlide.getBoundingClientRect();
      const ox = (origin.cx - r.left) / 3, oy = (origin.cy - r.top) / 3, far = origin.far / 3;
      for (let y = 0, i = 0; y < lh; y++) for (let x = 0; x < lw; x++, i++) field[i] = .78 * Math.min(1, Math.hypot(x - ox, y - oy) / far) + .22 * noise[i];
    } else {
      for (let y = 0, i = 0; y < lh; y++) for (let x = 0; x < lw; x++, i++) field[i] = .8 * (1 - y / lh) + .2 * noise[i];
    }
    toSlide.appendChild(canvas);

    const DUR = 1050, start = performance.now();
    const layer = (fn, op) => {             // fill the low-res layer and composite it, scaled up, onto the canvas
      for (let i = 0, j = 0; i < field.length; i++, j += 4) fn(i, j);
      lctx.putImageData(img, 0, 0);
      ctx.globalCompositeOperation = op;
      ctx.drawImage(low, 0, 0, canvas.width, canvas.height);
    };
    const frame = now => {
      const t = Math.min(1, (now - start) / DUR);
      const p = -.08 + 1.2 * (t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);   // ease in-out
      const shift = (now / 40 | 0) * 7;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(old, 0, 0);
      // 1) mask: keep the old photo where it hasn't burned yet (soft ragged edge)
      layer((i, j) => { const a = Math.max(0, Math.min(1, (field[i] - p) / .025)); px[j] = px[j + 1] = px[j + 2] = 0; px[j + 3] = a * 255; }, "destination-in");
      // 2) char: the old photo darkens just above the edge
      layer((i, j) => { const d = field[i] - p; const a = d > 0 && d < .11 ? (1 - d / .11) * .85 : 0; px[j] = 22; px[j + 1] = 10; px[j + 2] = 3; px[j + 3] = a * 255; }, "source-atop");
      // 3) embers: a flickering glowing band on the edge, spilling a little onto the new photo
      layer((i, j) => {
        const d = field[i] - p, k = Math.max(0, 1 - Math.abs(d - .005) / .04);
        const f = .65 + .35 * flick[(i + shift) % flick.length], hot = k > .55;
        px[j] = 255; px[j + 1] = hot ? 205 : 110 + 60 * k; px[j + 2] = hot ? 120 : 25; px[j + 3] = Math.min(255, k ** 1.4 * f * 290);
      }, "source-over");
      if (t < 1) requestAnimationFrame(frame);
      else canvas.remove();
    };
    requestAnimationFrame(frame);
    return true;
  }

  document.querySelectorAll(".carousel").forEach(carousel => {
    const track = carousel.querySelector(".carousel__track");
    const slides = [...track.children];
    const countEl = carousel.querySelector(".carousel__count b");
    const [prevBtn, nextBtn] = carousel.querySelectorAll(".carousel__btn");
    const pad = n => String(n).padStart(2, "0");
    carousel.querySelector(".carousel__total").textContent = pad(slides.length);   // total follows the slides in the HTML
    const step = () => slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
    const current = () => Math.round(track.scrollLeft / step());

    const sync = () => {
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      // with several photos in view the row stops before the last one reaches the left edge — count it as the last
      const i = atEnd ? slides.length - 1 : Math.min(current(), slides.length - 1);
      countEl.textContent = pad(i + 1);
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = atEnd;
      carousel.classList.toggle("is-static", track.scrollWidth <= track.clientWidth + 2);   // everything fits → no arrows
    };
    // while a smooth scroll is still running, the next click counts from where it's heading,
    // not from where the row happens to be, so quick clicks never get swallowed
    let raf = 0, pending = null, settle = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(raf); raf = requestAnimationFrame(sync);
      clearTimeout(settle); settle = setTimeout(() => { pending = null; }, 160);
    }, { passive: true });
    window.addEventListener("resize", sync);
    const burns = carousel.classList.contains("carousel--burn");
    // the furthest the row can actually go (with several photos in view it stops before the last one)
    const lastIndex = () => Math.min(slides.length - 1, Math.round((track.scrollWidth - track.clientWidth) / step()));
    function goTo(target, origin) {
      const from = pending ?? current();
      target = Math.max(0, Math.min(lastIndex(), target));
      const left = slides[target].offsetLeft - slides[0].offsetLeft;
      // carousel--burn: jump to the new position, then over every photo now in view burn away the
      // photo that stood in that spot before (falls back to sliding if nothing could be drawn)
      if (burns && !reduceMotion && pending === null && target !== from) {
        const tr = track.getBoundingClientRect();
        const before = slides.map(s => ({ s, left: s.getBoundingClientRect().left }))
          .filter(o => o.left < tr.right - 1 && o.left + o.s.offsetWidth > tr.left + 1);
        track.scrollTo({ left, behavior: "instant" });
        let started = 0;
        before.forEach(o => {
          const to = slides.find(n => Math.abs(n.getBoundingClientRect().left - o.left) < 3);
          if (to && to !== o.s && burnTransition(o.s, to, origin)) started++;
        });
        if (started) return;
      }
      pending = target;
      track.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
    }
    carousel.querySelectorAll(".carousel__btn").forEach(btn =>
      btn.addEventListener("click", () => goTo((pending ?? current()) + Number(btn.dataset.step))));

    // carousel--burn: a tap sets the photos on fire from the touched spot and moves on by one
    // (after the end it starts over); a swipe doesn't fire a click, so swiping still slides.
    // When every photo already fits (is-static) there is nowhere to go — the tap opens the photo instead.
    const multi = carousel.classList.contains("carousel--multi");
    if (burns) track.addEventListener("click", e => {
      const slide = e.target.closest(".carousel__slide");
      if (!slide || carousel.classList.contains("is-static") || track.querySelector(".burn-canvas")) return;
      const i = slides.indexOf(slide), cur = current();
      if (!multi && i !== cur) { goTo(i); return; }   // single photo: tapped the one peeking in at the side → go to it
      const tr = track.getBoundingClientRect(), cx = e.clientX, cy = e.clientY;
      const far = Math.max(...[[tr.left, tr.top], [tr.right, tr.top], [tr.left, tr.bottom], [tr.right, tr.bottom]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
      goTo(cur >= lastIndex() ? 0 : cur + 1, { cx, cy, far });
    });

    // carousel--burn autoplay: while at least half of it is on screen, it burns on to the next photo
    // every ~7 s (twice as long when a video is showing). Any interaction — arrow, tap, swipe, keys —
    // restarts the countdown; a mouse resting over it pauses it. Off with reduced motion.
    if (burns && !reduceMotion) {
      const AUTO = 7000;
      let timer = 0, inView = false, hovering = false;
      const schedule = () => {
        clearTimeout(timer);
        if (!inView || hovering || document.hidden) return;
        const hasVideo = slides[current()] && slides[current()].querySelector("video");
        timer = setTimeout(tick, AUTO * (hasVideo ? 2 : 1) + Math.random() * 1200);   // jitter: carousels in view don't fire together
      };
      const tick = () => {
        if (!carousel.classList.contains("is-static") && !track.querySelector(".burn-canvas")) {
          const cur = current();
          goTo(cur >= lastIndex() ? 0 : cur + 1);
        }
        schedule();
      };
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; schedule(); }, { threshold: .5 }).observe(track);
      document.addEventListener("visibilitychange", schedule);
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach(type => carousel.addEventListener(type, schedule, { passive: true }));
      track.addEventListener("scroll", () => { if (!track.querySelector(".burn-canvas")) schedule(); }, { passive: true });   // manual swipes
      carousel.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") { hovering = true; schedule(); } });
      carousel.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") { hovering = false; schedule(); } });
    }
    sync();
  });

  /* ---------------------------------------------------------
     Videos (cukrový mrak, first slides of the interior and dessert carousels) — load only
     when about to be seen, loop silently while visible (a carousel slide scrolled aside
     counts as hidden) and pause otherwise; with reduced motion they wait for a click
     --------------------------------------------------------- */
  // Still frames (data-poster) are set only when the video comes within ~1 screen, like lazy images
  const posterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.poster = entry.target.dataset.poster;
    posterObserver.unobserve(entry.target);
  }), { rootMargin: "800px" });
  document.querySelectorAll("video[data-poster]").forEach(v => posterObserver.observe(v));

  document.querySelectorAll("video[data-inview-play]").forEach(video => {
    if (reduceMotion) { video.controls = true; return; }
    new IntersectionObserver(([entry]) => {
      // autoplay blocked (e.g. data-saver) → show controls; other rejections are just a play() cut short by pause()
      if (entry.isIntersecting) video.play().catch(err => { if (err.name === "NotAllowedError") video.controls = true; });
      else video.pause();
    }, { threshold: 0.35 }).observe(video);
  });

  const closeLightbox = () => lightbox.classList.remove("is-open");
  lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeLightbox(); closeNav(); } });

  /* ---------------------------------------------------------
     Hero gold dust (rising particles)
     --------------------------------------------------------- */
  const dust = document.querySelector(".hero__dust");
  if (dust && !reduceMotion) {
    const ctx = dust.getContext("2d");
    let w, h, dpr, motes = [], running = true;

    const resize = () => {
      // iOS fires resize while scrolling (the address bar shows / hides); the hero's size doesn't
      // change then, so don't reallocate the canvas and respawn every mote
      if (dust.clientWidth === w && dust.clientHeight === h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = dust.clientWidth; h = dust.clientHeight;
      dust.width = w * dpr; dust.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      motes = Array.from({ length: count }, () => spawn(true));
    };
    const spawn = initial => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: Math.random() * 1.3 + 0.3,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.12,
      tw: Math.random() * Math.PI * 2,
      // denser near the bottom like the original
      a: Math.random() * 0.6 + 0.2,
    });

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy; m.tw += 0.03;
        if (m.y < -10) Object.assign(m, spawn(false));
        const depth = 0.35 + 0.65 * (m.y / h);
        ctx.globalAlpha = m.a * depth * (0.55 + 0.45 * Math.sin(m.tw));
        ctx.fillStyle = "#E0E0D1";
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    };

    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(tick);
    }).observe(dust);

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     Cursor sparkle trail + bursts
     --------------------------------------------------------- */
  const sc = document.querySelector(".sparkle-canvas");
  const sctx = sc.getContext("2d");
  let sparks = [], sparkLoop = false, sdpr = 1, scW = 0, scH = 0;
  // safety cap so frantic tapping can't pile up thousands of sparks (normal use stays far below it)
  const MAX_SPARKS = 400;
  // The glow around each spark is a pre-drawn soft sprite. (Canvas shadowBlur looks the same but is
  // computed per spark per frame — it was the main cost of every tap / title / logo effect on phones.)
  const glowSprite = document.createElement("canvas");
  glowSprite.width = glowSprite.height = 64;
  {
    const g = glowSprite.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(241, 242, 233, .85)");
    grd.addColorStop(.3, "rgba(241, 242, 233, .4)");
    grd.addColorStop(.6, "rgba(241, 242, 233, .1)");
    grd.addColorStop(1, "rgba(241, 242, 233, 0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  }

  const sizeSparkCanvas = () => {
    // iOS fires resize while scrolling as the address bar shows / hides — only the height changes then.
    // Keep the tallest size seen instead of reallocating the canvas on every scroll.
    const widthChanged = innerWidth !== scW;
    if (!widthChanged && innerHeight <= scH) return;
    scH = widthChanged ? innerHeight : Math.max(scH, innerHeight);
    scW = innerWidth;
    sdpr = Math.min(window.devicePixelRatio || 1, 2);
    sc.width = scW * sdpr; sc.height = scH * sdpr;
    sc.style.height = `${scH}px`;
    sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
  };
  sizeSparkCanvas();
  window.addEventListener("resize", sizeSparkCanvas);

  // Trail dust stays roughly where it was dropped (slow float), burst dust flies outwards
  function addSpark(x, y, speed = 0) {
    if (sparks.length >= MAX_SPARKS) return;
    const ang = Math.random() * Math.PI * 2;
    const v = speed * (0.4 + Math.random() * 0.6);
    sparks.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(ang) * v + (Math.random() - 0.5) * 0.15,
      vy: Math.sin(ang) * v - Math.random() * 0.2,
      life: 1,
      decay: Math.random() * 0.012 + 0.012,       // ~0.7–1.4 s at 60 fps
      size: Math.random() * 1.8 + 0.9,
      star: Math.random() < 0.18,
    });
    if (!sparkLoop) { sparkLoop = true; requestAnimationFrame(drawSparks); }
  }

  function burst(x, y, n) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) addSpark(x, y, 2.2);
  }

  // An expanding ring of light — the "spell" shockwave
  function castRing(x, y, power = 1) {
    if (reduceMotion) return;
    sparks.push({ ring: true, x, y, r: 2, vr: 3.4 * power, life: 1, decay: 0.022 });
    if (!sparkLoop) { sparkLoop = true; requestAnimationFrame(drawSparks); }
  }

  function drawStar(x, y, r) {
    sctx.beginPath();
    sctx.moveTo(x, y - r * 2.2);
    sctx.quadraticCurveTo(x, y, x + r * 2.2, y);
    sctx.quadraticCurveTo(x, y, x, y + r * 2.2);
    sctx.quadraticCurveTo(x, y, x - r * 2.2, y);
    sctx.quadraticCurveTo(x, y, x, y - r * 2.2);
    sctx.fill();
  }

  function drawSparks() {
    sctx.clearRect(0, 0, scW, scH);
    sparks = sparks.filter(s => s.life > 0);
    for (const s of sparks) {
      s.life -= s.decay;
      const a = Math.max(s.life, 0);
      if (s.ring) {
        s.r += s.vr; s.vr *= 0.96;
        const lw = 0.4 + 1.6 * a;
        sctx.strokeStyle = "#E0E0D1";
        sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // halo: two wide faint strokes under the line stand in for a shadow blur
        sctx.globalAlpha = a * 0.7 * 0.12; sctx.lineWidth = lw + 16 * a; sctx.stroke();
        sctx.globalAlpha = a * 0.7 * 0.22; sctx.lineWidth = lw + 7 * a; sctx.stroke();
        sctx.globalAlpha = a * 0.7; sctx.lineWidth = lw; sctx.stroke();
        continue;
      }
      s.x += s.vx; s.y += s.vy; s.vy = s.vy * 0.95 - 0.004; s.vx *= 0.95;
      const r = s.size * (0.45 + 0.55 * a);          // shrink as it fades
      const gr = r + 7 * a;                           // glow radius
      sctx.globalAlpha = a;
      sctx.drawImage(glowSprite, s.x - gr, s.y - gr, gr * 2, gr * 2);
      sctx.fillStyle = s.star ? "#F1F2E9" : "#E0E0D1";
      if (s.star) drawStar(s.x, s.y, r);
      else { sctx.beginPath(); sctx.arc(s.x, s.y, r, 0, Math.PI * 2); sctx.fill(); }
    }
    if (sparks.length) requestAnimationFrame(drawSparks);
    else { sparkLoop = false; sctx.clearRect(0, 0, scW, scH); }
  }

  if (!reduceMotion) {
    const STEP = 7; // px between dropped particles → continuous comet tail
    let lastX = null, lastY = null;
    window.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse" && !finePointer) return;
      if (lastX === null) { lastX = e.clientX; lastY = e.clientY; return; }
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < STEP) return;
      // fill the gap along the path so fast moves still leave an unbroken trail
      const n = Math.min(Math.floor(dist / STEP), 24);
      for (let i = 1; i <= n; i++) addSpark(lastX + (dx * i) / n, lastY + (dy * i) / n);
      lastX = e.clientX; lastY = e.clientY;
    }, { passive: true });
    document.addEventListener("pointerleave", () => { lastX = null; });

    document.querySelectorAll(".btn, a.chip, .logo").forEach(el =>
      el.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") burst(e.clientX, e.clientY, 10); }));
  }

  /* ---------------------------------------------------------
     Intro: logo appears centered, then rises as the rest fades in
     --------------------------------------------------------- */
  const heroLogo = document.querySelector(".hero__logo");
  const startIntro = () => {
    if (reduceMotion || window.scrollY > 10) {
      document.body.classList.remove("is-loading");
      return;
    }
    const r = heroLogo.getBoundingClientRect();
    const offset = window.innerHeight / 2 - (r.top + r.height / 2);
    heroLogo.style.setProperty("--intro-offset", `${offset}px`);
    // Apply the offset without transition, then release it
    heroLogo.style.transition = "none";
    heroLogo.getBoundingClientRect();
    heroLogo.style.transition = "";
    setTimeout(() => {
      document.body.classList.remove("is-loading");
      const rr = heroLogo.getBoundingClientRect();
      setTimeout(() => burst(rr.left + rr.width / 2, rr.top + rr.height / 2, 24), 500);
    }, 1100);
  };

  /* ---------------------------------------------------------
     Magic interactions
     --------------------------------------------------------- */

  // Click / tap anywhere → ring of light + sparkles (keyboard "clicks" have detail 0 and are skipped)
  document.addEventListener("click", e => {
    if (!e.detail) return;
    castRing(e.clientX, e.clientY);
    burst(e.clientX, e.clientY, 12);
  });

  // Soft light following the cursor over cards (position fed to CSS via --mx / --my)
  if (!reduceMotion) {
    document.addEventListener("pointermove", e => {
      const card = e.target.closest && e.target.closest(".branch");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  // Clicking the hero logo casts a big spell: the circle whirls, rings ripple out
  const heroCircle = document.querySelector(".hero__circle");
  heroLogo.addEventListener("click", () => {
    const r = heroLogo.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    burst(cx, cy, 50);
    [0, 180, 360].forEach(d => setTimeout(() => castRing(cx, cy, 1.7), d));
    if (heroCircle && !reduceMotion) {
      heroCircle.classList.remove("is-casting");
      heroCircle.getBoundingClientRect();         // restart the animation
      heroCircle.classList.add("is-casting");
    }
  });
  if (heroCircle) heroCircle.addEventListener("animationend", e => {
    if (e.animationName === "cast") heroCircle.classList.remove("is-casting");
  });

  // Clicking the cauldron makes the potion boil over; clicking the wand waves it and sparks fly off its tip
  function playOnce(el, cls) {
    el.classList.remove(cls);
    el.getBoundingClientRect();                   // restart the animation
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 1300);
  }
  const cauldron = document.querySelector(".about__cauldron");
  if (cauldron) cauldron.addEventListener("click", () => {
    const r = cauldron.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.4, 30);
    if (!reduceMotion) playOnce(cauldron, "is-brewing");
  });
  const wand = document.querySelector(".res-wand");
  if (wand) wand.addEventListener("click", () => {
    const tip = wand.querySelector(".wd-tip").getBoundingClientRect();
    const cx = tip.left + tip.width / 2, cy = tip.top + tip.height / 2;
    burst(cx, cy, 36);
    castRing(cx, cy, 1.2);
    if (!reduceMotion) playOnce(wand, "is-waving");
  });

  // Buttons: while hovered, sparks keep drifting off the border like a spell being held
  document.querySelectorAll(".btn").forEach(btn => {
    let timer = null;
    btn.addEventListener("pointerenter", e => {
      if (e.pointerType !== "mouse" || reduceMotion) return;
      clearInterval(timer);
      const start = performance.now();
      timer = setInterval(() => {
        const r = btn.getBoundingClientRect();
        // while the arrow flies, sparks stream off its tip (position read from the live transform)
        const tx = new DOMMatrixReadOnly(getComputedStyle(btn, "::before").transform).m41;
        const tipX = r.left - 2 + btn.clientWidth + 68 + tx;          // front of the rounded head
        if (tipX < r.right && performance.now() - start < 1600) {
          for (let k = 0; k < 3; k++) addSpark(tipX, r.top + r.height / 2 + (Math.random() - 0.5) * r.height * 0.6, 0.5);
          return;
        }
        let d = Math.random() * 2 * (r.width + r.height), x, y;   // then: random point on the perimeter
        if (d < r.width) { x = r.left + d; y = r.top; }
        else if ((d -= r.width) < r.height) { x = r.right; y = r.top + d; }
        else if ((d -= r.height) < r.width) { x = r.right - d; y = r.bottom; }
        else { x = r.left; y = r.bottom - (d - r.width); }
        addSpark(x, y, 0.35);
      }, 40);
    });
    btn.addEventListener("pointerleave", () => { clearInterval(timer); timer = null; });
  });

  // Titles: clicking one traces a sparkling arc over the words, ending in a burst, and the title glows
  function enchantTitle(title) {
    title.classList.remove("is-enchanted");
    title.getBoundingClientRect();                 // restart the glow animation
    title.classList.add("is-enchanted");
    if (reduceMotion) return;
    const range = document.createRange();
    range.selectNodeContents(title);
    const b = range.getBoundingClientRect();       // the words themselves, not the full-width block
    // the arc is traced in one rAF loop, in step with the screen (not 29 separate timers)
    const steps = 28, duration = 700, perStep = 3;
    let done = -1, t0 = null;
    const trace = now => {
      if (t0 === null) t0 = now;
      const upTo = Math.min(steps, Math.floor(((now - t0) / duration) * steps));
      while (done < upTo) {
        const i = ++done, t = i / steps;
        const x = b.left + t * b.width;
        const y = b.top + b.height * 0.45 - Math.sin(t * Math.PI) * (b.height * 0.55 + 14);
        for (let k = 0; k < perStep; k++) addSpark(x, y, 0.9);
        if (i === steps) { burst(x, y, 26); castRing(x, y, 1.3); }
      }
      if (done < steps) requestAnimationFrame(trace);
    };
    requestAnimationFrame(trace);
  }
  document.querySelectorAll(".title, .hero__title").forEach(title => {
    title.addEventListener("click", () => enchantTitle(title));
    title.addEventListener("animationend", e => { if (e.animationName === "enchant") title.classList.remove("is-enchanted"); });
  });

  // Magic leaflet: a circle of the printed menu shows around the pointer (position fed to CSS via
  // --unveil-x / --unveil-y). Mouse reveals on hover; a finger reveals while it's held down, with the
  // circle lifted above the fingertip so the finger doesn't cover what it uncovers.
  // Where the leaflet is shrunk a lot (phones, small tablets) the circle becomes a lens that magnifies
  // the menu back to its natural size, so the text is readable.
  // Touch screens can't hover, so there a wand reveals the menu by itself instead (see wandReveal).
  const TOUCH_LIFT = 56, LOUPE_LIFT = 110;
  const hoverless = window.matchMedia("(hover: none)").matches;
  document.querySelectorAll(".unveil").forEach(el => {
    const secret = el.querySelector(".unveil__secret");
    if (hoverless) { wandReveal(el, secret); return; }
    const move = e => {
      const r = el.getBoundingClientRect();
      const shrink = (secret.naturalWidth || 1380) / r.width;
      const loupe = shrink >= 1.5;
      const zoom = loupe ? shrink : 1;
      const lift = e.pointerType !== "touch" ? 0 : loupe ? LOUPE_LIFT : TOUCH_LIFT;
      const x = e.clientX - r.left, y = e.clientY - r.top;
      // the image is magnified around the pointer; the circle is drawn on the unmagnified image,
      // so to appear `lift` px higher it moves up by lift / zoom
      el.style.setProperty("--unveil-z", zoom);
      el.style.setProperty("--unveil-ox", `${x}px`);
      el.style.setProperty("--unveil-oy", `${y}px`);
      el.style.setProperty("--unveil-x", `${x}px`);
      el.style.setProperty("--unveil-y", `${y - lift / zoom}px`);
      el.style.setProperty("--unveil-lx", `${x}px`);           // lens rim, where the circle appears
      el.style.setProperty("--unveil-ly", `${y - lift}px`);
      el.classList.toggle("is-loupe", loupe);
      el.classList.add("is-active");
    };
    const hide = () => el.classList.remove("is-active");
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", hide);      // touch: fires after the finger lifts
    el.addEventListener("pointercancel", hide);
  });

  // The wand drifts along a looping Lissajous figure that sweeps the whole leaflet; the menu shows
  // around its tip and in a shrinking trail of circles behind it (each mask layer is one circle).
  // With reduced motion the menu is simply shown whole.
  function wandReveal(el, secret) {
    const wand = el.querySelector(".unveil__wand");
    el.classList.add("is-wand");
    const setMask = m => { secret.style.webkitMaskImage = secret.style.maskImage = m; };
    if (reduceMotion) { setMask("none"); return; }

    const LOOP = 20, TRAIL = 8, LAG = 0.14;       // s per loop, circles in the trail, s between them
    // tip position at time t, as a share of the leaflet's width / height
    const at = t => {
      const a = (t / LOOP) * 2 * Math.PI;
      return [0.5 + 0.42 * Math.sin(3 * a), 0.5 + 0.37 * Math.sin(2 * a + Math.PI / 4)];
    };
    let running = false, start = null, frame = 0, w = 0, h = 0;
    // size read only when it changes (not every frame)
    new ResizeObserver(() => { w = el.clientWidth; h = el.clientHeight; }).observe(el);

    const tick = now => {
      if (!running) return;
      if (start === null) start = now;
      const t = (now - start) / 1000;
      if (!w) { w = el.clientWidth; h = el.clientHeight; }
      const R = Math.max(36, w * 0.13) * Math.min(t / 0.8, 1);   // grows in at the start
      const circles = [];
      for (let i = 0; i < TRAIL; i++) {
        const [px, py] = at(t - i * LAG);
        const r = R * (1 - i / TRAIL);
        circles.push(`radial-gradient(circle at ${px * w}px ${py * h}px, #000 ${r * 0.55}px, transparent ${r}px)`);
      }
      setMask(circles.join(","));

      const [x, y] = at(t), [nx] = at(t + 0.05);
      const lean = Math.max(-1, Math.min(1, ((nx - x) * w) / 8)) * 14;   // tilts into its direction of travel
      wand.style.transform = `translate(${x * w}px, ${y * h}px) rotate(${lean - 35}deg)`;
      if (++frame % 5 === 0) {                     // a little dust falls off the tip
        const b = el.getBoundingClientRect();
        addSpark(b.left + x * w, b.top + y * h);
      }
      requestAnimationFrame(tick);
    };

    setMask("radial-gradient(transparent, transparent)");   // nothing shows until the wand arrives
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(tick);
    }).observe(el);
  }


  // Sections rise up out of a bank of clouds: each section gets a cloud layer that
  // parts and dissolves the first time the section scrolls into view
  if (!reduceMotion) {
    const cloudObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const section = entry.target;
        section.classList.add("is-risen");
        cloudObserver.unobserve(section);
        revealBatch([...inView].filter(el => section.contains(el)));
      });
    }, { rootMargin: "0px 0px -30% 0px" });
    document.querySelectorAll("main .section").forEach(section => {
      const clouds = document.createElement("div");
      clouds.className = "clouds";
      clouds.setAttribute("aria-hidden", "true");
      clouds.innerHTML = '<div class="cloud cloud--high"></div><div class="cloud cloud--mid"></div><div class="cloud cloud--l"></div><div class="cloud cloud--c"></div><div class="cloud cloud--r"></div><div class="cloud cloud--floor"></div>';
      section.appendChild(clouds);
      cloudObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------
     Looping decorations pause while out of view (hero, cauldron, wand, moving painting, leaflet
     wand glow, hovered buttons) — CSS .is-offscreen sets animation-play-state: paused
     --------------------------------------------------------- */
  const pauseObserver = new IntersectionObserver(entries => entries.forEach(entry =>
    entry.target.classList.toggle("is-offscreen", !entry.isIntersecting)), { rootMargin: "100px 0px" });
  document.querySelectorAll(".hero, .about__cauldron, .res-wand, .duo__photo--alive, .unveil__wand, .btn")
    .forEach(el => pauseObserver.observe(el));

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  // Start at the top on reload (the intro is built for it); #section links still open where they point
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  // Wait for webfonts (so layout is final) but never longer than ~0.8 s
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 800))])
    .then(startIntro);
})();
