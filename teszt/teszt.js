// A jelentkezés kitöltött levele a választott nyelven (a cím a brand.js-ből,
// a szöveg az i18n.js-ből). Nyelvváltáskor újra.
function testMail() {
  const lang = TEXTS[document.documentElement.lang] ? document.documentElement.lang : 'hu';
  const t = (key) => TEXTS[lang][key].replaceAll('{brand}', BRAND.name);
  const href = `mailto:${BRAND.contactEmail}`
    + `?subject=${encodeURIComponent(t('testMailSubject'))}`
    + `&body=${encodeURIComponent(t('testMailBody'))}`;
  document.querySelectorAll('[data-test-mail]').forEach((a) => {
    a.href = href;
  });
}

new MutationObserver(testMail).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
testMail();
