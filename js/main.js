/* =========================================================
   Čarokavárna — interactions
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------------
     Content: menu (both languages)
     TODO: "Drinky" and "Produkty" are placeholder items — replace with the real offer.
     --------------------------------------------------------- */
  const MENU = [
    {
      id: "kava", icon: "🔮", label: { cs: "Káva", en: "Coffee" },
      items: [
        { cs: ["Espresso čaroděje", "Silná, čistá, plná magie. Základ každého dobrého zaříkání."], en: ["Wizard's Espresso", "Strong, pure, full of magic. The base of every good spell."], price: "55 Kč" },
        { cs: ["Cappuccino zatmění", "Klasické cappuccino s hustou pěnou posypanou kakaem jako noční obloha."], en: ["Eclipse Cappuccino", "Classic cappuccino with thick foam dusted with cocoa like a night sky."], price: "85 Kč" },
        { cs: ["Latte z kouzelného háje", "Jemné mléčné latte s výběrovou kávou a kouzelným latte art vzorem."], en: ["Enchanted Grove Latte", "Smooth milky latte with specialty coffee and magical latte art."], price: "89 Kč" },
        { cs: ["Horká čokoláda se šlehačkovou bouří", "Bohatá čokoláda s kopcem šlehačky, karamelem a jiskřivými ozdobami."], en: ["Hot Chocolate with a Cream Storm", "Rich chocolate with a mountain of whipped cream, caramel and sparkling toppings."], price: "129 Kč" },
        { cs: ["Dračí latte", "Speciální latte s butterfly pea práškem — mění barvu jako pravý drak."], en: ["Dragon Latte", "A special latte with butterfly pea powder — it changes colour like a real dragon."], price: "115 Kč" },
        { cs: ["Ledová magická káva", "Osvěžující cold brew s mlékem, karamelem a javorovým sirupem."], en: ["Iced Magic Coffee", "Refreshing cold brew with milk, caramel and maple syrup."], price: "99 Kč" },
      ],
    },
    {
      id: "drinky", icon: "🧪", label: { cs: "Drinky", en: "Drinks" },
      items: [
        { cs: ["Kouřící lektvar", "Barevný nealko lektvar v lektvarnici, zahalený v oblaku suchého ledu."], en: ["Smoking Potion", "A colourful alcohol-free potion served in a potion flask, wrapped in dry-ice fog."], price: "119 Kč" },
        { cs: ["Elixír lesních víl", "Ovocný ledový čaj s lesním ovocem a mátou."], en: ["Forest Fairy Elixir", "Fruity iced tea with forest berries and mint."], price: "89 Kč" },
        { cs: ["Domácí limonáda", "Osvěžující limonáda podle denní nálady našeho alchymisty."], en: ["House Lemonade", "A refreshing lemonade, made to our alchemist's mood of the day."], price: "79 Kč" },
      ],
    },
    {
      id: "dortiky", icon: "🍰", label: { cs: "Dortíky", en: "Cakes" },
      items: [
        { cs: ["Čarodějnický dort dne", "Čerstvý dort z naší kouzelné pekárny. Ptejte se obsluhy na dnešní variaci."], en: ["Witch's Cake of the Day", "A fresh cake from our magical bakery. Ask our staff about today's creation."], price: { cs: "od 89 Kč", en: "from 89 Kč" } },
        { cs: ["Magický cheesecake", "Krémový cheesecake s kouzelnou toppingovou dekorací."], en: ["Magic Cheesecake", "Creamy cheesecake with an enchanted topping."], price: "109 Kč" },
        { cs: ["Lektvarový brownie", "Tmavý, intenzivní čokoládový brownie jako přímo z černého kotle."], en: ["Potion Brownie", "Dark, intense chocolate brownie, straight from the black cauldron."], price: "75 Kč" },
      ],
    },
    {
      id: "kotlik", icon: "🫕", label: { cs: "Kotlík", en: "Cauldron" },
      feature: {
        cs: ["Magický kotlík se suchým ledem 🧪", "Při usazení vám přineseme náš legendární kouřící kotlík se suchým ledem. Vaše nápoje jsou servírovány v autentických lektvarnicích se spektakulárním kouřovým efektem — zážitek, na který se nezapomíná.", "✦ Při útratě nad 1 000 Kč obdržíte magický pohár ZDARMA"],
        en: ["Magic Cauldron with Dry Ice 🧪", "Once you're seated, we bring you our legendary smoking cauldron with dry ice. Your drinks are served in authentic potion flasks with a spectacular smoke effect — an experience you won't forget.", "✦ Spend over 1,000 Kč and get a magic goblet FREE"],
        photo: "assets/img/kotlik.jpg",
        caption: { cs: "Lektvary dostupné v mnoha barvách a příchutích.", en: "Potions available in many colours and flavours." },
      },
    },
    {
      id: "produkty", icon: "🧙", label: { cs: "Produkty", en: "Products" },
      items: [
        { cs: ["Licencované produkty", "Hrnky, šály, hůlky a další poklady ze světa čar a kouzel. Aktuální nabídku najdete přímo v kavárně."], en: ["Licensed merchandise", "Mugs, scarves, wands and other treasures from the wizarding world. See the current range in the café."], price: { cs: "dle nabídky", en: "varies" } },
        { cs: ["Magický pohár", "Sběratelský pohár, který si odnesete domů jako památku."], en: ["Magic Goblet", "A collectible goblet to take home as a keepsake."], price: { cs: "na dotaz", en: "on request" } },
      ],
    },
  ];

  /* ---------------------------------------------------------
     Content: static strings (EN). CZ is read from the HTML.
     --------------------------------------------------------- */
  const EN = {
    "nav.about": "About", "nav.menu": "Menu", "nav.gallery": "Gallery", "nav.branches": "Contact", "nav.reservation": "Booking",
    "hero.line1": "Where every cup", "hero.line2": "hides a spell", "hero.tag": "Magical café", "hero.cta": "Enter the world of magic",
    "about.title": "— a place where<br>magic comes alive",
    "about.p1": "Čarokavárna is a place where fairy-tale worlds meet the aroma of fresh coffee. Our café in Brno is full of magic — from smoking cauldrons of dry ice, through mysterious potions served in potion flasks, to cakes from another world.",
    "about.p2": "Inspired by worlds of witchcraft and wizardry, we offer an experience for the whole family — magic you'll carry home in your heart. Come and see for yourself.",
    "chip.coffee": "Specialty coffee", "chip.potions": "Smoking potions", "chip.cakes": "Magical cakes", "chip.products": "Licensed products",
    "menu.note": "The menu may change with the daily offer. We're happy to advise you on site.",
    "gallery.title1": "Take a look", "gallery.title2": "inside",
    "gallery.c1": "Hot chocolate", "gallery.c2": "Smoking potions", "gallery.c3": "Interior", "gallery.c4": "Our menu",
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
    renderTabs();
    renderMenu();
  }

  document.querySelectorAll("[data-lang-toggle]").forEach(btn => btn.addEventListener("click", () => {
    lang = lang === "en" ? "cs" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) { /* storage unavailable */ }
    applyLang();
  }));

  /* ---------------------------------------------------------
     Menu tabs
     --------------------------------------------------------- */
  const tabsEl = document.querySelector(".tabs");
  const panelEl = document.getElementById("menu-panel");
  let activeTab = MENU[0].id;

  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function renderTabs() {
    tabsEl.innerHTML = MENU.map(cat => `
      <button class="tab" type="button" role="tab" id="tab-${cat.id}" data-tab="${cat.id}"
        aria-selected="${cat.id === activeTab}" aria-controls="menu-panel" tabindex="${cat.id === activeTab ? 0 : -1}">
        <span aria-hidden="true">${cat.icon}</span>${esc(cat.label[lang])}
      </button>`).join("");
  }

  function renderMenu() {
    const cat = MENU.find(c => c.id === activeTab);
    panelEl.setAttribute("aria-labelledby", `tab-${cat.id}`);

    if (cat.feature) {
      const [title, text, perk] = cat.feature[lang];
      panelEl.innerHTML = `
        <div class="menu-grid">
          <article class="menu-card menu-card--feature">
            <h3>${esc(title)}</h3>
            <p>${esc(text)}</p>
            <p class="perk">${esc(perk)}</p>
          </article>
          <article class="menu-card menu-card--photo" style="animation-delay:.08s">
            <img src="${cat.feature.photo}" alt="" loading="lazy">
            <p>${esc(cat.feature.caption[lang])}</p>
          </article>
        </div>`;
      return;
    }

    panelEl.innerHTML = `<div class="menu-grid">${cat.items.map((item, i) => {
      const [name, desc] = item[lang];
      return `
        <article class="menu-card" style="animation-delay:${i * 0.06}s">
          <h3>${esc(name)}</h3>
          <p>${esc(desc)}</p>
          <p class="price">${esc(pick(item.price))}</p>
        </article>`;
    }).join("")}</div>`;
  }

  tabsEl.addEventListener("click", e => {
    const btn = e.target.closest("[data-tab]");
    if (!btn || btn.dataset.tab === activeTab) return;
    activeTab = btn.dataset.tab;
    renderTabs();
    renderMenu();
    tabsEl.querySelector(`[data-tab="${activeTab}"]`).focus();
    const r = btn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 14);
  });

  tabsEl.addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = MENU.findIndex(c => c.id === activeTab);
    const next = MENU[(i + (e.key === "ArrowRight" ? 1 : -1) + MENU.length) % MENU.length];
    tabsEl.querySelector(`[data-tab="${next.id}"]`).click();
  });

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
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
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
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => {
    // small stagger for siblings revealed together; cleared afterwards so hover effects aren't delayed
    const sibIndex = [...el.parentElement.children].filter(c => c.classList.contains("reveal")).indexOf(el);
    if (sibIndex > 0) {
      el.style.transitionDelay = `${Math.min(sibIndex, 4) * 0.08}s`;
      el.addEventListener("transitionend", () => { el.style.transitionDelay = ""; }, { once: true });
    }
    revealObserver.observe(el);
  });

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

  document.querySelectorAll(".gallery__item").forEach(item => {
    item.tabIndex = 0;
    const open = () => {
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add("is-open");
    };
    item.addEventListener("click", open);
    item.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
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
      s.x += s.vx; s.y += s.vy; s.vy = s.vy * 0.95 - 0.004; s.vx *= 0.95;
      s.life -= s.decay;
      const a = Math.max(s.life, 0);
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

    document.querySelectorAll(".btn, .chip, .logo, .tab").forEach(el =>
      el.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") burst(e.clientX, e.clientY, 10); }));
  }

  /* ---------------------------------------------------------
     Instagram — live feed via Behold (behold.so)
     - Fetched only when the section is about to scroll into view
     - Cached in the visitor's browser for 12 h, so reloads/repeat visits
       don't use up the monthly view quota
     - Any failure (no URL, quota reached, offline) keeps the static photos
     --------------------------------------------------------- */
  const igSection = document.getElementById("instagram");
  const igGrid = document.querySelector("[data-ig-grid]");
  const feedUrl = igSection && igSection.dataset.beholdFeed.trim();
  const IG_CACHE_KEY = "ig-feed-v1";
  const IG_CACHE_TTL = 12 * 60 * 60 * 1000;
  const IG_MAX_POSTS = 6;

  const readIgCache = () => {
    try {
      const c = JSON.parse(localStorage.getItem(IG_CACHE_KEY));
      if (c && c.url === feedUrl && Date.now() - c.t < IG_CACHE_TTL) return c.posts;
    } catch (e) { /* storage unavailable */ }
    return null;
  };
  const writeIgCache = posts => {
    try { localStorage.setItem(IG_CACHE_KEY, JSON.stringify({ url: feedUrl, t: Date.now(), posts })); } catch (e) { /* storage unavailable */ }
  };

  // Behold returns either { posts: [...] } or a bare array depending on feed version
  const normalizePosts = data => (Array.isArray(data) ? data : (data && data.posts) || [])
    .map(p => ({
      href: p.permalink,
      src: (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl)
        || (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl)
        || p.thumbnailUrl,
      alt: (p.prunedCaption || p.caption || "").replace(/\s+/g, " ").slice(0, 120) || "Příspěvek na Instagramu",
    }))
    .filter(p => p.href && p.src)
    .slice(0, IG_MAX_POSTS);

  function renderIg(posts) {
    if (!posts || !posts.length) return;
    igGrid.innerHTML = posts.map(p => `
      <a href="${esc(p.href)}" target="_blank" rel="noopener">
        <img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy">
      </a>`).join("");
  }

  async function loadIg() {
    const cached = readIgCache();
    if (cached) { renderIg(cached); return; }
    igGrid.classList.add("is-loading");
    try {
      const res = await fetch(feedUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const posts = normalizePosts(await res.json());
      if (posts.length) { renderIg(posts); writeIgCache(posts); }
    } catch (err) {
      console.warn("Instagram feed unavailable, showing static photos.", err);
    } finally {
      igGrid.classList.remove("is-loading");
    }
  }

  if (feedUrl && igGrid) {
    const igObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      igObserver.disconnect();
      loadIg();
    }, { rootMargin: "400px 0px" });
    igObserver.observe(igSection);
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
     Init
     --------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  applyLang();
  // Wait for webfonts (so layout is final) but never longer than ~0.8 s
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 800))])
    .then(startIntro);
})();
