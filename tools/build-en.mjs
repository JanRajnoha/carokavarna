#!/usr/bin/env node
/* =========================================================
   Builds the English page (en/index.html) from the Czech index.html
   and the translations in i18n/en.json, so Google can index both languages.

   Usage (from the repo root):  node tools/build-en.mjs
   Run it after every change to index.html or i18n/en.json, and commit en/index.html with it.
   No dependencies; needs Node 18+.
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://carokavarna.com/";
const EN_URL = SITE + "en/";

const { head, text, attr } = JSON.parse(readFileSync(join(root, "i18n/en.json"), "utf8"));
let html = readFileSync(join(root, "index.html"), "utf8");
const problems = [];

const escText = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/** Replaces exactly one match of `re` in html, or records a problem. */
function replaceOnce(re, to, what) {
  const n = (html.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) || []).length;
  if (n !== 1) { problems.push(`${what}: expected 1 match, found ${n}`); return; }
  html = html.replace(re, to);
}

/* ---------- 1. page texts: elements with data-i18n / data-i18n-html ---------- */
const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
function translateElements(src) {
  const startTag = /<([a-zA-Z][\w-]*)\b[^>]*?\sdata-i18n(-html)?="([^"]+)"[^>]*>/g;
  let out = "", pos = 0, m;
  while ((m = startTag.exec(src))) {
    const [tag, name, isHtml, key] = m;
    const innerStart = m.index + tag.length;
    // find the matching closing tag, counting nested elements of the same name
    const re = new RegExp(`<(/?)${name}\\b[^>]*>`, "gi");
    re.lastIndex = innerStart;
    let depth = 1, close = null, t;
    while ((t = re.exec(src))) {
      if (t[1]) { if (--depth === 0) { close = t.index; break; } }
      else if (!t[0].endsWith("/>") && !VOID.test(name)) depth++;
    }
    if (close === null) { problems.push(`no closing </${name}> for "${key}"`); continue; }
    const v = text[key];
    if (v == null) { problems.push(`missing translation: text "${key}"`); continue; }
    out += src.slice(pos, innerStart) + (isHtml ? v : escText(v));
    pos = close;
    startTag.lastIndex = close;
  }
  return out + src.slice(pos);
}
html = translateElements(html);

/* ---------- 2. alt / aria-label / title texts ---------- */
html = html.replace(/(\s(?:alt|aria-label|title)=")([^"]*)(")/g, (all, a, v, z) => {
  if (v in attr) return a + escAttr(attr[v]) + z;
  if (/[áčďéěíňóřšťúůýž]/i.test(v)) problems.push(`missing translation: attr "${v}"`);
  return all;
});

/* ---------- 3. language switch: link back to the Czech page (its label stays Czech on purpose) ---------- */
replaceOnce(/<a class="nav__lang"[^>]*>[^<]*<\/a>/,
  `<a class="nav__lang" href="../" hreflang="cs" lang="cs" aria-label="${escAttr(head.langSwitchLabel)}">CZ</a>`,
  "language switch");

/* ---------- 4. <head>: language, title, description, canonical, link previews ---------- */
replaceOnce(/<html lang="cs">/, '<html lang="en">', "html lang");
replaceOnce(/<title>[^<]*<\/title>/, `<title>${escText(head.title)}</title>`, "title");
replaceOnce(/(<meta name="description" content=")[^"]*/, `$1${escAttr(head.description)}`, "meta description");
replaceOnce(/(<link rel="canonical" href=")[^"]*/, `$1${EN_URL}`, "canonical");
replaceOnce(/(<meta property="og:url" content=")[^"]*/, `$1${EN_URL}`, "og:url");
replaceOnce(/<meta property="og:locale" content="cs_CZ">/,
  '<meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="cs_CZ">', "og:locale");
replaceOnce(/(<meta property="og:title" content=")[^"]*/, `$1${escAttr(head.ogTitle)}`, "og:title");
replaceOnce(/(<meta property="og:description" content=")[^"]*/, `$1${escAttr(head.ogDescription)}`, "og:description");
replaceOnce(/(<meta property="og:image:alt" content=")[^"]*/, `$1${escAttr(head.ogImageAlt)}`, "og:image:alt");
replaceOnce(/(<meta name="twitter:title" content=")[^"]*/, `$1${escAttr(head.ogTitle)}`, "twitter:title");
replaceOnce(/(<meta name="twitter:description" content=")[^"]*/, `$1${escAttr(head.twitterDescription)}`, "twitter:description");

/* ---------- 5. structured data: English description and FAQ ---------- */
const plain = s => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/\p{Extended_Pictographic}️?/gu, "").replace(/\s+/g, " ").trim();
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, a, json, z) => {
  const data = JSON.parse(json);
  if (data["@type"] === "CafeOrCoffeeShop") {
    data.description = head.cafeDescription;
    data.servesCuisine = head.servesCuisine;
  } else if (data["@type"] === "FAQPage") {
    data.mainEntity = data.mainEntity.map((q, i) => {
      const qt = text[`faq.q${i + 1}`], at = text[`faq.a${i + 1}`];
      if (qt == null || at == null) problems.push(`missing translation: faq.q${i + 1}/faq.a${i + 1}`);
      return { ...q, name: plain(qt ?? q.name), acceptedAnswer: { ...q.acceptedAnswer, text: plain(at ?? q.acceptedAnswer.text) } };
    });
  }
  const indent = "\n  ";
  return a + indent + JSON.stringify(data, null, 2).replace(/\n/g, indent) + indent + z;
});

/* ---------- 6. relative paths: the page lives one folder down ---------- */
html = html.replace(/(\s(?:src|href|data-poster|poster)=")(?!https?:|#|mailto:|tel:|\/|data:|\.\.\/)([^"]+")/g, "$1../$2");

/* ---------- write ---------- */
html = html.replace(/^(<!doctype html>\r?\n)/i,
  "$1<!-- GENERATED from ../index.html + ../i18n/en.json by tools/build-en.mjs — do not edit by hand -->\n");
if (problems.length) {
  console.error("en/index.html NOT written:\n  " + problems.join("\n  "));
  process.exit(1);
}
mkdirSync(join(root, "en"), { recursive: true });
writeFileSync(join(root, "en/index.html"), html);
console.log("en/index.html written");
