// A márka adatai egy helyen: ha az app neve vagy a kapcsolattartási cím
// változik, csak ezt kell átírni. (A cím az appban a lib/core/submission.dart
// kContactEmail konstansa; a kettőt együtt kell módosítani.)
const BRAND = {
  name: 'GymBro',
  contactEmail: ['7991samatigetzsereP', 'moc.liamg'].map((s) => [...s].reverse().join('')).join('@'),
};

document.querySelectorAll('[data-brand]').forEach((el) => {
  el.textContent = BRAND.name;
});
document.querySelectorAll('[data-contact]').forEach((el) => {
  el.href = `mailto:${BRAND.contactEmail}`;
});
document.title = document.title.replace('{brand}', BRAND.name);
document.querySelectorAll('[data-contact-text]').forEach((el) => {
  el.textContent = BRAND.contactEmail;
});
