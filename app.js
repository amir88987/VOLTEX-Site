(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const C = window.VOLTEX_CONTENT || {};
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const lang = () => (root.lang === "fa" ? "fa" : "en");
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "");

  /* theme, language, menu */
  $("#themeBtn").addEventListener("click", () => {
    const n = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = n; store.set("vx-theme", n);
  });
  function applyLang(l) { root.lang = l; root.dir = l === "fa" ? "rtl" : "ltr"; store.set("vx-lang", l); }
  const META = {
    en: { t: "VOLTEX | Computer Services & Telegram Bots", d: "Windows software, computer services and Telegram bots, with support in English and Persian." },
    fa: { t: "VOLTEX | خدمات رایانه و ربات تلگرام", d: "نرم‌افزار ویندوز، خدمات رایانه و ربات تلگرامی با پشتیبانی فارسی و انگلیسی." },
  };
  function setMeta(l) {
    document.title = META[l].t;
    const m = document.querySelector('meta[name="description"]'); if (m) m.content = META[l].d;
  }
  $("#langBtn").addEventListener("click", () => { applyLang(lang() === "fa" ? "en" : "fa"); setMeta(lang()); });
  applyLang(lang());
  if (lang() === "fa") setMeta("fa");
  $("#burger").addEventListener("click", () => $("#links").classList.toggle("open"));
  $("#links").addEventListener("click", () => $("#links").classList.remove("open"));
  $("#yr").textContent = new Date().getFullYear();

  /* tiny DOM helpers (text only, so content can never inject HTML) */
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function bi(parent, obj) {
    ["en", "fa"].forEach((l) => { const sp = el("span", l, (obj && obj[l]) || ""); sp.lang = l; parent.appendChild(sp); });
    return parent;
  }
  function link(cls, href, label) {
    const a = el("a", cls);
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    bi(a, label);
    return a;
  }
  function fill(id, items, build, emptyLabel) {
    const box = $(id);
    box.textContent = "";
    if (!items || !items.length) {
      const p = el("p", "empty"); bi(p, emptyLabel); box.appendChild(p); return;
    }
    items.forEach((it) => box.appendChild(build(it)));
  }
  const ICONS = {
    bolt: "M13 2 4 14h6l-1 8 9-12h-6z",
    shield: "M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6z M9 12l2 2 4-4",
    chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z",
    wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.2-.5-.5-2.2z",
    disk: "M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 7v5c0 1.7 3.6 3 8 3s8-1.3 8-3V7 M4 12v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5",
    code: "M8 8l-4 4 4 4 M16 8l4 4-4 4 M14 5l-4 14",
    monitor: "M3 5h18v11H3z M8 20h8 M12 16v4",
    heart: "M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z",
    rocket: "M12 15l-3-3a15 15 0 0 1 5-8c2-1.5 5-1.5 6-1.5 0 1 0 4-1.5 6a15 15 0 0 1-8 5z M9 12H5l2-3h4 M12 15v4l3-2v-4 M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5",
    users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M21 20v-1a4 4 0 0 0-3-3.9 M16 4.1a3.5 3.5 0 0 1 0 6.8",
    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  };
  function ico(name) {
    const d = el("div", "ico");
    if (ICONS[name]) d.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[name] + '"/></svg>';
    else d.textContent = name || "⚡";
    return d;
  }
  const EMPTY = { en: "Nothing here yet.", fa: "هنوز چیزی اضافه نشده." };
  const TG_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 3.6 2.8 11c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.8c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8L23.5 5c.3-1.3-.5-1.9-1.6-1.4zM8.2 13.5l10.8-6.8c.5-.3 1-.1.6.2l-8.8 7.9-.3 3.7z"/></svg>';
  const PLAY_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  /* render content */
  ["#aboutText", "#statsRow", "#stepsList", "#faqList", "#contactList"].forEach((id) => ($(id).textContent = ""));
  const about = $("#aboutText");
  ["en", "fa"].forEach((l) => {
    String((C.about && C.about[l]) || "").split(/\n+/).forEach((para) => { const pp = el("p", l, para); pp.lang = l; about.appendChild(pp); });
  });

  function showcase(it) {
    const c = el("article", "card");
    c.appendChild(ico(it.icon));
    c.appendChild(bi(el("h3"), it.title));
    c.appendChild(bi(el("p"), it.desc));
    const u = safeUrl(it.link);
    if (u) c.appendChild(link("more", u, { en: "Learn more", fa: "اطلاعات بیشتر" }));
    return c;
  }
  const DL_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>';
  function software(it) {
    const c = el("article", "card sw");
    c.appendChild(ico(it.icon));
    c.appendChild(bi(el("h3"), it.title));
    c.appendChild(bi(el("p"), it.desc));
    const meta = el("div", "meta");
    [it.platform, it.version ? "v" + String(it.version).replace(/^v/i, "") : "", it.size].filter(Boolean).forEach((x) => meta.appendChild(el("span", "chipm", x)));
    if (meta.childNodes.length) c.appendChild(meta);
    const u = safeUrl(it.download || it.link);
    if (u) {
      const a = link("btn small", u, { en: "Download", fa: "دانلود" });
      const ic = el("span", "dl"); ic.innerHTML = DL_SVG; a.insertBefore(ic, a.firstChild);
      c.appendChild(a);
    } else {
      c.appendChild(bi(el("span", "soon"), { en: "Coming soon", fa: "به‌زودی" }));
    }
    return c;
  }
  fill("#softwareCards", C.software, software, EMPTY);
  fill("#servicesCards", C.services, showcase, EMPTY);

  fill("#botsCards", C.bots, (b) => {
    const c = el("article", "card");
    const ic = el("div", "ico tg"); ic.innerHTML = TG_SVG; c.appendChild(ic);
    c.appendChild(el("h3", null, b.name || ""));
    c.appendChild(bi(el("p"), b.desc));
    c.appendChild(link("btn small", safeUrl(b.url) || "https://t.me/", { en: "Open in Telegram", fa: "باز کردن در تلگرام" }));
    return c;
  }, { en: "Bots are coming soon.", fa: "ربات‌ها به‌زودی اضافه می‌شوند." });

  let ti = 0;
  fill("#tutorialsCards", C.tutorials, (t) => {
    const c = el("article", "card vid");
    const th = el("div", "thumb");
    th.style.setProperty("--h", String((190 + 55 * ti++) % 360));
    const img = safeUrl(t.thumb);
    if (img) th.style.backgroundImage = 'url("' + encodeURI(img) + '")';
    const pl = el("span", "play"); pl.innerHTML = PLAY_SVG; th.appendChild(pl);
    c.appendChild(th);
    c.appendChild(bi(el("h3"), t.title));
    c.appendChild(bi(el("p"), t.desc));
    const v = safeUrl(t.video);
    if (v) c.appendChild(link("more", v, { en: "Watch video", fa: "تماشای ویدیو" }));
    else c.appendChild(bi(el("span", "soon"), { en: "Video coming soon", fa: "ویدیو به‌زودی" }));
    return c;
  }, { en: "No tutorials yet.", fa: "هنوز آموزشی اضافه نشده." });

  const ct = C.contact || {}, list = $("#contactList");
  function row(label, node) {
    const li = el("li"); li.appendChild(bi(el("span"), label)); li.appendChild(node); list.appendChild(li);
  }
  function ext(href, text, mail) {
    const a = el("a", null, text); a.href = href; a.dir = "ltr";
    if (!mail) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }
  if (safeUrl(ct.supportTelegram)) row({ en: "Telegram", fa: "تلگرام" }, ext(ct.supportTelegram, ct.supportTelegram));
  if (ct.email) row({ en: "Email", fa: "ایمیل" }, ext("mailto:" + ct.email, ct.email, true));
  if (ct.hours) { const b = el("b"); bi(b, ct.hours); row({ en: "Hours", fa: "ساعت پاسخگویی" }, b); }
  if (safeUrl(ct.telegramChannel)) row({ en: "Channel", fa: "کانال" }, ext(ct.telegramChannel, ct.telegramChannel));

  /* stats, features, steps, FAQ */
  const sr = $("#statsRow");
  (C.stats || []).forEach((x) => {
    const d = el("div", "stat"); d.appendChild(el("b", null, x.value || "")); d.appendChild(bi(el("span"), x.label)); sr.appendChild(d);
  });
  if (!(C.stats || []).length) $(".stats").hidden = true;
  fill("#featuresCards", C.features, showcase, EMPTY);
  const sl = $("#stepsList");
  (C.steps || []).forEach((x, i) => {
    const li = el("li"); li.appendChild(el("span", "n", String(i + 1)));
    const d = el("div"); d.appendChild(bi(el("h4"), x.title)); d.appendChild(bi(el("p"), x.desc)); li.appendChild(d); sl.appendChild(li);
  });
  const fl = $("#faqList");
  (C.faq || []).forEach((x) => {
    const d = el("details"); d.appendChild(bi(el("summary"), x.q)); d.appendChild(bi(el("p"), x.a)); fl.appendChild(d);
  });

  /* gentle reveal on scroll (content stays visible if JS or IntersectionObserver is missing) */
  if ("IntersectionObserver" in window) {
    root.classList.add("js");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    document.querySelectorAll(".sh,.sh2,.sub,.cards,.stats-in,.mock,.steps,.faq,.about,.cta-band .wrap").forEach((n) => { n.classList.add("rv"); io.observe(n); });
  }

  /* footer links, card spotlight, scroll progress, back to top */
  const fTg = $("#fTg"), fMail = $("#fMail");
  if (safeUrl(ct.telegramChannel)) { fTg.href = ct.telegramChannel; fTg.hidden = false; }
  if (ct.email) { fMail.href = "mailto:" + ct.email; fMail.hidden = false; }

  document.addEventListener("pointermove", (e) => {
    const c = e.target.closest && e.target.closest(".card");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  });
  const prog = el("div"); prog.id = "prog"; document.body.appendChild(prog);
  const up = el("button"); up.id = "toTop"; up.type = "button"; up.setAttribute("aria-label", "Top");
  up.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  up.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(up);
  const nav = $(".nav");
  function onScroll() {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    prog.style.transform = "scaleX(" + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ")";
    nav.classList.toggle("scrolled", h.scrollTop > 8);
    up.classList.toggle("on", h.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* membership form (sends to your own form service, never shown on the site) */
  const M = {
    en: { joined: "Thanks! You are on the list.", name: "Please enter your name.", email: "Please enter a valid email.", net: "Could not send. Check your connection and try again.", off: "Membership form is not set up yet." },
    fa: { joined: "ممنون! نام شما ثبت شد.", name: "لطفا نام خود را وارد کنید.", email: "لطفا ایمیل معتبر وارد کنید.", net: "ارسال نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.", off: "فرم عضویت هنوز راه‌اندازی نشده است." },
  };
  const tr = (k) => M[lang()][k];
  function say(node, kind, text) { node.className = "msg " + kind; node.textContent = text; }

  $("#joinBtn").addEventListener("click", async () => {
    const msg = $("#joinMsg"), btn = $("#joinBtn");
    const name = $("#jName").value.trim(), email = $("#jEmail").value.trim(), telegram = $("#jTg").value.trim();
    if (!name) return say(msg, "err", tr("name"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return say(msg, "err", tr("email"));
    const url = safeUrl(C.joinFormUrl);
    if (!url) return say(msg, "err", tr("off"));
    btn.disabled = true;
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, telegram }),
      });
      if (!r.ok) throw new Error("bad");
      say(msg, "ok", tr("joined"));
      ["#jName", "#jEmail", "#jTg"].forEach((s) => ($(s).value = ""));
    } catch (e) { say(msg, "err", tr("net")); }
    finally { btn.disabled = false; }
  });
})();
