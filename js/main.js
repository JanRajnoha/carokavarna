/* =========================================================
   Čarokavárna — interactions
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------------
     Content: static strings (EN). CZ is read from the HTML.
     --------------------------------------------------------- */
  const EN = {
    "nav.about": "About", "nav.branches": "Contact", "nav.reservation": "Booking",
    "nav.decor": "Decorations", "nav.leaflet": "Magic menu", "nav.unique": "What makes us different", "nav.faq": "FAQ",
    "hero.line1": "Čarokavárna –", "hero.line2": "a place where magic comes alive and dreams come true.", "hero.tag": "Magical café", "hero.cta": "Enter the world of magic",
    "about.title1": "We're not just a café.",
    "about.title": "We're a small escape<br>from the hectic world.",
    "about.p1": "A place that awakens the child in each of us. Come take a break from the everyday rush and step into a world of spells and magic.",
    "about.p2": "Here you can leave your worries at the door and rediscover the honest joy and imagination of childhood.",
    "about.p3": "At Čarokavárna we believe you're never too old for magic. So we created a place where, at least for a moment, you can return to your childhood, let our enchanting atmosphere carry you away and enjoy moments you'll remember with a smile.",
    "chip.interior": "Interior", "chip.decor": "Decorations",
    "decor.title1": "Unique decorations", "decor.title2": "you won't see anywhere else",
    "decor.p1": "At Čarokavárna we take pride in originality and uniqueness. Our decorations aren't just ordinary interior accessories. They are one-of-a-kind pieces made to order, with attention to every detail. Many of them are even life-sized, so you can enjoy the magical world quite literally within arm's reach.",
    "decor.p2": "We keep improving Čarokavárna and taking it further. Since it opened, the interior has gone through a big transformation and has gradually filled up with all kinds of decorations, each with its own soul and story.",
    "leaflet.title1": "A wizard's menu", "leaflet.title2": "you conjure up yourself",
    "leaflet.p1": "Here at Čarokavárna we can turn even ordinary things into something extraordinary.",
    "leaflet.p2": "That's why you won't get just any old menu. Ours is magical, and it carefully guards its contents from the eyes of all muggles.",
    "leaflet.p3": "A true wizard has to conjure up their own menu! Just take our special magic wand in your hand and reveal the secrets hidden on its pages.",
    "leaflet.p4": "And believe us — truly anyone can master this spell! ✨",
    "chip.leaflet": "Magic menu", "chip.cakes": "Magical desserts", "chip.potions": "Potions & elixirs", "chip.rental": "To borrow", "chip.special": "Also worth a mention", "chip.unique": "What makes us different?", "chip.winter": "Winter menu", "chip.faq": "FAQ",
    "faq.title1": "Frequently asked", "faq.title2": "questions",
    "faq.q1": "Can children come too?",
    "faq.a1": "<p>Of course! ❤️ Čarokavárna is open to little and grown-up wizards alike, and there's no age limit. You're welcome to come with a pram, too.</p>",
    "faq.q2": "Can I buy a gift voucher?",
    "faq.a2": "<p>Yes! At Čarokavárna we offer gift vouchers worth 500 CZK and 1,000 CZK, depending on current availability.</p><p>Vouchers can only be bought in person, right at Čarokavárna. Unfortunately, we don't sell or send vouchers online.</p>",
    "faq.q3": "Are dogs allowed?",
    "faq.a3": "<p>Unfortunately not. Dogs aren't allowed anywhere in the arcade where Čarokavárna is located. Thank you for understanding.</p>",
    "faq.q4": "Are the wizard cloaks and other props free to borrow?",
    "faq.a4": "<p>Yes! All the props we lend out are completely free. Whether it's wizard cloaks, hats, masks, wands or board games, you can try everything during your visit at no charge.</p>",
    "faq.q5": "Is there an entrance fee?",
    "faq.a5": "<p>No, there's no entrance fee. You only pay for what you order.</p>",
    "faq.q6": "Do I need a reservation?",
    "faq.a6": "<p>On weekends, public holidays and during school holidays we strongly recommend booking, as we're often full.</p><p>On weekdays outside holidays you usually don't need a reservation, but if you want to be sure of a table, we recommend booking one.</p>",
    "faq.q7": "Can we come without a reservation?",
    "faq.a7": "<p>Of course! We keep four tables reserved for guests without a booking.</p><p>On weekends, public holidays and during school holidays they may all be taken, though. In that case, just wait a little while until one frees up.</p><p>On weekdays outside holidays you'll usually get in without a reservation and without waiting.</p>",
    "faq.q8": "How long can I book a table for?",
    "faq.a8": "<p>A standard reservation lasts one hour. If you'd like to enjoy the magical atmosphere longer, you can also book the next time slot.</p>",
    "faq.q9": "Do you have gluten-free and lactose-free desserts?",
    "faq.a9": "<p>Yes, we do! Fresh gluten-free and lactose-free desserts are delivered every Tuesday, Wednesday and Friday.</p><p>Sometimes a few are left for the following day, but on those days you can be most sure to find them.</p>",
    "faq.q10": "Do you decorate tables for birthdays?",
    "faq.a10": "<p>Unfortunately, we can't provide birthday table decorations due to capacity reasons.</p><p>But we're happy to make your birthday a little more special! We can put a birthday candle in a dessert of your choice and light it for you.</p>",
    "winter.badge": "Seasonal offer · limited time only",
    "winter.title1": "Even winter at Čarokavárna", "winter.title2": "has its magic! 🧣",
    "winter.p1": "We've prepared a special selection of winter drinks to warm you up, cheer you up and make the cold days more pleasant.",
    "winter.p2": "We'll give you a little taste in the photos — but what our winter specials really hide? That you'll have to come and discover yourself!",
    "unique.title1": "What makes Čarokavárna", "unique.title2": "special?",
    "unique.p1": "At Čarokavárna we take pride in originality, unique details and above all in experiences you won't find just anywhere. So what makes us special?",
    "unique.f1.title": "A wizard's menu", "unique.f1.text": "Forget ordinary drinks menus! Here you have to conjure up your menu yourself.",
    "unique.f2.title": "Unique decorations", "unique.f2.text": "Original made-to-order decorations, many of them life-sized. Each one has its own soul and story.",
    "unique.f3.title": "A sugar cloud that sweetens your coffee", "unique.f3.text": "Our Čarokavárna special! A lungo with a little sugar cloud that melts in the rising steam and rains sweetly right into your cup.",
    "unique.f4.title": "Wizard props and masks", "unique.f4.text": "Here you can become part of the magical world! Borrow cloaks, hats, wands or original masks and have a bit of fun.",
    "unique.f5.title": "Something new every time", "unique.f5.text": "We keep improving Čarokavárna, adding new decorations and coming up with more ideas. So every visit you can discover something new.",
    "special.title1": "Čarokavárna special –", "special.title2": "a sugar cloud that sweetens your coffee ☁️",
    "special.p1": "A lungo with a fluffy cotton-candy cloud that slowly melts in the steam rising from the hot coffee and starts to rain sweetly into your cup.",
    "paintings.title": "Magic paintings 🪄",
    "paintings.p1": "Hardly anyone notices at first glance. But did you know the paintings behind our bar aren't entirely ordinary?",
    "paintings.p2": "Look closely, and you'll find that they move.",
    "chest.title":"The magic chest 🗝️",
    "chest.p1": "Dare to solve our enchanted riddle? If you manage it, the treasure from the magic chest could be yours!",
    "chest.p2": "And don't worry, our treasures aren't just for little wizards. Kids and grown-ups alike will find something for themselves.",
    "special.p2":"A coffee experience you'll only find here!",
    "rental.title1": "You won't", "rental.title2": "get bored here…",
    "rental.p1": "To make your Čarokavárna experience even more intense, you can borrow our wizard cloaks, hats, wands or themed glasses.",
    "rental.p2": "And if you're up for a bit of fun, you can play board games or fool around in our original masks, which you can borrow in our photo corner by the platform.",
    "potions.title1": "Enchanting potions", "potions.title2": "for young and grown-up wizards",
    "potions.p1": "We serve our potions in original themed glasses with a smoking effect. Every potion has its own unique glass that completes the whole magical experience.",
    "potions.p2": "You'll find both alcoholic and non-alcoholic potions that will enchant you from the very first sip.",
    "lemonade.title1": "And we have lemonades", "lemonade.title2": "from the magic forest, too.",
    "lemonade.p1": "We make our homemade lemonades ourselves from fresh fruit.",
    "potions.p3":"We change our selection regularly, so after the New Year you can look forward to exciting new additions.",
    "cakes.title1": "Magic desserts", "cakes.title2": "that delight more than just your eyes…",
    "cakes.p1": "At Čarokavárna we take pride in a varied selection of original, themed treats that will enchant you not only with their looks but with their taste too.",
    "cakes.p2": "We change our selection regularly, so every visit you can discover and taste something new.",
    "cakes.p3": "And our selection also includes gluten-free and lactose-free desserts. 🌿",
    "cakes.p4": "Here is a small sample of our magical treats. ✨",
    "leaflet.hint": "Move your mouse over the menu to reveal what it hides.",
    "leaflet.hintWand": "Follow the magic wand — it reveals what the menu hides.",
    "branches.title": "Where to find us",
    "branches.brnoArea": "Brno city centre", "branches.map": "Show on map →",
    "days.tueSun": "Tue – Sun", "days.mon": "Monday", "days.closed": "Closed",
    "res.title": "Booking",
    "res.text": "Book your table easily through our CRM Cloud Cash reservation system. A few clicks and the spot is yours.",
    "res.book": "Book a table", "res.note": "Bookings are managed via CRM Cloud Cash",
    "ig.follow": "Follow us on Instagram →",
    "footer.made": "Made with magic",
  };

  /* ---------------------------------------------------------
     i18n
     --------------------------------------------------------- */
  const CS = {};
  document.querySelectorAll("[data-i18n]").forEach(el => { CS[el.dataset.i18n] = el.textContent; });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { CS[el.dataset.i18nHtml] = el.innerHTML; });

  let lang = "cs";
  try { if (localStorage.getItem("lang") === "en") lang = "en"; } catch (e) { /* storage unavailable */ }

  const pick = v => (typeof v === "string" ? v : v[lang]);

  function applyLang() {
    const dict = lang === "en" ? EN : CS;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const v = dict[el.dataset.i18nHtml];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-lang-toggle]").forEach(b => { b.textContent = lang === "en" ? "CZ" : "EN"; });
  }

  document.querySelectorAll("[data-lang-toggle]").forEach(btn => btn.addEventListener("click", () => {
    lang = lang === "en" ? "cs" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) { /* storage unavailable */ }
    applyLang();
  }));

  /* ---------------------------------------------------------
     Navigation: scrolled state, progress bar, active link, burger
     --------------------------------------------------------- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  const burger = document.querySelector(".nav__burger");
  const navLinks = [...document.querySelectorAll(".nav__links a")];

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("is-scrolled", y > 40);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    // back in the hero → no section is "current"
    if (y < window.innerHeight * 0.5) navLinks.forEach(a => a.classList.remove("is-active"));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
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
    carousel.querySelectorAll(".carousel__btn").forEach(btn =>
      btn.addEventListener("click", () => {
        const from = pending ?? current();
        // the furthest the row can actually go (with several photos in view it stops before the last one)
        const last = Math.min(slides.length - 1, Math.round((track.scrollWidth - track.clientWidth) / step()));
        pending = Math.max(0, Math.min(last, from + Number(btn.dataset.step)));
        track.scrollTo({ left: slides[pending].offsetLeft - slides[0].offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
      }));
    sync();
  });

  /* ---------------------------------------------------------
     Videos (cukrový mrak, first slides of the interior and dessert carousels) — load only
     when about to be seen, loop silently while visible (a carousel slide scrolled aside
     counts as hidden) and pause otherwise; with reduced motion they wait for a click
     --------------------------------------------------------- */
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
  let sparks = [], sparkLoop = false, sdpr = 1;

  const sizeSparkCanvas = () => {
    sdpr = Math.min(window.devicePixelRatio || 1, 2);
    sc.width = innerWidth * sdpr; sc.height = innerHeight * sdpr;
    sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
  };
  sizeSparkCanvas();
  window.addEventListener("resize", sizeSparkCanvas);

  // Trail dust stays roughly where it was dropped (slow float), burst dust flies outwards
  function addSpark(x, y, speed = 0) {
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
    sctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(s => s.life > 0);
    sctx.shadowColor = "rgba(241, 242, 233, .85)";
    for (const s of sparks) {
      s.life -= s.decay;
      const a = Math.max(s.life, 0);
      if (s.ring) {
        s.r += s.vr; s.vr *= 0.96;
        sctx.globalAlpha = a * 0.7;
        sctx.shadowBlur = 12 * a;
        sctx.strokeStyle = "#E0E0D1";
        sctx.lineWidth = 0.4 + 1.6 * a;
        sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); sctx.stroke();
        continue;
      }
      s.x += s.vx; s.y += s.vy; s.vy = s.vy * 0.95 - 0.004; s.vx *= 0.95;
      sctx.globalAlpha = a;
      sctx.shadowBlur = 6 * a;
      sctx.fillStyle = s.star ? "#F1F2E9" : "#E0E0D1";
      const r = s.size * (0.45 + 0.55 * a);          // shrink as it fades
      if (s.star) drawStar(s.x, s.y, r);
      else { sctx.beginPath(); sctx.arc(s.x, s.y, r, 0, Math.PI * 2); sctx.fill(); }
    }
    sctx.shadowBlur = 0;
    if (sparks.length) requestAnimationFrame(drawSparks);
    else { sparkLoop = false; sctx.clearRect(0, 0, innerWidth, innerHeight); }
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
    const steps = 28, duration = 700;
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const t = i / steps;
        const x = b.left + t * b.width;
        const y = b.top + b.height * 0.45 - Math.sin(t * Math.PI) * (b.height * 0.55 + 14);
        for (let k = 0; k < 3; k++) addSpark(x, y, 0.9);
        if (i === steps) { burst(x, y, 26); castRing(x, y, 1.3); }
      }, (i / steps) * duration);
    }
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
    let running = false, start = null, frame = 0;

    const tick = now => {
      if (!running) return;
      if (start === null) start = now;
      const t = (now - start) / 1000;
      const w = el.clientWidth, h = el.clientHeight;
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
     Init
     --------------------------------------------------------- */
  // Start at the top on reload (the intro is built for it); #section links still open where they point
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  applyLang();
  // Wait for webfonts (so layout is final) but never longer than ~0.8 s
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 800))])
    .then(startIntro);
})();
